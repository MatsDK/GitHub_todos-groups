import { useRouter } from "next/router";
import React from "react";
import { MeMe, GetTodoComponent } from "../../../../generated/apolloComponents";
import { GetTodoQuery } from "../../../../graphql/todo/query/getTodo";
import { withAuth } from "../../../../lib/HOC/withAuth";
import GroupLayout from "../../../../src/components/GroupLayout";
import { NextFunctionComponent } from "../../../../types";
import Todo from "../../../../src/components/Todo";
import { MeContext } from "../../../../src/context/meContext";

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
  await apolloClient.query({
    query: GetTodoQuery,
    variables: { todoId: Number(todo) },
  });
};

export default withAuth(TodoPage);
