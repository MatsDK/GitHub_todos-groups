import gql from "graphql-tag";

export const joinGroupMutation = gql`
  mutation CreateComment($data: CreateCommentInput!) {
    createComment(data: $data) {
      text
      todoId
      id
      timeStamp
      commentAuthorId
      commentsCount
      author {
        id
        name
        email
        pictureUrl
      }
    }
  }
`;
