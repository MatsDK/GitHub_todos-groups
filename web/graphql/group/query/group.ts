import gql from "graphql-tag";

export const groupQuery = gql`
  query group($groupId: Float!, $path: String!) {
    group(groupId: $groupId, path: $path) {
      id
      name
      repoName
      repoOwner
      mainBranch
      users {
        email
        id
        name
      }
      todos {
        author {
          name
          email
          id
        }
        comments {
          text
          timeStamp
          todoId
          author {
            name
            id
            email
          }
        }
        id
        todoTitle
        timeStamp
        fileName
        todoBody
        todoAuthorId
      }
    }
  }
`;
