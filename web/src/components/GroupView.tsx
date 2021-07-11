import Link from "next/link";
import React, { useState } from "react";
import {
  GroupGroup,
  GroupTodos,
  GroupUsers,
  MeMe,
} from "../../generated/apolloComponents";
import {
  GetRepoObjectBlobInlineFragment,
  GetRepoObjectRepository,
  GetRepoObjectTreeInlineFragment,
} from "../../generated/github-apollo-components";
import { sortDates } from "../sortDates";
import Picture from "../ui/Picture";
import { PathArrow } from "./icons";
import NewTodoForm from "./NewTodoForm";
import Todo from "./Todo";

interface Props {
  group: GroupGroup;
  repoData: GetRepoObjectRepository;
  path: { groupId: string; path: string[] };
  me: MeMe;
}

const GroupView: React.FC<Props> = ({
  group,
  repoData,
  path: { groupId, path },
  me,
}) => {
  const [todos, setTodos] = useState<Array<GroupTodos>>(
    sortDates(group.todos, "timeStamp")
  );

  const addTodo = (newTodo: any) => {
    setTodos((todos) => sortDates([newTodo, ...todos], "timeStamp"));
  };

  const removeTodo = (id: string) => {
    setTodos((todos) => todos.filter((_: GroupTodos) => _.id != id));
  };

  return (
    <>
      <p>{group.name}</p>
      <div>
        <h2>users</h2>
        {group.users.map((user: GroupUsers, idx: number) => (
          <div style={{ display: "flex" }} key={idx}>
            {user.pictureUrl && <Picture src={user.pictureUrl} />}
            <p>{user.name}</p> <p>--</p> <p>{user.email}</p>
            <p>{user.id == me.id && "(you)"} </p>
            <p>{user.isOwner && "--owner"}</p>
          </div>
        ))}
        <FilePath path={[group.name, ...path]} group={parseInt(group.id)} />
        <h2>Files</h2>
        <Files groupId={groupId} path={path.join("/")} repoData={repoData} />
        <div>
          <h2 style={{ margin: 0 }}>Todos</h2>
          <h3>new Todo</h3>
          <NewTodoForm
            path={path}
            groupId={parseInt(group.id)}
            addTodo={addTodo}
          />
          {todos.map((_: GroupTodos, idx: number) => (
            <div key={idx}>
              <Todo removeTodo={removeTodo} todo={_} key={idx} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

interface PathProps {
  path: string[];
  group: number;
}

const FilePath: React.FC<PathProps> = ({ path, group }) => {
  const currPaht: string[] = [];

  return (
    <>
      <h2 style={{ margin: 0 }}>Path</h2>
      <br />
      <div style={{ display: "flex" }}>
        {path.map((_: string, idx) => {
          if (idx) currPaht.push(_);

          return idx != path.length - 1 ? (
            <Link key={idx} href={`/group/${group}/${currPaht.join("/")}`}>
              <div>
                {_}
                <PathArrow />
              </div>
            </Link>
          ) : (
            <b key={idx}>{_}</b>
          );
        })}
      </div>
    </>
  );
};

interface FilesProps {
  repoData: GetRepoObjectRepository;
  groupId: string;
  path: string;
}

const Files: React.FC<FilesProps> = ({ repoData, groupId, path }) => {
  if (!repoData.object) return null;

  if (repoData.object.__typename !== "Tree")
    return (
      <pre>{(repoData.object as GetRepoObjectBlobInlineFragment).text}</pre>
    );

  if (!(repoData.object as GetRepoObjectTreeInlineFragment).entries)
    return null;

  return (
    <>
      {(repoData.object as GetRepoObjectTreeInlineFragment).entries!.map(
        (_, idx: number) => {
          const newPath =
            `/group/${groupId}` +
            (path ? `/${[path, _.name].join("/")}` : `/${_.name}`);

          return (
            <div key={idx}>
              <Link href={newPath}>{_.name}</Link>
            </div>
          );
        }
      )}
    </>
  );
};

export default GroupView;
