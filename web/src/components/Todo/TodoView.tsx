import dayjs from "dayjs";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MeContext } from "../../context/meContext";
import Picture from "../../ui/Picture";
import { sortDates } from "../../utils/sortDates";
import { hasAttachedFile } from "../../utils/todoUtils";
import { MenuDots } from "../icons";
import TodoAttachedFile from "./TodoAttachtedFile";
import TodoCommentsWrapper from "./TodoCommentsWrapper";
import TodoDropDown from "./TodoDropDown";
import {
  CompleteTodoComponent,
  GetTodoGetTodo,
  GroupComments,
  TakeTodoComponent,
} from "../../../generated/apolloComponents";
import {
  AttachedFile,
  FileLink,
  Icon,
  Timestamp,
  TodoContent,
  TodoTitle,
  TodoTop,
} from "../../ui/Todopage";

interface TodoViewProps {
  todo: GetTodoGetTodo;
  removeTodo: (id: string) => void;
  fileData: string | null;
}

const TodoView: React.FC<TodoViewProps> = ({
  removeTodo,
  fileData,
  ...rest
}) => {
  const meContext = useContext(MeContext);
  const myTodo = meContext && meContext.id == rest.todo.author!.id;
  const lineNumbers = {
    endLineNumber: rest.todo.endLineNumber,
    startLineNumber: rest.todo.startLineNumber,
  };

  const [todo, setTodo] = useState<GetTodoGetTodo>(rest.todo);
  const [comments, setComments] = useState<GroupComments[]>(
    sortDates(todo.comments || [], "timeStamp")
  );
  const [attachedFileData, setFileData] = useState<string | null>(null);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [canShowMoreLines, setCanShowMoreLines] = useState<boolean>(true);

  useEffect(() => {
    setComments(sortDates(todo.comments, "timeStamp"));
  }, [todo]);

  const removeComment = (id: string) => {
    setComments((comments) => comments.filter((_) => _.id != id));
    setTodo((todo) => ({
      ...todo,
      commentsCount: todo.commentsCount - 1,
      comments: comments.filter((_) => _.id != id),
    }));
  };

  useEffect(() => {
    if (hasAttachedFile(fileData, lineNumbers)) {
      const fileDataLines = fileData!.split("\n");

      setFileData(
        fileDataLines
          .slice(
            (todo.startLineNumber as number) >= 0
              ? (todo.startLineNumber as number) - 1
              : 0,
            (todo.startLineNumber as number) >= 0
              ? (todo.startLineNumber as number) + 9
              : 9
          )
          .join("\n")
      );

      setCanShowMoreLines(
        (todo.endLineNumber as number) - (todo.startLineNumber as number) > 10
      );
    }

    return () => {};
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 0, marginTop: "10px" }}>
        <TodoTop>
          <div style={{ display: "flex", alignItems: "center" }}>
            {todo.author!.pictureUrl && (
              <Picture src={todo.author!.pictureUrl} />
            )}
            <p>
              {todo.author!.name}

              <span>{myTodo && " (Me)"}</span>
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Timestamp style={{ marginRight: 15 }}>
              {dayjs(todo.timeStamp).format("MMMM D, YYYY h:mm A")}
            </Timestamp>
            {myTodo && (
              <div>
                <Icon
                  onClick={() =>
                    setShowDropDown((showDropDown) => !showDropDown)
                  }
                >
                  <MenuDots />
                </Icon>
                {showDropDown && (
                  <TodoDropDown removeTodo={removeTodo} todo={todo} />
                )}
              </div>
            )}
          </div>
        </TodoTop>
      </div>
      {rest.todo.userId != null && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>In Progress:</span>
          <div
            style={{ display: "flex", alignItems: "center", marginLeft: 10 }}
          >
            {todo.author!.pictureUrl && (
              <Picture src={todo.author!.pictureUrl} />
            )}
            <p>
              {todo.author!.name}

              <span>{myTodo && " (Me)"}</span>
            </p>
          </div>
        </div>
      )}
      <div>
        <TodoContent>
          <TodoTitle>{todo.todoTitle}</TodoTitle>
          <pre>
            <ReactMarkdown>{todo.todoBody}</ReactMarkdown>
          </pre>
          <div>
            {todo.fileName && (
              <AttachedFile>
                <span style={{ marginLeft: 0 }}>Attached Path: </span>
                <div>
                  <Link
                    href={`/group/${todo.todoGroupId}/path/${todo.fileName}`}
                  >
                    <FileLink>{todo.fileName}</FileLink>
                  </Link>
                </div>
                <div style={{ display: "flex" }}>
                  {todo.startLineNumber != null && todo.endLineNumber != null && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span>Lines:</span>
                      <p>
                        {todo.startLineNumber} - {todo.endLineNumber}
                      </p>
                    </div>
                  )}
                </div>
              </AttachedFile>
            )}
            {!todo.completed && (
              <CompleteTodoComponent variables={{ todoId: Number(todo.id) }}>
                {(completeTodo) => (
                  <button
                    onClick={async () => {
                      const res = await completeTodo();
                      if (!res || !res.data || !res.data.completeTodo) return;
                    }}
                  >
                    Completed
                  </button>
                )}
              </CompleteTodoComponent>
            )}
            {!todo.completed && todo.userId == null && (
              <TakeTodoComponent variables={{ todoId: Number(todo.id) }}>
                {(completeTodo) => (
                  <button
                    onClick={async () => {
                      const res = await completeTodo();
                      if (!res || !res.data || !res.data.takeTodo) return;
                    }}
                  >
                    Take Todo
                  </button>
                )}
              </TakeTodoComponent>
            )}
          </div>
        </TodoContent>
        <div>
          <div>
            {attachedFileData && (
              <TodoAttachedFile
                canShowMoreLines={canShowMoreLines}
                setCanShowMoreLines={setCanShowMoreLines}
                todo={todo}
                file={fileData}
                fileData={{ attachedFileData, setFileData }}
              />
            )}
          </div>
        </div>
        <TodoCommentsWrapper
          removeComment={removeComment}
          todo={todo}
          setTodo={setTodo}
          comments={comments}
          setComments={setComments}
        />
      </div>
    </div>
  );
};

export default TodoView;
