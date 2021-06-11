import gql from "graphql-tag";

export const meMutation = gql`
  mutation Me($refreshToken: String!, $accessToken: String!) {
    me(refreshToken: $refreshToken, accessToken: $accessToken) {
      name
      email
      id
    }
  }
`;
