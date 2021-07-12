import gql from "graphql-tag";

export const joinGroupMutation = gql`
  mutation createTodo($data: CreateTodoInput!) {
    createTodo(data: $data) {
      author {
        name
        email
        id
        pictureUrl
      }
      commentsCount
      completed
      comments {
        text
        timeStamp
        todoId
        id
        commentsCount
        author {
          name
          id
          email
          pictureUrl
        }
      }
      todoGroupId
      id
      todoTitle
      timeStamp
      fileName
      todoBody
      todoAuthorId
    }
  }
`;
