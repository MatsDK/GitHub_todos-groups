import gql from "graphql-tag";

export const TakeTodoMutation = gql`
  mutation TakeTodo($todoId: Int!) {
    takeTodo(todoId: $todoId)
  }
`;
