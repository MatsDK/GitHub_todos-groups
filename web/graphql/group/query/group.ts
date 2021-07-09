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
        commentsCount
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
