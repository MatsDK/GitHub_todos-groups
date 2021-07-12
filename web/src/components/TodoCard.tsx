import dayjs from "dayjs";
import React, { useContext } from "react";
import Picture from "../ui/Picture";
import { GroupTodos } from "../../generated/apolloComponents";
import { MeContext } from "../context/meContext";
import Link from "next/link";
import { Todo } from "../ui/Todo";

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
      <div style={{ marginBottom: 0, marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            width: 450,
            justifyContent: "space-between",
          }}
        >
          <p>
            {todo.author!.pictureUrl && (
              <Picture src={todo.author!.pictureUrl} />
            )}
          </p>
          <p>{todo.author!.name}</p>
          <p>{todo.author!.email}</p>
          <p>{myTodo && "Me"}</p>
          <p>
            {(dayjs(todo.timeStamp) as any).toNow(true)
            // .format("MMMM D, YYYY h:mm A")
            }{" "}
            ago
          </p>
        </div>
        <div>
          <b>{todo.todoTitle}</b>
          <span>{todo.todoBody}</span>
        </div>

        <Link href={`/group/${todo.todoGroupId}/todo/${todo.id}`}>
          <p>{todo.commentsCount} Comments</p>
        </Link>
      </div>
    </Todo>
  );
};

export default TodoCard;
