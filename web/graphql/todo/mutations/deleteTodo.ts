import gql from "graphql-tag";

export const DeleteTodoMutation = gql`
  mutation deleteTodo($todoId: Float!) {
    deleteTodo(todoId: $todoId)
  }
`;
