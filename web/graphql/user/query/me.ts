import gql from "graphql-tag";

export const meQuery = gql`
  query me {
    me {
      name
      email
      id
      pictureUrl
      invites {
        id
        name
      }
      groups {
        name
        id
      }
    }
  }
`;
