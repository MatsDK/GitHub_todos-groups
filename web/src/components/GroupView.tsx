import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { GroupGroup, GroupTodos } from "../../generated/apolloComponents";
import { GetRepoObjectRepository } from "../../generated/github-apollo-components";
import { MeContext } from "../context/meContext";
import { DarkButton } from "../ui/Button";
import { Title } from "../ui/Dashboard";
import Picture from "../ui/Picture";
import { ProgressSpan, TodoGrid } from "../ui/Todo";
import { sortDates } from "../utils/sortDates";
import { FilterTodos, SortTodos } from "../utils/todoUtils";
import { FilePath } from "./FilePath";
import Files from "./Files";
import NewTodoForm from "./Forms/NewTodoForm";
import Invite from "./Invite";
import TodoCard from "./Todo/TodoCard";

interface Props {
  group: GroupGroup;
  repoData: GetRepoObjectRepository;
  path: { groupId: string; path: string[] };
}

const ScrollToTodosButton = styled.a`
  color: ${(props) => props.theme.textColors[2]};
  text-decoration: none;

  span {
    font-size: 24px;
    font-weight: 400;
    margin-right: 5px;
    transition: 0.15s ease;

    :hover {
      color: ${(props) => props.theme.textColors[0]};
    }
  }
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
  }
`;

const GroupUsers = styled.div`
  margin-left: 30px;

  div {
    img {
      margin-right: 10px;
    }

    p {
      position: absolute;
      box-shadow: 2px 2px 10px #0000009b;
      border-radius: 2px;
      transition: 0.14s ease;
      margin-top: 40px;
      padding: 3px 5px;
      background-color: ${(props) => props.theme.secondaryBgColor};
      transform: translateY(10px);
      opacity: 0;
      pointer-events: none;
    }
  }

  div:hover {
    p {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const GroupView: React.FC<Props> = ({
  group,
  repoData,
  path: { groupId, path },
}) => {
  const meContext = useContext(MeContext);
  const [todos, setTodos] = useState<Array<GroupTodos>>(
    sortDates(group.todos, "timeStamp")
  );
  const [showTodoForm, setShowTodoForm] = useState<boolean>(false);
  const [showInviteForm, setShowInviteForm] = useState<boolean>(false);

  useEffect(() => {
    setTodos(
      SortTodos(FilterTodos<GroupTodos>(group.todos, path), "timeStamp")
    );
    return () => {};
  }, [path]);

  const addTodo = (newTodo: any) => {
    setTodos((todos) => sortDates([newTodo, ...todos], "timeStamp"));
  };

  return (
    <>
      {showTodoForm && (
        <NewTodoForm
          path={path}
          closeForm={() => setShowTodoForm(false)}
          group={group}
          isFilePath={repoData.object.__typename == "Blob"}
          addTodo={addTodo}
        />
      )}
      {showInviteForm && (
        <Invite
          groupId={Number(group.id)}
          closeForm={() => setShowInviteForm(false)}
        />
      )}
      <GroupHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title>{group.name}</Title>
          <GroupUsers>
            {group.users.map(
              (user, idx) =>
                user.pictureUrl && (
                  <div key={idx}>
                    <Picture src={user.pictureUrl} />
                    <p>
                      {user.name}
                      {meContext && meContext.id == user.id && " (Me)"}
                      {user.isOwner && " (Owner)"}
                    </p>
                  </div>
                )
            )}
          </GroupUsers>
        </div>
        <div>
          <DarkButton onClick={() => setShowInviteForm(true)}>
            Invite
          </DarkButton>
        </div>
      </GroupHeader>
      <div>
        <div>
          <div style={{ display: "flex" }}>
            <FilePath
              path={[group.repoName, ...path]}
              group={parseInt(group.id)}
            />

            <ScrollToTodosButton href="#TodosSection">
              <span>Todos</span>
            </ScrollToTodosButton>
          </div>
          <Files groupId={groupId} path={path.join("/")} repoData={repoData} />
        </div>
        <div style={{ marginTop: 50 }} id="TodosSection">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Title>Todos</Title>
              <ProgressSpan>
                {todos.filter((todo) => !todo.completed).length} Active todos
              </ProgressSpan>
            </div>
            <div>
              <DarkButton
                onClick={() => setShowTodoForm((showTodoForm) => !showTodoForm)}
              >
                New Todo
              </DarkButton>
            </div>
          </div>
          <TodoGrid>
            {todos.map((_: GroupTodos, idx: number) => (
              <TodoCard key={idx} todo={_} />
            ))}
          </TodoGrid>
        </div>
      </div>
    </>
  );
};

export default GroupView;
