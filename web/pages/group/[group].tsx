import Layout from "../../components/Layout";
import {
  GroupComponent,
  GroupGroup,
  GroupUsers,
} from "../../generated/apolloComponents";
import { useRouter } from "next/router";
import { NextContextWithApollo } from "../../interfaces/types";
import { groupQuery } from "../../graphql/group/queries/group";
import { redirect } from "../../lib/redirect";
import { withAuth } from "../../lib/HOC/withAuth";

const Group = () => {
  const router = useRouter();
  const { group } = router.query;

  return (
    <Layout title="Group">
      <div>
        {typeof group == "string" && (
          <GroupComponent variables={{ groupId: parseInt(group as string) }}>
            {({ data }) => {
              if (!data || !data.group) {
                return null;
              }

              return (
                <div>
                  <p>{data.group.name}</p>
                  <div>
                    <h2>users</h2>
                    {data.group.users.map((user: GroupUsers, idx: number) => {
                      return (
                        <div style={{ display: "flex" }} key={idx}>
                          <p>{user.name}</p> <p>--</p> <p>{user.email}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          </GroupComponent>
        )}
      </div>
    </Layout>
  );
};

Group.getInitialProps = async ({
  apolloClient,
  ...ctx
}: NextContextWithApollo) => {
  const { group } = ctx.query;
  if (group == null) return redirect(ctx, "/");

  const response = await apolloClient.query<GroupGroup>({
    query: groupQuery,
    variables: { groupId: parseInt(group as string) },
  });

  console.log(response);
  if (!response || !response.data || !(response.data as any).group)
    return redirect(ctx, "/");

  return { data: response.data };
};

export default Group;
// export default withAuth(Group);
