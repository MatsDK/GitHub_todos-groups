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
        isOwner
        pictureUrl
      }
      todos {
        author {
          name
          email
          id
          pictureUrl
        }
        comments {
          text
          timeStamp
          todoId
          id
          comments {
            text
            timeStamp
            todoId
            id
            author {
              name
              id
              email
              pictureUrl
            }
          }
          author {
            name
            id
            email
            pictureUrl
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
