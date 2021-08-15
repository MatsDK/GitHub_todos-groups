import gql from "graphql-tag";

export const GetTodoQuery = gql`
  query getTodo($todoId: Float!) {
    getTodo(todoId: $todoId) {
      id
      todoTitle
      todoBody
      todoGroupId
      timeStamp
      fileName
      commentsCount
      completed
      todoAuthorId
      userId
      startLineNumber
      endLineNumber
      user {
        id
        name
        pictureUrl
      }
      author {
        email
        id
        name
        isOwner
        pictureUrl
      }
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
    }
  }
`;
