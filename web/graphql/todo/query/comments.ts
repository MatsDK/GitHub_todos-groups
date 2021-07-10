import gql from "graphql-tag";

export const NestedCommentsQuery = gql`
  query NestedComments($parentId: Float!, $skip: Float!) {
    nestedComments(parentCommentId: $parentId, skip: $skip) {
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

export const LoadCommentsQuery = gql`
  query loadComments($todoId: Float!, $skip: Float!) {
    comments(todoId: $todoId, skip: $skip) {
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
