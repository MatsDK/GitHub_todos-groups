import gql from "graphql-tag";

export const NestedCommentsQuery = gql`
  query NestedComments($parentId: Float!) {
    nestedComments(parentCommentId: $parentId) {
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
`;
