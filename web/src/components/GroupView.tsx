import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  GroupGroup,
  GroupTodos,
  GroupUsers,
} from "../../generated/apolloComponents";
import {
  GetRepoObjectBlobInlineFragment,
  GetRepoObjectRepository,
  GetRepoObjectTreeInlineFragment,
} from "../../generated/github-apollo-components";
import { PathArrow } from "./icons";
import NewTodoForm from "./NewTodoForm";

interface Props {
  group: GroupGroup;
  repoData: GetRepoObjectRepository;
  path: { groupId: string; path: string[] };
}

const GroupView: React.FC<Props> = ({
  group,
  repoData,
  path: { groupId, path },
}) => {
  console.log(group.todos);
  const [todos, setTodos] = useState<Array<GroupTodos>>(group.todos.reverse());

  useEffect(() => {
    setTodos(group.todos);

    return () => {};
  }, [todos, group]);

  return (
    <>
      <p>{group.name}</p>
      <div>
        <h2>users</h2>
        {group.users.map((user: GroupUsers, idx: number) => (
          <div style={{ display: "flex" }} key={idx}>
            <p>{user.name}</p> <p>--</p> <p>{user.email}</p>
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
            setTodos={setTodos}
          />
          {todos.map((_: GroupTodos, idx: number) => {
            return (
              <div key={idx}>
                <p style={{ marginBottom: 0, marginTop: "10px" }}>
                  {_.author.name}
                  {" - "}
                  {_.author.email}
                  {" - "}
                  {dayjs(_.timeStamp).format("MMMM D, YYYY h:mm A")}
                </p>
                <div>
                  <b>{_.todoTitle}</b>
                  <span>{_.todoBody}</span>
                </div>
              </div>
            );
          })}
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
