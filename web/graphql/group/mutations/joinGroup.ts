import gql from "graphql-tag";

export const joinGroupMutation = gql`
  mutation JoinGroup($groupId: Float!) {
    joinGroup(groupId: $groupId)
  }
`;
