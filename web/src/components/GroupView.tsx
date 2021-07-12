import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GroupGroup, GroupTodos } from "../../generated/apolloComponents";
import { GetRepoObjectRepository } from "../../generated/github-apollo-components";
import { ProgressSpan, TodoGrid } from "../ui/Todo";
import { sortDates } from "../utils/sortDates";
import { FilterTodos, SortTodos } from "../utils/todoUtils";
import { FilePath } from "./FilePath";
import Files from "./Files";
import NewTodoForm from "./NewTodoForm";
import TodoCard from "./TodoCard";

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
`;

const NewTodoButton = styled.button`
  padding: 5px 15px;
  color: ${(props) => props.theme.textColors[3]};
  background: ${(props) => props.theme.secondaryBgColor};
  border: 0;
  outline: none;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  transition: 0.1s ease;

  :hover {
    color: ${(props) => props.theme.textColors[1]};
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

const GroupView: React.FC<Props> = ({
  group,
  repoData,
  path: { groupId, path },
}) => {
  const [todos, setTodos] = useState<Array<GroupTodos>>(
    sortDates(group.todos, "timeStamp")
  );
  const [showTodoForm, setShowTodoForm] = useState<boolean>(false);

  useEffect(() => {
    setTodos(
      SortTodos(FilterTodos<GroupTodos>(group.todos, path), "timeStamp")
    );
    return () => {};
  }, [path]);

  const addTodo = (newTodo: any) => {
    setTodos((todos) => sortDates([newTodo, ...todos], "timeStamp"));
  };

  // const removeTodo = (id: string) => {
  //   setTodos((todos) => todos.filter((_: GroupTodos) => _.id != id));
  // };

  return (
    <>
      {showTodoForm && (
        <NewTodoForm
          path={path}
          closeForm={() => setShowTodoForm(false)}
          groupId={parseInt(group.id)}
          addTodo={addTodo}
        />
      )}
      <GroupHeader>
        <div>
          <Title>{group.name}</Title>
        </div>
        <button>Invite</button>
      </GroupHeader>
      <div>
        <div>
          <FilePath
            path={[group.repoName, ...path]}
            group={parseInt(group.id)}
          />
          <Files groupId={groupId} path={path.join("/")} repoData={repoData} />
        </div>
        <div>
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
                {todos.filter((todo) => !todo.completed).length} Acitive todos
              </ProgressSpan>
            </div>
            <div>
              <NewTodoButton
                onClick={() => setShowTodoForm((showTodoForm) => !showTodoForm)}
              >
                New Todo
              </NewTodoButton>
            </div>
          </div>
          <TodoGrid>
            <div>
              {todos.map(
                (_: GroupTodos, idx: number) =>
                  idx % 2 == 0 && <TodoCard key={idx} todo={_} />
              )}
            </div>
            <div>
              {todos.map(
                (_: GroupTodos, idx: number) =>
                  idx % 2 == 1 && <TodoCard key={idx} todo={_} />
              )}
            </div>
          </TodoGrid>
        </div>
      </div>
    </>
  );
};

export default GroupView;
