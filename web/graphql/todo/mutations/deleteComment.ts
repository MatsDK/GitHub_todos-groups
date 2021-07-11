import gql from "graphql-tag";

export const DeleteCommentMutation = gql`
  mutation deleteComment($commentId: Float!) {
    deleteComment(commentId: $commentId)
  }
`;
