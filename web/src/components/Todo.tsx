import React from "react";
import {
  GetRepoDataQueryComponent,
  GetTodoGetTodo,
} from "../../generated/apolloComponents";
import {
  GetRepoObjectBlobInlineFragment,
  GetRepoObjectComponent,
} from "../../generated/github-apollo-components";
import TodoView from "./TodoView";

interface Props {
  todo: GetTodoGetTodo;
  removeTodo: (id: string) => void;
}

const Todo: React.FC<Props> = ({ removeTodo, ...rest }) => {
  const hasAttachedFile: boolean =
    !!rest.todo.fileName &&
    rest.todo.startLineNumber != null &&
    rest.todo.endLineNumber != null;

  return hasAttachedFile ? (
    <GetRepoDataQueryComponent variables={{ groupId: rest.todo.todoGroupId }}>
      {({ data }) => {
        if (!data || !data.group) return null;

        return (
          <GetRepoObjectComponent
            context={{ server: "github" }}
            variables={{
              expression: `${data.group.mainBranch}:${rest.todo.fileName}`,
              owner: data.group.repoOwner,
              name: data.group.repoName,
            }}
          >
            {({ data }) => {
              const text: string | null =
                (data &&
                  data.repository &&
                  data.repository.object &&
                  (data.repository.object as GetRepoObjectBlobInlineFragment)
                    .text) ||
                null;

              return (
                <TodoView fileData={text} removeTodo={removeTodo} {...rest} />
              );
            }}
          </GetRepoObjectComponent>
        );
      }}
    </GetRepoDataQueryComponent>
  ) : (
    <TodoView fileData={null} removeTodo={removeTodo} {...rest} />
  );
};

export default Todo;
