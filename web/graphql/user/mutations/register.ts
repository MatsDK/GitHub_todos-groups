import gql from "graphql-tag";

export const registerMutation = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      firstName
      lastName
      email
      id
      name
    }
  }
`;
