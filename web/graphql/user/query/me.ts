import gql from "graphql-tag";

export const meQuery = gql`
  query me {
    me {
      name
      email
      id
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
