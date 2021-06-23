type Maybe<T> = T | null;

export type CreateTodoInput = {
  todoTitle: string;
  todoBody: string;
  fileName: Maybe<string>;
  todoGroupId: number;
};

export type Group = {
  id: string;
  name: string;
  users: Array<User>;
  repoName: string;
  repoOwner: string;
  mainBranch: string;
  todos: Array<Todo>;
};

export type Invite = {
  user_target: number;
  group_id: number;
};

export type Mutation = {
  createGroup: Group;
  joinGroup?: Maybe<boolean>;
  createTodo?: Maybe<Todo>;
  login?: Maybe<User>;
  logout: boolean;
  register: User;
};

export type MutationCreateGroupArgs = {
  repoOwner: string;
  userId: number;
  mainBranch: string;
  repoName: string;
  name: string;
};

export type MutationJoinGroupArgs = {
  groupId: number;
};

export type MutationCreateTodoArgs = {
  data: CreateTodoInput;
};

export type MutationLoginArgs = {
  password: string;
  email: string;
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type Query = {
  group?: Maybe<Group>;
  groups: Array<Group>;
  getTodos: Array<Todo>;
  todos: Array<Todo>;
  me?: Maybe<User>;
  users: Array<User>;
};

export type QueryGroupArgs = {
  groupId: number;
};

export type QueryGetTodosArgs = {
  groupId: number;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type Todo = {
  id: string;
  todoTitle: string;
  todoBody: string;
  todoGroupId: number;
  todoAuthorId: number;
  timeStamp: string;
  fileName: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  groups: Array<Group>;
  invites: Array<Group>;
};

// ====================================================
// Documents
// ====================================================

export type JoinGroupVariables = {
  groupId: number;
};

export type JoinGroupMutation = {
  __typename?: "Mutation";

  joinGroup: Maybe<boolean>;
};

export type GroupVariables = {
  groupId: number;
};

export type GroupQuery = {
  __typename?: "Query";

  group: Maybe<GroupGroup>;
};

export type GroupGroup = {
  __typename?: "Group";

  id: string;

  name: string;

  repoName: string;

  repoOwner: string;

  mainBranch: string;

  users: GroupUsers[];

  todos: GroupTodos[];
};

export type GroupUsers = {
  __typename?: "User";

  email: string;

  id: string;

  name: string;
};

export type GroupTodos = {
  __typename?: "Todo";

  id: string;

  todoTitle: string;

  timeStamp: string;

  fileName: string;

  todoBody: string;

  todoAuthorId: number;
};

export type LoginVariables = {
  email: string;
  password: string;
};

export type LoginMutation = {
  __typename?: "Mutation";

  login: Maybe<LoginLogin>;
};

export type LoginLogin = {
  __typename?: "User";

  email: string;

  name: string;
};

export type LogoutVariables = {};

export type LogoutMutation = {
  __typename?: "Mutation";

  logout: boolean;
};

export type RegisterVariables = {
  data: RegisterInput;
};

export type RegisterMutation = {
  __typename?: "Mutation";

  register: RegisterRegister;
};

export type RegisterRegister = {
  __typename?: "User";

  firstName: string;

  lastName: string;

  email: string;

  id: string;

  name: string;
};

export type MeVariables = {};

export type MeQuery = {
  __typename?: "Query";

  me: Maybe<MeMe>;
};

export type MeMe = {
  __typename?: "User";

  name: string;

  email: string;

  id: string;

  invites: MeInvites[];

  groups: MeGroups[];
};

export type MeInvites = {
  __typename?: "Group";

  id: string;

  name: string;
};

export type MeGroups = {
  __typename?: "Group";

  name: string;

  id: string;
};

import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";

// ====================================================
// Components
// ====================================================

export const JoinGroupDocument = gql`
  mutation JoinGroup($groupId: Float!) {
    joinGroup(groupId: $groupId)
  }
`;
export class JoinGroupComponent extends React.Component<
  Partial<ReactApollo.MutationProps<JoinGroupMutation, JoinGroupVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<JoinGroupMutation, JoinGroupVariables>
        mutation={JoinGroupDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type JoinGroupProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<JoinGroupMutation, JoinGroupVariables>
> &
  TChildProps;
export type JoinGroupMutationFn = ReactApollo.MutationFn<
  JoinGroupMutation,
  JoinGroupVariables
>;
export function JoinGroupHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        JoinGroupMutation,
        JoinGroupVariables,
        JoinGroupProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    JoinGroupMutation,
    JoinGroupVariables,
    JoinGroupProps<TChildProps>
  >(JoinGroupDocument, operationOptions);
}
export const GroupDocument = gql`
  query group($groupId: Float!) {
    group(groupId: $groupId) {
      id
      name
      repoName
      repoOwner
      mainBranch
      users {
        email
        id
        name
      }
      todos {
        id
        todoTitle
        timeStamp
        fileName
        todoBody
        todoAuthorId
      }
    }
  }
`;
export class GroupComponent extends React.Component<
  Partial<ReactApollo.QueryProps<GroupQuery, GroupVariables>>
> {
  render() {
    return (
      <ReactApollo.Query<GroupQuery, GroupVariables>
        query={GroupDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type GroupProps<TChildProps = any> = Partial<
  ReactApollo.DataProps<GroupQuery, GroupVariables>
> &
  TChildProps;
export function GroupHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        GroupQuery,
        GroupVariables,
        GroupProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    GroupQuery,
    GroupVariables,
    GroupProps<TChildProps>
  >(GroupDocument, operationOptions);
}
export const LoginDocument = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      name
    }
  }
`;
export class LoginComponent extends React.Component<
  Partial<ReactApollo.MutationProps<LoginMutation, LoginVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<LoginMutation, LoginVariables>
        mutation={LoginDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type LoginProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<LoginMutation, LoginVariables>
> &
  TChildProps;
export type LoginMutationFn = ReactApollo.MutationFn<
  LoginMutation,
  LoginVariables
>;
export function LoginHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        LoginMutation,
        LoginVariables,
        LoginProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    LoginMutation,
    LoginVariables,
    LoginProps<TChildProps>
  >(LoginDocument, operationOptions);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export class LogoutComponent extends React.Component<
  Partial<ReactApollo.MutationProps<LogoutMutation, LogoutVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<LogoutMutation, LogoutVariables>
        mutation={LogoutDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type LogoutProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<LogoutMutation, LogoutVariables>
> &
  TChildProps;
export type LogoutMutationFn = ReactApollo.MutationFn<
  LogoutMutation,
  LogoutVariables
>;
export function LogoutHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        LogoutMutation,
        LogoutVariables,
        LogoutProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    LogoutMutation,
    LogoutVariables,
    LogoutProps<TChildProps>
  >(LogoutDocument, operationOptions);
}
export const RegisterDocument = gql`
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
export class RegisterComponent extends React.Component<
  Partial<ReactApollo.MutationProps<RegisterMutation, RegisterVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<RegisterMutation, RegisterVariables>
        mutation={RegisterDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type RegisterProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<RegisterMutation, RegisterVariables>
> &
  TChildProps;
export type RegisterMutationFn = ReactApollo.MutationFn<
  RegisterMutation,
  RegisterVariables
>;
export function RegisterHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        RegisterMutation,
        RegisterVariables,
        RegisterProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    RegisterMutation,
    RegisterVariables,
    RegisterProps<TChildProps>
  >(RegisterDocument, operationOptions);
}
export const MeDocument = gql`
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
export class MeComponent extends React.Component<
  Partial<ReactApollo.QueryProps<MeQuery, MeVariables>>
> {
  render() {
    return (
      <ReactApollo.Query<MeQuery, MeVariables>
        query={MeDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type MeProps<TChildProps = any> = Partial<
  ReactApollo.DataProps<MeQuery, MeVariables>
> &
  TChildProps;
export function MeHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        MeQuery,
        MeVariables,
        MeProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    MeQuery,
    MeVariables,
    MeProps<TChildProps>
  >(MeDocument, operationOptions);
}
