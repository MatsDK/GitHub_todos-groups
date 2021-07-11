import { useRouter } from "next/router";
import { GroupGroup, GroupQuery, MeMe } from "../../generated/apolloComponents";
import { GetRepoObjectQuery } from "../../generated/github-apollo-components";
import { getRepoObject } from "../../github-graphql/query/getRepo";
import { groupQuery } from "../../graphql/group/query/group";
import { NextFunctionComponent } from "../../types";
import { redirect } from "../../lib/redirect";
import Layout from "../../src/components/Layout";
import { responseIsInvalid } from "../../src/isResponseValid";
import GroupContainer from "../../src/components/GroupContainer";
import { withAuth } from "../../lib/HOC/withAuth";
import { MeContext } from "../../src/context/meContext";

interface Props {
  groupData: GroupGroup;
  repoData: GetRepoObjectQuery;
  me: MeMe;
}

const Group: NextFunctionComponent<Props> = ({ me }) => {
  const router = useRouter();
  if (!router || !router.query) return null;
  const { group } = router.query;

  return (
    <MeContext.Provider value={me}>
      <Layout me={me} title="Group">
        <GroupContainer me={me} path={[]} group={group as string} />
      </Layout>
    </MeContext.Provider>
  );
};

Group.getInitialProps = async ({ apolloClient, ...ctx }) => {
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
      owner: response.data.group!.repoOwner,
      name: response.data.group!.repoName,
      expression: `${response.data.group!.mainBranch}:`,
    },
  });
  if (responseIsInvalid<GetRepoObjectQuery>(githubRes, "repository"))
    return redirect(ctx, "/");

  return { groupData: response.data, repoData: githubRes.data };
};

export default withAuth(Group);
