import { useRouter } from "next/router";
import { GroupGroup, GroupQuery, MeMe } from "../../generated/apolloComponents";
import { GetRepoObjectQuery } from "../../generated/github-apollo-components";
import { getRepoObject } from "../../github-graphql/query/getRepo";
import { groupQuery } from "../../graphql/group/query/group";
import { NextFunctionComponent } from "../../interfaces/types";
import { redirect } from "../../lib/redirect";
import Layout from "../../src/components/Layout";
import { responseIsInvalid } from "../../src/isResponseValid";
import GroupContainer from "../../src/components/GroupContainer";
import { withAuth } from "../../lib/HOC/withAuth";

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
    <Layout me={me} title="Group">
      <GroupContainer me={me} path={[]} group={group as string} />
    </Layout>
  );
};

Group.getInitialProps = async ({ apolloClient, ...ctx }) => {
  const { group } = ctx.query;
  if (group == null) return redirect(ctx, "/");

  const response = await apolloClient.query<GroupQuery>({
    query: groupQuery,
    variables: { path: "", groupId: parseInt(group as string) },
  });
  if (responseIsInvalid<GroupQuery>(response, "group"))
    return redirect(ctx, "/");

  const githubRes = await apolloClient.query<GetRepoObjectQuery>({
    context: { server: "github" },
    query: getRepoObject,
    variables: {
      owner: "MatsDK",
      name: response.data.group!.repoName,
      expression: `${response.data.group!.mainBranch}:`,
    },
  });
  if (responseIsInvalid<GetRepoObjectQuery>(githubRes, "repository"))
    return redirect(ctx, "/");

  return { groupData: response.data, repoData: githubRes.data };
};

export default withAuth(Group);
