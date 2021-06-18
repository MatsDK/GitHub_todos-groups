import { useRouter } from "next/router";
import { GroupGroup, GroupComponent } from "../../generated/apolloComponents";
import { GetRepoObjectComponent } from "../../generated/github-apollo-components";
import { groupQuery } from "../../graphql/group/query/group";
import { NextFunctionComponent } from "../../interfaces/types";
import { redirect } from "../../lib/redirect";
import Layout from "../../src/components/Layout";
import GroupView from "../../src/components/GroupView";

interface Props {
  groupData: GroupGroup;
}

const Group: NextFunctionComponent<Props> = ({}) => {
  const router = useRouter();
  if (!router || !router.query) return null;
  const { group } = router.query;

  return (
    <Layout title="Group">
      <div>
        {typeof group == "string" && (
          <GroupComponent variables={{ groupId: parseInt(group as string) }}>
            {({ data }) => {
              if (!data || !data.group) return null;

              return (
                <>
                  <GetRepoObjectComponent
                    context={{ x: "github" }}
                    variables={{ owner: "MatsDK", name: "SSH_Files" }}
                  >
                    {({ data: repoData }) => {
                      console.log(repoData);

                      return <GroupView group={data.group as GroupGroup} />;
                    }}
                  </GetRepoObjectComponent>
                </>
              );
            }}
          </GroupComponent>
        )}
      </div>
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

  // const res = await apolloClient.query<GetRepoObjectQuery>({
  //   context: { x: "github" },
  //   query: getRepoObject,
  //   variables: {
  //     owner: "MatsDK",
  //     name: "SSH_Files",
  //   },
  // });

  if (!response || !response.data || !(response.data as any).group)
    return redirect(ctx, "/");

  return { groupData: response.data };
};

export default Group;
