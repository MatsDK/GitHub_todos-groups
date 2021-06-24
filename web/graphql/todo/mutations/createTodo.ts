import gql from "graphql-tag";

export const joinGroupMutation = gql`
  mutation createTodo($data: CreateTodoInput!) {
    createTodo(data: $data) {
      author {
        name
        email
        id
      }
      id
      todoTitle
      timeStamp
      fileName
      todoBody
      todoAuthorId
    }
  }
`;
