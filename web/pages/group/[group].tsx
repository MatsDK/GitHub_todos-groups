import { useRouter } from "next/router";
import { GroupGroup, GroupComponent } from "../../generated/apolloComponents";
import {
  GetRepoObjectComponent,
  GetRepoObjectQuery,
} from "../../generated/github-apollo-components";
import { groupQuery } from "../../graphql/group/query/group";
import { NextFunctionComponent } from "../../interfaces/types";
import { redirect } from "../../lib/redirect";
import Layout from "../../src/components/Layout";
import GroupView from "../../src/components/GroupView";
import { getRepoObject } from "../../github-graphql/query/getRepo";
import { ApolloQueryResult } from "@apollo/client";

interface Props {
  groupData: GroupGroup;
  repoData: GetRepoObjectQuery;
}

const Group: NextFunctionComponent<Props> = ({}) => {
  const router = useRouter();
  if (!router || !router.query) return null;
  const { group } = router.query;

  return (
    <Layout title="Group">
      <>
        {typeof group == "string" && (
          <GroupComponent variables={{ groupId: parseInt(group as string) }}>
            {({ data }) => {
              if (!data || !data.group) return null;

              return (
                <>
                  <GetRepoObjectComponent
                    context={{ server: "github" }}
                    variables={{
                      owner: "MatsDK",
                      name: "SSH_Files",
                      expression: "master:",
                    }}
                  >
                    {({ data: repoData }) => {
                      console.log(repoData, data);

                      return <GroupView group={data.group as GroupGroup} />;
                    }}
                  </GetRepoObjectComponent>
                </>
              );
            }}
          </GroupComponent>
        )}
      </>
    </Layout>
  );
};

Group.getInitialProps = async ({ apolloClient, ...ctx }) => {
  const { group } = ctx.query;
  if (group == null) return redirect(ctx, "/");

  const response = await apolloClient.query<GroupGroup>({
    query: groupQuery,
    variables: { groupId: parseInt(group as string) },
  });
  if (responseIsInvalid<GroupGroup>(response, "group"))
    return redirect(ctx, "/");

  const githubRes = await apolloClient.query<GetRepoObjectQuery>({
    context: { server: "github" },
    query: getRepoObject,
    variables: {
      owner: "MatsDK",
      name: "SSH_Files",
      expression: "master:",
    },
  });
  if (responseIsInvalid<GetRepoObjectQuery>(githubRes, "repository"))
    return redirect(ctx, "/");

  return { groupData: response.data, repoData: githubRes.data };
};

const responseIsInvalid = <T extends GroupGroup | GetRepoObjectQuery>(
  response: ApolloQueryResult<T>,
  key: string
) => !response || !response.data || !(response.data as any)[key];

export default Group;
