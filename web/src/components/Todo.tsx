import dayjs from "dayjs";
import { Field, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  CompleteTodoComponent,
  CreateCommentComponent,
  DeleteTodoComponent,
  GetTodoGetTodo,
  GroupComments,
  GroupGroup,
  LoadCommentsComponent,
} from "../../generated/apolloComponents";
import { groupQuery } from "../../graphql/group/query/group";
import { LoadCommentsQuery } from "../../graphql/todo/query/comments";
import { MeContext } from "../context/meContext";
import Picture from "../ui/Picture";
import { responseIsInvalid } from "../utils/isResponseValid";
import { sortDates } from "../utils/sortDates";
import Comment from "./Comment";
import { InputField } from "./inputField";

interface Props {
  todo: GetTodoGetTodo;
  removeTodo: (id: string) => void;
}

const Todo: React.FC<Props> = ({ removeTodo, ...rest }) => {
  const meContext = useContext(MeContext);
  const myTodo = meContext && meContext.id == rest.todo.author!.id;

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
        {todo.author!.pictureUrl && <Picture src={todo.author!.pictureUrl} />}
        {todo.author!.name}
        {" - "}
        {todo.author!.email}
        {" - "}
        {myTodo && "Me"}
        {" - "}
        {dayjs(todo.timeStamp).format("MMMM D, YYYY h:mm A")}
        {" - "}
        {myTodo && (
          <div>
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
          </div>
        )}
      </div>
      <div>
        <b>{todo.todoTitle}</b>
        {/* <pre>{todo.todoBody}</pre> */}
        <pre>
          <ReactMarkdown>{todo.todoBody}</ReactMarkdown>
        </pre>
        <div>
          <p>path: {todo.fileName}</p>
          <p>start: {todo.startLineNumber}</p>
          <p>end: {todo.endLineNumber}</p>
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
          style={{ padding: 15, marginLeft: 10, borderLeft: "1px solid black" }}
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

interface CommentFormProps {
  todo: GetTodoGetTodo;
  addComment: any;
}

const CommentForm: React.FC<CommentFormProps> = ({ todo, addComment }) => (
  <div style={{ padding: 15, marginLeft: 10, borderLeft: "1px solid black" }}>
    <CreateCommentComponent>
      {(createComment) => (
        <Formik
          validateOnBlur={false}
          enableReinitialize={true}
          validateOnChange={false}
          onSubmit={async (data) => {
            const res = await createComment({
              variables: {
                data: {
                  todoId: Number(todo.id),
                  ...data,
                  parentCommentId: null,
                },
              },
            });

            if (!res || !res.data || !res.data.createComment) return;

            addComment(res.data.createComment);
          }}
          initialValues={{
            text: "",
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field name="text" placeholder="text" component={InputField} />
              <button type="submit">create comment</button>
            </form>
          )}
        </Formik>
      )}
    </CreateCommentComponent>
  </div>
);

export default Todo;
