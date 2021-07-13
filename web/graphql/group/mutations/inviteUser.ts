import gql from "graphql-tag";

export const inviteuserMutation = gql`
  mutation InviteUser($userEmail: String!, $groupId: Int!) {
    inviteUser(userEmail: $userEmail, groupId: $groupId)
  }
`;
