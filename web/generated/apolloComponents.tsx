type Maybe<T> = T | null;

export type Comment = {
  id: string;
  text: string;
  todoId: number;
  commentAuthorId: number;
  timeStamp: string;
  parentCommentId?: Maybe<string>;
  comments: Array<Comment>;
  author: User;
  commentsCount: number;
};

export type CreateCommentInput = {
  text: string;
  todoId: number;
  parentCommentId: Maybe<number>;
};

export type CreateTodoInput = {
  todoTitle: string;
  todoBody: string;
  fileName: string;
  todoGroupId: number;
  startLineNumber: Maybe<number>;
  endLineNumber: Maybe<number>;
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
  createComment?: Maybe<Comment>;
  deleteComment: boolean;
  createGroup: Group;
  joinGroup?: Maybe<boolean>;
  inviteUser?: Maybe<boolean>;
  createTodo?: Maybe<Todo>;
  deleteTodo: boolean;
  completeTodo: boolean;
  takeTodo: boolean;
  login?: Maybe<User>;
  logout: boolean;
  invalidateTokens?: Maybe<boolean>;
  register: User;
};

export type MutationCreateCommentArgs = {
  data: CreateCommentInput;
};

export type MutationDeleteCommentArgs = {
  commentId: number;
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

export type MutationInviteUserArgs = {
  userEmail: string;
  groupId: number;
};

export type MutationCreateTodoArgs = {
  data: CreateTodoInput;
};

export type MutationDeleteTodoArgs = {
  todoId: number;
};

export type MutationCompleteTodoArgs = {
  todoId: number;
};

export type MutationTakeTodoArgs = {
  todoId: number;
};

export type MutationLoginArgs = {
  password: string;
  email: string;
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type Query = {
  comments: Array<Comment>;
  allComments: Array<Comment>;
  nestedComments: Array<Comment>;
  group?: Maybe<Group>;
  groups: Array<Group>;
  getTodos: Array<Todo>;
  todos: Array<Todo>;
  getTodo?: Maybe<Todo>;
  me?: Maybe<User>;
  users: Array<User>;
};

export type QueryCommentsArgs = {
  skip: number;
  todoId: number;
};

export type QueryNestedCommentsArgs = {
  skip: number;
  parentCommentId: number;
};

export type QueryGroupArgs = {
  groupId: number;
};

export type QueryGetTodosArgs = {
  groupId: number;
};

export type QueryGetTodoArgs = {
  todoId: number;
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
  completed: boolean;
  userId?: Maybe<number>;
  user?: Maybe<User>;
  group?: Maybe<Group>;
  startLineNumber?: Maybe<number>;
  endLineNumber?: Maybe<number>;
  author?: Maybe<User>;
  comments: Array<Comment>;
  commentsCount: number;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  pictureUrl?: Maybe<string>;
  groups: Array<Group>;
  invites: Array<Group>;
  isOwner?: Maybe<boolean>;
};

// ====================================================
// Documents
// ====================================================

export type InviteUserVariables = {
  userEmail: string;
  groupId: number;
};

export type InviteUserMutation = {
  __typename?: "Mutation";

  inviteUser: Maybe<boolean>;
};

export type JoinGroupVariables = {
  groupId: number;
};

export type JoinGroupMutation = {
  __typename?: "Mutation";

  joinGroup: Maybe<boolean>;
};

export type GetRepoDataQueryVariables = {
  groupId: number;
};

export type GetRepoDataQueryQuery = {
  __typename?: "Query";

  group: Maybe<GetRepoDataQueryGroup>;
};

export type GetRepoDataQueryGroup = {
  __typename?: "Group";

  repoName: string;

  repoOwner: string;

  mainBranch: string;
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

  isOwner: Maybe<boolean>;

  pictureUrl: Maybe<string>;
};

export type GroupTodos = {
  __typename?: "Todo";

  author: Maybe<GroupAuthor>;

  userId: Maybe<number>;

  completed: boolean;

  todoGroupId: number;

  commentsCount: number;

  comments: GroupComments[];

  id: string;

  todoTitle: string;

  timeStamp: string;

  fileName: string;

  todoBody: string;

  todoAuthorId: number;
};

export type GroupAuthor = {
  __typename?: "User";

  name: string;

  email: string;

  id: string;

  pictureUrl: Maybe<string>;
};

export type GroupComments = {
  __typename?: "Comment";

  text: string;

  timeStamp: string;

  todoId: number;

  id: string;

  commentsCount: number;

  author: Group_Author;
};

export type Group_Author = {
  __typename?: "User";

  name: string;

  id: string;

  email: string;

  pictureUrl: Maybe<string>;
};

export type CompleteTodoVariables = {
  todoId: number;
};

export type CompleteTodoMutation = {
  __typename?: "Mutation";

  completeTodo: boolean;
};

export type CreateCommentVariables = {
  data: CreateCommentInput;
};

export type CreateCommentMutation = {
  __typename?: "Mutation";

  createComment: Maybe<CreateCommentCreateComment>;
};

export type CreateCommentCreateComment = {
  __typename?: "Comment";

  text: string;

  todoId: number;

  id: string;

  timeStamp: string;

  commentAuthorId: number;

  commentsCount: number;

  author: CreateCommentAuthor;
};

export type CreateCommentAuthor = {
  __typename?: "User";

  id: string;

  name: string;

  email: string;

  pictureUrl: Maybe<string>;
};

export type CreateTodoVariables = {
  data: CreateTodoInput;
};

export type CreateTodoMutation = {
  __typename?: "Mutation";

  createTodo: Maybe<CreateTodoCreateTodo>;
};

export type CreateTodoCreateTodo = {
  __typename?: "Todo";

  author: Maybe<CreateTodoAuthor>;

  commentsCount: number;

  completed: boolean;

  comments: CreateTodoComments[];

  todoGroupId: number;

  id: string;

  todoTitle: string;

  timeStamp: string;

  fileName: string;

  todoBody: string;

  todoAuthorId: number;
};

export type CreateTodoAuthor = {
  __typename?: "User";

  name: string;

  email: string;

  id: string;

  pictureUrl: Maybe<string>;
};

export type CreateTodoComments = {
  __typename?: "Comment";

  text: string;

  timeStamp: string;

  todoId: number;

  id: string;

  commentsCount: number;

  author: CreateTodo_Author;
};

export type CreateTodo_Author = {
  __typename?: "User";

  name: string;

  id: string;

  email: string;

  pictureUrl: Maybe<string>;
};

export type DeleteCommentVariables = {
  commentId: number;
};

export type DeleteCommentMutation = {
  __typename?: "Mutation";

  deleteComment: boolean;
};

export type DeleteTodoVariables = {
  todoId: number;
};

export type DeleteTodoMutation = {
  __typename?: "Mutation";

  deleteTodo: boolean;
};

export type TakeTodoVariables = {
  todoId: number;
};

export type TakeTodoMutation = {
  __typename?: "Mutation";

  takeTodo: boolean;
};

export type NestedCommentsVariables = {
  parentId: number;
  skip: number;
};

export type NestedCommentsQuery = {
  __typename?: "Query";

  nestedComments: NestedCommentsNestedComments[];
};

export type NestedCommentsNestedComments = {
  __typename?: "Comment";

  text: string;

  timeStamp: string;

  todoId: number;

  id: string;

  commentsCount: number;

  author: NestedCommentsAuthor;
};

export type NestedCommentsAuthor = {
  __typename?: "User";

  name: string;

  id: string;

  email: string;

  pictureUrl: Maybe<string>;
};

export type LoadCommentsVariables = {
  todoId: number;
  skip: number;
};

export type LoadCommentsQuery = {
  __typename?: "Query";

  comments: LoadCommentsComments[];
};

export type LoadCommentsComments = {
  __typename?: "Comment";

  text: string;

  timeStamp: string;

  todoId: number;

  id: string;

  commentsCount: number;

  author: LoadCommentsAuthor;
};

export type LoadCommentsAuthor = {
  __typename?: "User";

  name: string;

  id: string;

  email: string;

  pictureUrl: Maybe<string>;
};

export type GetTodoVariables = {
  todoId: number;
};

export type GetTodoQuery = {
  __typename?: "Query";

  getTodo: Maybe<GetTodoGetTodo>;
};

export type GetTodoGetTodo = {
  __typename?: "Todo";

  id: string;

  todoTitle: string;

  todoBody: string;

  todoGroupId: number;

  timeStamp: string;

  fileName: string;

  commentsCount: number;

  completed: boolean;

  todoAuthorId: number;

  userId: Maybe<number>;

  startLineNumber: Maybe<number>;

  endLineNumber: Maybe<number>;

  user: Maybe<GetTodoUser>;

  author: Maybe<GetTodoAuthor>;

  comments: GetTodoComments[];
};

export type GetTodoUser = {
  __typename?: "User";

  id: string;

  name: string;

  pictureUrl: Maybe<string>;
};

export type GetTodoAuthor = {
  __typename?: "User";

  email: string;

  id: string;

  name: string;

  isOwner: Maybe<boolean>;

  pictureUrl: Maybe<string>;
};

export type GetTodoComments = {
  __typename?: "Comment";

  text: string;

  timeStamp: string;

  todoId: number;

  id: string;

  commentsCount: number;

  author: GetTodo_Author;
};

export type GetTodo_Author = {
  __typename?: "User";

  name: string;

  id: string;

  email: string;

  pictureUrl: Maybe<string>;
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

  pictureUrl: Maybe<string>;

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

export type TodosVariables = {};

export type TodosQuery = {
  __typename?: "Query";

  todos: TodosTodos[];
};

export type TodosTodos = {
  __typename?: "Todo";

  id: string;

  todoTitle: string;

  todoGroupId: number;

  timeStamp: string;

  fileName: string;

  commentsCount: number;

  group: Maybe<TodosGroup>;
};

export type TodosGroup = {
  __typename?: "Group";

  name: string;
};

import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "react-apollo-hooks";

// ====================================================
// Components
// ====================================================

export const InviteUserDocument = gql`
  mutation InviteUser($userEmail: String!, $groupId: Int!) {
    inviteUser(userEmail: $userEmail, groupId: $groupId)
  }
`;
export class InviteUserComponent extends React.Component<
  Partial<ReactApollo.MutationProps<InviteUserMutation, InviteUserVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<InviteUserMutation, InviteUserVariables>
        mutation={InviteUserDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type InviteUserProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<InviteUserMutation, InviteUserVariables>
> &
  TChildProps;
export type InviteUserMutationFn = ReactApollo.MutationFn<
  InviteUserMutation,
  InviteUserVariables
>;
export function InviteUserHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        InviteUserMutation,
        InviteUserVariables,
        InviteUserProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    InviteUserMutation,
    InviteUserVariables,
    InviteUserProps<TChildProps>
  >(InviteUserDocument, operationOptions);
}
export function useInviteUser(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    InviteUserMutation,
    InviteUserVariables
  >
) {
  return ReactApolloHooks.useMutation<InviteUserMutation, InviteUserVariables>(
    InviteUserDocument,
    baseOptions
  );
}
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
export function useJoinGroup(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    JoinGroupMutation,
    JoinGroupVariables
  >
) {
  return ReactApolloHooks.useMutation<JoinGroupMutation, JoinGroupVariables>(
    JoinGroupDocument,
    baseOptions
  );
}
export const GetRepoDataQueryDocument = gql`
  query GetRepoDataQuery($groupId: Float!) {
    group(groupId: $groupId) {
      repoName
      repoOwner
      mainBranch
    }
  }
`;
export class GetRepoDataQueryComponent extends React.Component<
  Partial<
    ReactApollo.QueryProps<GetRepoDataQueryQuery, GetRepoDataQueryVariables>
  >
> {
  render() {
    return (
      <ReactApollo.Query<GetRepoDataQueryQuery, GetRepoDataQueryVariables>
        query={GetRepoDataQueryDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type GetRepoDataQueryProps<TChildProps = any> = Partial<
  ReactApollo.DataProps<GetRepoDataQueryQuery, GetRepoDataQueryVariables>
> &
  TChildProps;
export function GetRepoDataQueryHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        GetRepoDataQueryQuery,
        GetRepoDataQueryVariables,
        GetRepoDataQueryProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    GetRepoDataQueryQuery,
    GetRepoDataQueryVariables,
    GetRepoDataQueryProps<TChildProps>
  >(GetRepoDataQueryDocument, operationOptions);
}
export function useGetRepoDataQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<GetRepoDataQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    GetRepoDataQueryQuery,
    GetRepoDataQueryVariables
  >(GetRepoDataQueryDocument, baseOptions);
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
        isOwner
        pictureUrl
      }
      todos {
        author {
          name
          email
          id
          pictureUrl
        }
        userId
        completed
        todoGroupId
        commentsCount
        comments {
          text
          timeStamp
          todoId
          id
          commentsCount
          author {
            name
            id
            email
            pictureUrl
          }
        }
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
export function useGroup(
  baseOptions?: ReactApolloHooks.QueryHookOptions<GroupVariables>
) {
  return ReactApolloHooks.useQuery<GroupQuery, GroupVariables>(
    GroupDocument,
    baseOptions
  );
}
export const CompleteTodoDocument = gql`
  mutation CompleteTodo($todoId: Int!) {
    completeTodo(todoId: $todoId)
  }
`;
export class CompleteTodoComponent extends React.Component<
  Partial<
    ReactApollo.MutationProps<CompleteTodoMutation, CompleteTodoVariables>
  >
> {
  render() {
    return (
      <ReactApollo.Mutation<CompleteTodoMutation, CompleteTodoVariables>
        mutation={CompleteTodoDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type CompleteTodoProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<CompleteTodoMutation, CompleteTodoVariables>
> &
  TChildProps;
export type CompleteTodoMutationFn = ReactApollo.MutationFn<
  CompleteTodoMutation,
  CompleteTodoVariables
>;
export function CompleteTodoHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        CompleteTodoMutation,
        CompleteTodoVariables,
        CompleteTodoProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    CompleteTodoMutation,
    CompleteTodoVariables,
    CompleteTodoProps<TChildProps>
  >(CompleteTodoDocument, operationOptions);
}
export function useCompleteTodo(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    CompleteTodoMutation,
    CompleteTodoVariables
  >
) {
  return ReactApolloHooks.useMutation<
    CompleteTodoMutation,
    CompleteTodoVariables
  >(CompleteTodoDocument, baseOptions);
}
export const CreateCommentDocument = gql`
  mutation CreateComment($data: CreateCommentInput!) {
    createComment(data: $data) {
      text
      todoId
      id
      timeStamp
      commentAuthorId
      commentsCount
      author {
        id
        name
        email
        pictureUrl
      }
    }
  }
`;
export class CreateCommentComponent extends React.Component<
  Partial<
    ReactApollo.MutationProps<CreateCommentMutation, CreateCommentVariables>
  >
> {
  render() {
    return (
      <ReactApollo.Mutation<CreateCommentMutation, CreateCommentVariables>
        mutation={CreateCommentDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type CreateCommentProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<CreateCommentMutation, CreateCommentVariables>
> &
  TChildProps;
export type CreateCommentMutationFn = ReactApollo.MutationFn<
  CreateCommentMutation,
  CreateCommentVariables
>;
export function CreateCommentHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        CreateCommentMutation,
        CreateCommentVariables,
        CreateCommentProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    CreateCommentMutation,
    CreateCommentVariables,
    CreateCommentProps<TChildProps>
  >(CreateCommentDocument, operationOptions);
}
export function useCreateComment(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    CreateCommentMutation,
    CreateCommentVariables
  >
) {
  return ReactApolloHooks.useMutation<
    CreateCommentMutation,
    CreateCommentVariables
  >(CreateCommentDocument, baseOptions);
}
export const CreateTodoDocument = gql`
  mutation createTodo($data: CreateTodoInput!) {
    createTodo(data: $data) {
      author {
        name
        email
        id
        pictureUrl
      }
      commentsCount
      completed
      comments {
        text
        timeStamp
        todoId
        id
        commentsCount
        author {
          name
          id
          email
          pictureUrl
        }
      }
      todoGroupId
      id
      todoTitle
      timeStamp
      fileName
      todoBody
      todoAuthorId
    }
  }
`;
export class CreateTodoComponent extends React.Component<
  Partial<ReactApollo.MutationProps<CreateTodoMutation, CreateTodoVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<CreateTodoMutation, CreateTodoVariables>
        mutation={CreateTodoDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type CreateTodoProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<CreateTodoMutation, CreateTodoVariables>
> &
  TChildProps;
export type CreateTodoMutationFn = ReactApollo.MutationFn<
  CreateTodoMutation,
  CreateTodoVariables
>;
export function CreateTodoHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        CreateTodoMutation,
        CreateTodoVariables,
        CreateTodoProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    CreateTodoMutation,
    CreateTodoVariables,
    CreateTodoProps<TChildProps>
  >(CreateTodoDocument, operationOptions);
}
export function useCreateTodo(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    CreateTodoMutation,
    CreateTodoVariables
  >
) {
  return ReactApolloHooks.useMutation<CreateTodoMutation, CreateTodoVariables>(
    CreateTodoDocument,
    baseOptions
  );
}
export const DeleteCommentDocument = gql`
  mutation deleteComment($commentId: Float!) {
    deleteComment(commentId: $commentId)
  }
`;
export class DeleteCommentComponent extends React.Component<
  Partial<
    ReactApollo.MutationProps<DeleteCommentMutation, DeleteCommentVariables>
  >
> {
  render() {
    return (
      <ReactApollo.Mutation<DeleteCommentMutation, DeleteCommentVariables>
        mutation={DeleteCommentDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type DeleteCommentProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<DeleteCommentMutation, DeleteCommentVariables>
> &
  TChildProps;
export type DeleteCommentMutationFn = ReactApollo.MutationFn<
  DeleteCommentMutation,
  DeleteCommentVariables
>;
export function DeleteCommentHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        DeleteCommentMutation,
        DeleteCommentVariables,
        DeleteCommentProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    DeleteCommentMutation,
    DeleteCommentVariables,
    DeleteCommentProps<TChildProps>
  >(DeleteCommentDocument, operationOptions);
}
export function useDeleteComment(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DeleteCommentMutation,
    DeleteCommentVariables
  >
) {
  return ReactApolloHooks.useMutation<
    DeleteCommentMutation,
    DeleteCommentVariables
  >(DeleteCommentDocument, baseOptions);
}
export const DeleteTodoDocument = gql`
  mutation deleteTodo($todoId: Float!) {
    deleteTodo(todoId: $todoId)
  }
`;
export class DeleteTodoComponent extends React.Component<
  Partial<ReactApollo.MutationProps<DeleteTodoMutation, DeleteTodoVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<DeleteTodoMutation, DeleteTodoVariables>
        mutation={DeleteTodoDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type DeleteTodoProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<DeleteTodoMutation, DeleteTodoVariables>
> &
  TChildProps;
export type DeleteTodoMutationFn = ReactApollo.MutationFn<
  DeleteTodoMutation,
  DeleteTodoVariables
>;
export function DeleteTodoHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        DeleteTodoMutation,
        DeleteTodoVariables,
        DeleteTodoProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    DeleteTodoMutation,
    DeleteTodoVariables,
    DeleteTodoProps<TChildProps>
  >(DeleteTodoDocument, operationOptions);
}
export function useDeleteTodo(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    DeleteTodoMutation,
    DeleteTodoVariables
  >
) {
  return ReactApolloHooks.useMutation<DeleteTodoMutation, DeleteTodoVariables>(
    DeleteTodoDocument,
    baseOptions
  );
}
export const TakeTodoDocument = gql`
  mutation TakeTodo($todoId: Int!) {
    takeTodo(todoId: $todoId)
  }
`;
export class TakeTodoComponent extends React.Component<
  Partial<ReactApollo.MutationProps<TakeTodoMutation, TakeTodoVariables>>
> {
  render() {
    return (
      <ReactApollo.Mutation<TakeTodoMutation, TakeTodoVariables>
        mutation={TakeTodoDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type TakeTodoProps<TChildProps = any> = Partial<
  ReactApollo.MutateProps<TakeTodoMutation, TakeTodoVariables>
> &
  TChildProps;
export type TakeTodoMutationFn = ReactApollo.MutationFn<
  TakeTodoMutation,
  TakeTodoVariables
>;
export function TakeTodoHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        TakeTodoMutation,
        TakeTodoVariables,
        TakeTodoProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    TakeTodoMutation,
    TakeTodoVariables,
    TakeTodoProps<TChildProps>
  >(TakeTodoDocument, operationOptions);
}
export function useTakeTodo(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    TakeTodoMutation,
    TakeTodoVariables
  >
) {
  return ReactApolloHooks.useMutation<TakeTodoMutation, TakeTodoVariables>(
    TakeTodoDocument,
    baseOptions
  );
}
export const NestedCommentsDocument = gql`
  query NestedComments($parentId: Float!, $skip: Float!) {
    nestedComments(parentCommentId: $parentId, skip: $skip) {
      text
      timeStamp
      todoId
      id
      commentsCount
      author {
        name
        id
        email
        pictureUrl
      }
    }
  }
`;
export class NestedCommentsComponent extends React.Component<
  Partial<ReactApollo.QueryProps<NestedCommentsQuery, NestedCommentsVariables>>
> {
  render() {
    return (
      <ReactApollo.Query<NestedCommentsQuery, NestedCommentsVariables>
        query={NestedCommentsDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type NestedCommentsProps<TChildProps = any> = Partial<
  ReactApollo.DataProps<NestedCommentsQuery, NestedCommentsVariables>
> &
  TChildProps;
export function NestedCommentsHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        NestedCommentsQuery,
        NestedCommentsVariables,
        NestedCommentsProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    NestedCommentsQuery,
    NestedCommentsVariables,
    NestedCommentsProps<TChildProps>
  >(NestedCommentsDocument, operationOptions);
}
export function useNestedComments(
  baseOptions?: ReactApolloHooks.QueryHookOptions<NestedCommentsVariables>
) {
  return ReactApolloHooks.useQuery<
    NestedCommentsQuery,
    NestedCommentsVariables
  >(NestedCommentsDocument, baseOptions);
}
export const LoadCommentsDocument = gql`
  query loadComments($todoId: Float!, $skip: Float!) {
    comments(todoId: $todoId, skip: $skip) {
      text
      timeStamp
      todoId
      id
      commentsCount
      author {
        name
        id
        email
        pictureUrl
      }
    }
  }
`;
export class LoadCommentsComponent extends React.Component<
  Partial<ReactApollo.QueryProps<LoadCommentsQuery, LoadCommentsVariables>>
> {
  render() {
    return (
      <ReactApollo.Query<LoadCommentsQuery, LoadCommentsVariables>
        query={LoadCommentsDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type LoadCommentsProps<TChildProps = any> = Partial<
  ReactApollo.DataProps<LoadCommentsQuery, LoadCommentsVariables>
> &
  TChildProps;
export function LoadCommentsHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        LoadCommentsQuery,
        LoadCommentsVariables,
        LoadCommentsProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    LoadCommentsQuery,
    LoadCommentsVariables,
    LoadCommentsProps<TChildProps>
  >(LoadCommentsDocument, operationOptions);
}
export function useLoadComments(
  baseOptions?: ReactApolloHooks.QueryHookOptions<LoadCommentsVariables>
) {
  return ReactApolloHooks.useQuery<LoadCommentsQuery, LoadCommentsVariables>(
    LoadCommentsDocument,
    baseOptions
  );
}
export const GetTodoDocument = gql`
  query getTodo($todoId: Float!) {
    getTodo(todoId: $todoId) {
      id
      todoTitle
      todoBody
      todoGroupId
      timeStamp
      fileName
      commentsCount
      completed
      todoAuthorId
      userId
      startLineNumber
      endLineNumber
      user {
        id
        name
        pictureUrl
      }
      author {
        email
        id
        name
        isOwner
        pictureUrl
      }
      comments {
        text
        timeStamp
        todoId
        id
        commentsCount
        author {
          name
          id
          email
          pictureUrl
        }
      }
    }
  }
`;
export class GetTodoComponent extends React.Component<
  Partial<ReactApollo.QueryProps<GetTodoQuery, GetTodoVariables>>
> {
  render() {
    return (
      <ReactApollo.Query<GetTodoQuery, GetTodoVariables>
        query={GetTodoDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type GetTodoProps<TChildProps = any> = Partial<
  ReactApollo.DataProps<GetTodoQuery, GetTodoVariables>
> &
  TChildProps;
export function GetTodoHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        GetTodoQuery,
        GetTodoVariables,
        GetTodoProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    GetTodoQuery,
    GetTodoVariables,
    GetTodoProps<TChildProps>
  >(GetTodoDocument, operationOptions);
}
export function useGetTodo(
  baseOptions?: ReactApolloHooks.QueryHookOptions<GetTodoVariables>
) {
  return ReactApolloHooks.useQuery<GetTodoQuery, GetTodoVariables>(
    GetTodoDocument,
    baseOptions
  );
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
export function useLogin(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    LoginMutation,
    LoginVariables
  >
) {
  return ReactApolloHooks.useMutation<LoginMutation, LoginVariables>(
    LoginDocument,
    baseOptions
  );
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
export function useLogout(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    LogoutMutation,
    LogoutVariables
  >
) {
  return ReactApolloHooks.useMutation<LogoutMutation, LogoutVariables>(
    LogoutDocument,
    baseOptions
  );
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
export function useRegister(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    RegisterMutation,
    RegisterVariables
  >
) {
  return ReactApolloHooks.useMutation<RegisterMutation, RegisterVariables>(
    RegisterDocument,
    baseOptions
  );
}
export const MeDocument = gql`
  query me {
    me {
      name
      email
      id
      pictureUrl
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
export function useMe(
  baseOptions?: ReactApolloHooks.QueryHookOptions<MeVariables>
) {
  return ReactApolloHooks.useQuery<MeQuery, MeVariables>(
    MeDocument,
    baseOptions
  );
}
export const TodosDocument = gql`
  query todos {
    todos {
      id
      todoTitle
      todoGroupId
      timeStamp
      fileName
      commentsCount
      group {
        name
      }
    }
  }
`;
export class TodosComponent extends React.Component<
  Partial<ReactApollo.QueryProps<TodosQuery, TodosVariables>>
> {
  render() {
    return (
      <ReactApollo.Query<TodosQuery, TodosVariables>
        query={TodosDocument}
        {...(this as any)["props"] as any}
      />
    );
  }
}
export type TodosProps<TChildProps = any> = Partial<
  ReactApollo.DataProps<TodosQuery, TodosVariables>
> &
  TChildProps;
export function TodosHOC<TProps, TChildProps = any>(
  operationOptions:
    | ReactApollo.OperationOption<
        TProps,
        TodosQuery,
        TodosVariables,
        TodosProps<TChildProps>
      >
    | undefined
) {
  return ReactApollo.graphql<
    TProps,
    TodosQuery,
    TodosVariables,
    TodosProps<TChildProps>
  >(TodosDocument, operationOptions);
}
export function useTodos(
  baseOptions?: ReactApolloHooks.QueryHookOptions<TodosVariables>
) {
  return ReactApolloHooks.useQuery<TodosQuery, TodosVariables>(
    TodosDocument,
    baseOptions
  );
}
