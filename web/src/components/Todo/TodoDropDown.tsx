import React from "react";
import {
  DeleteTodoComponent,
  GetTodoGetTodo,
  GroupGroup,
} from "../../../generated/apolloComponents";
import { groupQuery } from "../../../graphql/group/query/group";
import { DropDown } from "../../ui/Todopage";

interface Props {
  todo: GetTodoGetTodo;
  removeTodo: (id: string) => void;
}

const TodoDropDown: React.SFC<Props> = ({ todo, removeTodo }) => {
  return (
    <DropDown>
      <DeleteTodoComponent
        variables={{ todoId: Number(todo.id) }}
        update={(cache, { data }) => {
          try {
            if (!data || !data.deleteTodo) return;

            const cacheData: any = cache.readQuery({
              query: groupQuery,
              variables: { groupId: todo.todoGroupId },
            });
            if (!cacheData || !cacheData.group) return;

            cacheData.group.todos = (cacheData.group as GroupGroup).todos.filter(
              (_) => _.id != todo.id
            );

            cache.writeQuery({
              query: groupQuery,
              variables: { groupId: todo.todoGroupId },
              data: cacheData,
            });
          } catch {}
        }}
      >
        {(deleteTodo) => (
          <button
            onClick={async () => {
              const res = await deleteTodo();
              if (!res || !res.data || !res.data.deleteTodo) return;

              removeTodo(todo.id);
            }}
          >
            Delete
          </button>
        )}
      </DeleteTodoComponent>
    </DropDown>
  );
};

export default TodoDropDown;
