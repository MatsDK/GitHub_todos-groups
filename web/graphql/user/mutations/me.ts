import gql from "graphql-tag";

export const meQuery = gql`
  query me {
    me {
      name
      email
      id
      groups {
        name
        id
      }
    }
  }
`;
