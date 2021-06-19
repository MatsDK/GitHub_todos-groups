import gql from "graphql-tag";

export const groupQuery = gql`
  query group($groupId: Float!) {
    group(groupId: $groupId) {
      id
      name
      repoName
      mainBranch
      users {
        email
        id
        name
      }
    }
  }
`;
