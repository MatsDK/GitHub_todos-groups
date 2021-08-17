import gql from "graphql-tag";

export const myTodosQuery = gql`
  query todos {
    todos {
      id
      todoTitle
      todoGroupId
      timeStamp
      fileName
      commentsCount
      group {
        name
        repoName
      }
    }
  }
`;
