import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import {
  GetTodoGetTodo,
  GroupComments,
  GroupGroup,
  DeleteTodoComponent,
  CompleteTodoComponent,
  LoadCommentsComponent,
} from "../../generated/apolloComponents";
import CommentForm from "./Forms/CommentForm";
import { groupQuery } from "../../graphql/group/query/group";
import { LoadCommentsQuery } from "../../graphql/todo/query/comments";
import { MeContext } from "../context/meContext";
import { responseIsInvalid } from "../utils/isResponseValid";
import { sortDates } from "../utils/sortDates";
import { hasAttachedFile } from "../utils/todoUtils";
import Picture from "../ui/Picture";
import { MenuDots } from "./icons";
import Link from "next/link";
import {
  TodoTop,
  Timestamp,
  DropDown,
  Icon,
  TodoTitle,
  TodoContent,
  AttachedFile,
  FileLink,
} from "../ui/Todopage";
import ReactMarkdown from "react-markdown";
import CodeHighlight from "../components/CodeHighlight";
import { LINE_LIMIT } from "../utils/constants";
import Comment from "./Comment";

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
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(todo.comments.length);
  const [comments, setComments] = useState<GroupComments[]>(
    sortDates(todo.comments || [], "timeStamp")
  );
  const [canLoadMore, setCanLoadMore] = useState<boolean>(
    comments.length < todo.commentsCount
  );
  const [showComments, setShowComments] = useState<boolean>(
    !!todo.commentsCount
  );
  const [attachedFileData, setFileData] = useState<string | null>(null);
  const [canShowMoreLines, setCanShowMoreLines] = useState<boolean>(true);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  useEffect(() => {
    if (hasAttachedFile(fileData, lineNumbers)) {
      const fileDataLines = fileData!.split("\n");

      setFileData(
        fileDataLines
          .slice(
            (rest.todo.startLineNumber as number) >= 0
              ? (rest.todo.startLineNumber as number) - 1
              : 0,
            (rest.todo.startLineNumber as number) >= 0
              ? (rest.todo.startLineNumber as number) + 9
              : 9
          )
          .join("\n")
      );

      setCanShowMoreLines(
        (rest.todo.endLineNumber as number) -
          (rest.todo.startLineNumber as number) >
          10
      );
    }

    return () => {};
  }, []);

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
                            if (!res || !res.data || !res.data.deleteTodo)
                              return;

                            removeTodo(todo.id);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </DeleteTodoComponent>
                    <CompleteTodoComponent
                      variables={{ todoId: Number(todo.id) }}
                    >
                      {(completeTodo) => (
                        <button
                          onClick={async () => {
                            const res = await completeTodo();
                            if (!res || !res.data || !res.data.completeTodo)
                              return;
                          }}
                        >
                          Completed
                        </button>
                      )}
                    </CompleteTodoComponent>
                  </DropDown>
                )}
              </div>
            )}
          </div>
        </TodoTop>
      </div>
      <div>
        <TodoContent>
          <TodoTitle>{todo.todoTitle}</TodoTitle>
          <pre>
            <ReactMarkdown>{todo.todoBody}</ReactMarkdown>
          </pre>
          {todo.fileName && (
            <AttachedFile>
              <span style={{ marginLeft: 0 }}>Attached Path: </span>
              <div>
                <Link href={`/group/${todo.todoGroupId}/path/${todo.fileName}`}>
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
        </TodoContent>
        <div>
          <div>
            {attachedFileData && (
              <div>
                <CodeHighlight
                  startNumber={todo.startLineNumber || 1}
                  fileData={attachedFileData}
                  path={rest.todo.fileName}
                />
                {canShowMoreLines && (
                  <button
                    onClick={() => {
                      setFileData((_) => {
                        const data = _!.split("\n");
                        const shownLines =
                          (rest.todo.startLineNumber as number) -
                          1 +
                          data.length;

                        const newFileData = [
                          ...data,
                          ...fileData!
                            .split("\n")
                            .slice(
                              shownLines,
                              Math.min(shownLines + LINE_LIMIT, rest.todo
                                .endLineNumber as number)
                            ),
                        ];

                        setCanShowMoreLines(
                          newFileData.length <
                            Math.min(
                              (rest.todo.endLineNumber as number) -
                                (rest.todo.startLineNumber as number),
                              (fileData || "").split("\n").length -
                                (rest.todo.startLineNumber as number)
                            ) +
                              1
                        );

                        return newFileData.join("\n");
                      });
                    }}
                  >
                    show more lines
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <button onClick={() => setShowComments((_) => !_)}>
          ({todo.commentsCount}) Comments
        </button>

        <button onClick={() => setShowCommentForm((_) => !_)}>comment</button>
      </div>

      {showCommentForm && (
        <CommentForm
          addComment={(newComment: any) => {
            setSkip((skip) => skip + 1);

            setTodo((todo) => ({
              ...todo,
              commentsCount: todo.commentsCount + 1,
              comments: sortDates([newComment, ...todo.comments], "timeStamp"),
            }));

            setShowCommentForm(false);
            setShowComments(true);
          }}
          todo={todo}
        />
      )}

      {showComments && (
        <div
          style={{
            padding: 15,
            marginLeft: 10,
            borderLeft: "1px solid black",
          }}
        >
          {comments.map((comment: GroupComments, idx: number) => (
            <Comment
              comment={comment}
              key={idx}
              removeComment={removeComment}
            />
          ))}

          {canLoadMore && (
            <LoadCommentsComponent skip={true}>
              {({ client }) => (
                <button
                  onClick={async () => {
                    const res = await client.query({
                      query: LoadCommentsQuery,
                      variables: {
                        todoId: parseInt(todo.id),
                        skip,
                      },
                    });

                    if (responseIsInvalid(res, "comments")) return;

                    setSkip((skip) => skip + res.data.comments.length);

                    if (!res.data.comments.length) return setCanLoadMore(false);

                    setComments((comments) =>
                      sortDates(
                        [...(res.data.comments as any[]), ...comments],
                        "timeStamp"
                      )
                    );
                  }}
                >
                  load more
                </button>
              )}
            </LoadCommentsComponent>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoView;
