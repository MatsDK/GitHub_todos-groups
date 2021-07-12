import gql from "graphql-tag";

export const CompleteTodoMutation = gql`
  mutation CompleteTodo($todoId: Int!) {
    completeTodo(todoId: $todoId)
  }
`;
