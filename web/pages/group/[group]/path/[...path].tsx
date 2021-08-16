import { useRouter } from "next/router";
import React from "react";
import { GroupQuery, MeMe } from "../../../../generated/apolloComponents";
import { GetRepoObjectQuery } from "../../../../generated/github-apollo-components";
import { getRepoObject } from "../../../../github-graphql/query/getRepo";
import { groupQuery } from "../../../../graphql/group/query/group";
import { NextFunctionComponent } from "../../../../types";
import { withAuth } from "../../../../lib/HOC/withAuth";
import { redirect } from "../../../../lib/redirect";
import GroupContainer from "../../../../src/components/GroupContainer";
import { responseIsInvalid } from "../../../../src/utils/isResponseValid";
import { MeContext } from "../../../../src/context/meContext";
import GroupLayout from "../../../../src/components/Layout";

const Path: NextFunctionComponent<{ me: MeMe }> = ({ me }) => {
  const router = useRouter();
  if (!router) return null;

  const { group } = router.query;

  return (
    <MeContext.Provider value={me}>
      <GroupLayout
        me={me}
        title={router.query.path[router.query.path.length - 1]}
      >
        <GroupContainer
          group={group as string}
          path={router.query.path as string[]}
        />
      </GroupLayout>
    </MeContext.Provider>
  );
};

Path.getInitialProps = async ({ apolloClient, ...ctx }) => {
  const path = (ctx.query.path as string[]).join("/");
  const { group } = ctx.query;
  if (group == null) return redirect(ctx, "/");

  const response = await apolloClient.query<GroupQuery>({
    query: groupQuery,
    variables: { path, groupId: parseInt(group as string) },
  });
  if (responseIsInvalid<GroupQuery>(response, "group"))
    return redirect(ctx, "/");

  const githubRes = await apolloClient.query<GetRepoObjectQuery>({
    context: { server: "github" },
    query: getRepoObject,
    variables: {
      owner: response.data.group!.repoOwner,
      name: response.data.group!.repoName,
      expression: `${response.data.group!.mainBranch}:${path}`,
    },
  });
  if (responseIsInvalid<GetRepoObjectQuery>(githubRes, "repository"))
    return redirect(ctx, "/");

  return { groupData: response.data, repoData: githubRes.data };
};

export default withAuth(Path);
