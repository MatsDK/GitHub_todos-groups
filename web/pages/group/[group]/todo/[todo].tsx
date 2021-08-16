import { useRouter } from "next/router";
import React from "react";
import { MeMe, GetTodoComponent } from "../../../../generated/apolloComponents";
import { GetTodoQuery } from "../../../../graphql/todo/query/getTodo";
import { withAuth } from "../../../../lib/HOC/withAuth";
import GroupLayout from "../../../../src/components/Layout";
import { NextFunctionComponent } from "../../../../types";
import Todo from "../../../../src/components/Todo/Todo";
import { MeContext } from "../../../../src/context/meContext";
import { getGroupRepoDataQuery } from "../../../../graphql/group/query/getGroupRepoData";
import { getRepoObject } from "../../../../github-graphql/query/getRepo";

interface Props {
  me: MeMe;
}

const TodoPage: NextFunctionComponent<Props> = ({ me }) => {
  const router = useRouter();

  return (
    <MeContext.Provider value={me}>
      <GroupLayout title="Todo" me={me}>
        {router && (
          <GetTodoComponent variables={{ todoId: Number(router.query.todo) }}>
            {({ data }) => {
              if (!data || !data.getTodo) return null;

              return (
                <Todo
                  todo={data.getTodo}
                  removeTodo={() => {
                    router.push(`/group/${data.getTodo!.todoGroupId}`);
                  }}
                />
              );
            }}
          </GetTodoComponent>
        )}
      </GroupLayout>
    </MeContext.Provider>
  );
};

TodoPage.getInitialProps = async ({ apolloClient, query: { todo } }) => {
  const res = await apolloClient.query({
    query: GetTodoQuery,
    variables: { todoId: Number(todo) },
  });
  if (!res || !res.data || !res.data.getTodo) return;

  if (
    !!res.data.getTodo.fileName &&
    res.data.getTodo.startLineNumber != null &&
    res.data.getTodo.endLineNumber != null
  ) {
    const repoData = await apolloClient.query({
      query: getGroupRepoDataQuery,
      variables: { groupId: res.data.getTodo.todoGroupId },
    });
    if (!repoData || !repoData.data || !repoData.data.group) return;

    await apolloClient.query({
      query: getRepoObject,
      context: { server: "github" },
      variables: {
        owner: repoData.data.group.repoOwner,
        name: repoData.data.group.repoName,
        expression: `${repoData.data.group.mainBranch}:${
          res.data.getTodo.fileName
        }`,
      },
    });
  }
};

export default withAuth(TodoPage);
