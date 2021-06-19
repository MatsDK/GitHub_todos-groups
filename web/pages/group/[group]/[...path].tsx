import { useRouter } from "next/router";
import React from "react";
import {
  GroupComponent,
  GroupGroup,
  GroupQuery,
} from "../../../generated/apolloComponents";
import {
  GetRepoObjectComponent,
  GetRepoObjectQuery,
} from "../../../generated/github-apollo-components";
import { getRepoObject } from "../../../github-graphql/query/getRepo";
import { groupQuery } from "../../../graphql/group/query/group";
import { NextFunctionComponent } from "../../../interfaces/types";
import { redirect } from "../../../lib/redirect";
import GroupView from "../../../src/components/GroupView";
import Layout from "../../../src/components/Layout";
import { responseIsInvalid } from "../../../src/isResponseValid";

const Path: NextFunctionComponent<any> = () => {
  const router = useRouter();
  if (!router) return null;

  const path = (router.query.path as string[]).join("/");
  const { group } = router.query;

  return (
    <Layout>
      {typeof group == "string" && (
        <GroupComponent variables={{ groupId: parseInt(group as string) }}>
          {({ data }) => {
            if (!data || !data.group) return null;

            return (
              <GetRepoObjectComponent
                context={{ server: "github" }}
                variables={{
                  owner: "MatsDK",
                  name: data.group.repoName,
                  expression: `${data.group.mainBranch}:${path}`,
                }}
              >
                {({ data: repoData }) => {
                  console.log(repoData, data);
                  if (!repoData || !repoData.repository) return null;

                  return (
                    <GroupView
                      path={{ groupId: data.group!.id, path }}
                      group={data.group as GroupGroup}
                      repoData={repoData.repository}
                    />
                  );
                }}
              </GetRepoObjectComponent>
            );
          }}
        </GroupComponent>
      )}
    </Layout>
  );
};

Path.getInitialProps = async ({ apolloClient, ...ctx }) => {
  const path = (ctx.query.path as string[]).join();
  const { group } = ctx.query;
  if (group == null) return redirect(ctx, "/");

  const response = await apolloClient.query<GroupQuery>({
    query: groupQuery,
    variables: { groupId: parseInt(group as string) },
  });
  if (responseIsInvalid<GroupQuery>(response, "group"))
    return redirect(ctx, "/");

  const githubRes = await apolloClient.query<GetRepoObjectQuery>({
    context: { server: "github" },
    query: getRepoObject,
    variables: {
      owner: "MatsDK",
      name: response.data.group!.repoName,
      expression: `${response.data.group!.mainBranch}:${path}`,
    },
  });
  if (responseIsInvalid<GetRepoObjectQuery>(githubRes, "repository"))
    return redirect(ctx, "/");

  return { groupData: response.data, repoData: githubRes.data };
};

export default Path;
