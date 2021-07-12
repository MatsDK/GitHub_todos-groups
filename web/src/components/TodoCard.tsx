import dayjs from "dayjs";
import React, { useContext } from "react";
import Picture from "../ui/Picture";
import { GroupTodos } from "../../generated/apolloComponents";
import { MeContext } from "../context/meContext";
import Link from "next/link";
import { Todo, TodoTop, RightTodo, TodoBody } from "../ui/Todo";
import { MenuDots } from "./icons";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

interface Props {
  todo: GroupTodos;
}

const TodoCard: React.FC<Props> = ({ todo }) => {
  const meContext = useContext(MeContext),
    myTodo = meContext && todo.author!.id == meContext.id;

  return (
    <Todo>
      <TodoTop>
        <div>
          {todo.author!.pictureUrl && <Picture src={todo.author!.pictureUrl} />}
          <p>
            {todo.author!.name}
            <span>{myTodo && " (Me)"}</span>
          </p>
        </div>
        <RightTodo>
          <p>{(dayjs(todo.timeStamp) as any).toNow(true)} ago</p>
          <MenuDots />
        </RightTodo>
      </TodoTop>
      <TodoBody>
        <h1>
          {todo.todoTitle} {todo.completed && <span>(Done)</span>}{" "}
        </h1>
        <span>{todo.todoBody}</span>
      </TodoBody>

      <Link href={`/group/${todo.todoGroupId}/todo/${todo.id}`}>
        <p>{todo.commentsCount} Comments</p>
      </Link>
    </Todo>
  );
};

export default TodoCard;
