import gql from "graphql-tag";

export const getGroupRepoDataQuery = gql`
  query GetRepoDataQuery($groupId: Float!) {
    group(groupId: $groupId) {
      repoName
      repoOwner
      mainBranch
    }
  }
`;
