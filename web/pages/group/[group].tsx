// import { useRouter } from "next/router";
import { useContext } from "react";
import { withApollo } from "react-apollo";
import { GroupGroup } from "../../generated/apolloComponents";
import { GetRepoObjectComponent } from "../../generated/github-apollo-components";
import { getRepoObject } from "../../github-graphql/query/getRepo";
import { groupQuery } from "../../graphql/group/query/group";
import { NextContextWithApollo } from "../../interfaces/types";
import { redirect } from "../../lib/redirect";
import Layout from "../../src/components/Layout";
import { GitHubApolloClientContext } from "../../src/context/githubApolloClientContext";

const Group = (x: any) => {
  // const router = useRouter();
  const context = useContext(GitHubApolloClientContext);
  // const { group } = router.query;

  return (
    <Layout title="Group">
      <div>
        {console.log(context)}
        {context && (
          <GetRepoObjectComponent
            client={context}
            variables={{ owner: "MatsDK", name: "SSH_Files" }}
          >
            {(data) => {
              console.log(data);
              return null;
            }}
          </GetRepoObjectComponent>
        )}
        {/* {typeof group == "string" && (
          <GroupComponent variables={{ groupId: parseInt(group as string) }}>
            {({ data }) => {
              // console.log(data);
              if (!data || !data.group) return null;

              // console.log(
              //   // context
              //   (context as ApolloClient<NormalizedCacheObject>).query<
              //     GetRepoObjectQuery
              //   >({
              //     variables: { name: "SSH_Files", owner: "MatsDK" },
              //     query: getRepoObject,
              //   })
              // );

              return (
                <>
                  <GetRepoObjectComponent
                    client={context}
                    variables={{ name: "SSH_Files", owner: "MatsDK" }}
                  >
                    {(repoData: any) => {
                      console.log(repoData);

                      return <GroupView group={data.group} />;
                    }}
                  </GetRepoObjectComponent>
                </>
              );
            }}
          </GroupComponent>
        )} */}
      </div>
    </Layout>
  );
};

Group.getInitialProps = async ({
  apolloClient,
  githubApolloClient,
  ...ctx
}: NextContextWithApollo) => {
  const res = await githubApolloClient.query({
    query: getRepoObject,
    variables: {
      owner: "MatsDK",
      name: "SSH_Files",
    },
  });

  const { group } = ctx.query;
  if (group == null) return redirect(ctx, "/");

  const response = await apolloClient.query<GroupGroup>({
    query: groupQuery,
    variables: { groupId: parseInt(group as string) },
  });

  if (!response || !response.data || !(response.data as any).group)
    return redirect(ctx, "/");

  return { groupData: response.data, githubData: res };
};

export default withApollo(Group);
