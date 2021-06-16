import gql from "graphql-tag";

export const getRepoObject = gql`
  query GetRepoObject($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
    }
  }
`;
