import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GroupGroup, GroupTodos } from "../../generated/apolloComponents";
import {
  GetRepoObjectBlobInlineFragment,
  GetRepoObjectRepository,
  GetRepoObjectTreeInlineFragment,
} from "../../generated/github-apollo-components";
import { sortDates } from "../utils/sortDates";
// import Picture from "../ui/Picture";
import { TodoGrid } from "../ui/Todo";
import { PathArrow } from "./icons";
// import NewTodoForm from "./NewTodoForm";
import TodoCard from "./TodoCard";
import { FilterTodos } from "../utils/filterTodos";

interface Props {
  group: GroupGroup;
  repoData: GetRepoObjectRepository;
  path: { groupId: string; path: string[] };
}

const Title = styled.h1`
  font-family: "Rubik", sans-serif;
  font-size: 40px;
  width: fit-content;
  margin-top: 60px;
  /* background: ${(props) => props.theme.gradient}; */
  /* -webkit-background-clip: text; */
  /* background-clip: text; */
  /* -webkit-text-fill-color: transparent; */
`;

const GroupView: React.FC<Props> = ({
  group,
  repoData,
  path: { groupId, path },
}) => {
  const [todos, setTodos] = useState<Array<GroupTodos>>(
    sortDates(group.todos, "timeStamp")
  );

  useEffect(() => {
    setTodos(FilterTodos<GroupTodos>(group.todos, path));
    return () => {};
  }, [path]);

  // const addTodo = (newTodo: any) => {
  //   setTodos((todos) => sortDates([newTodo, ...todos], "timeStamp"));
  // };

  // const removeTodo = (id: string) => {
  //   setTodos((todos) => todos.filter((_: GroupTodos) => _.id != id));
  // };

  return (
    <>
      <Title>{group.name}</Title>
      <div>
        {/* <h2>users</h2>
        {group.users.map((user: GroupUsers, idx: number) => (
          <div style={{ display: "flex" }} key={idx}>
            {user.pictureUrl && <Picture src={user.pictureUrl} />}
            <p>{user.name}</p> <p>--</p> <p>{user.email}</p>
            <p>{user.id == me.id && "(you)"} </p>
            <p>{user.isOwner && "--owner"}</p>
          </div>
        ))} */}
        <div>
          <FilePath
            path={[group.repoName, ...path]}
            group={parseInt(group.id)}
          />
          <Files groupId={groupId} path={path.join("/")} repoData={repoData} />
        </div>
        <div>
          {/* <h2 style={{ margin: 0 }}>Todos</h2>
          <h3>new Todo</h3>
          <NewTodoForm
            path={path}
            groupId={parseInt(group.id)}
            addTodo={addTodo}
          /> */}
          <Title>Todos</Title>
          <TodoGrid>
            {todos.map((_: GroupTodos, idx: number) => (
              <div key={idx}>
                <TodoCard key={idx} todo={_} />
              </div>
            ))}
          </TodoGrid>
        </div>
      </div>
    </>
  );
};

interface PathProps {
  path: string[];
  group: number;
}

const FilePathWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 4px;
  font-family: "Rubik", sans-serif;
  margin-bottom: 10px;
  font-weight: 400;
  height: 30px;
`;

const Path = styled.p`
  color: ${(props) => props.theme.textColors[2]};
  margin: 0;
  font-size: 23px;
  transition: 0.1s ease;
  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.textColors[1]};
  }
`;

const CurrentPath = styled.p`
  margin: 0;
  font-size: 23px;
  background: ${(props) => props.theme.gradient};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FilePath: React.FC<PathProps> = ({ path, group }) => {
  const currPath: string[] = [];

  return (
    <FilePathWrapper>
      {path.map((_: string, idx) => {
        if (idx) currPath.push(_);

        return idx != path.length - 1 ? (
          <Link
            key={idx}
            href={`/group/${group}/${
              currPath.length ? "path/" : ""
            }${currPath.join("/")}`}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Path>{_}</Path>
              <PathArrow />
            </div>
          </Link>
        ) : (
          <CurrentPath key={idx}>{_}</CurrentPath>
        );
      })}
    </FilePathWrapper>
  );
};

interface FilesProps {
  repoData: GetRepoObjectRepository;
  groupId: string;
  path: string;
}

const FilesWrapper = styled.div`
  box-shadow: 6px 4px 4px rgba(0, 0, 0, 0.29);
  border-radius: 10px;
  background-color: ${(props) => props.theme.secondaryBgColor};
  padding: 20px;
`;

const Item = styled.div`
  color: ${(props) => props.theme.textColors[1]};
  width: 100%;

  p {
    width: 100%;
    margin: 0;
    font-size: 18px;
    padding: 4px 10px;
  }

  :hover p {
    text-decoration: underline;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 2px;
  background: ${(props) => props.theme.mainBgColor};
`;

const order = ["tree", "blob"];

const Files: React.FC<FilesProps> = ({ repoData, groupId, path }) => {
  if (!repoData.object) return null;

  if (repoData.object.__typename !== "Tree")
    return (
      <pre>{(repoData.object as GetRepoObjectBlobInlineFragment).text}</pre>
    );

  if (!(repoData.object as GetRepoObjectTreeInlineFragment).entries)
    return null;

  return (
    <FilesWrapper>
      {(repoData.object as GetRepoObjectTreeInlineFragment)
        .entries!.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
        .map((_, idx: number) => {
          const newPath =
            `/group/${groupId}/path` +
            (path ? `/${[path, _.name].join("/")}` : `/${_.name}`);

          return (
            <Item key={idx}>
              <Link href={newPath}>
                <p>{_.name}</p>
              </Link>
              {idx !=
                (repoData.object as GetRepoObjectTreeInlineFragment).entries!
                  .length -
                  1 && <Line />}
            </Item>
          );
        })}
    </FilesWrapper>
  );
};

export default GroupView;
