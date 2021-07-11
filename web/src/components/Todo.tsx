import dayjs from "dayjs";
import { Field, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import {
  CreateCommentComponent,
  DeleteTodoComponent,
  GroupComments,
  GroupTodos,
  LoadCommentsComponent,
} from "../../generated/apolloComponents";
import { LoadCommentsQuery } from "../../graphql/todo/query/comments";
import { MeContext } from "../context/meContext";
import { responseIsInvalid } from "../isResponseValid";
import { sortDates } from "../sortDates";
import Picture from "../ui/Picture";
import Comment from "./Comment";
import { InputField } from "./inputField";

interface Props {
  todo: GroupTodos;
  removeTodo: (id: string) => void;
}

const Todo: React.FC<Props> = ({ removeTodo, ...rest }) => {
  const meContext = useContext(MeContext);
  const myTodo = meContext && meContext.id == rest.todo.author!.id;

  const [todo, setTodo] = useState<GroupTodos>(rest.todo);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(
    !!todo.commentsCount
  );
  const [comments, setComments] = useState<GroupComments[]>(
    sortDates(todo.comments || [], "timeStamp")
  );
  const [canLoadMore, setCanLoadMore] = useState<boolean>(
    comments.length < todo.commentsCount
  );
  const [skip, setSkip] = useState<number>(comments.length);

  useEffect(() => {
    setComments(sortDates(todo.comments, "timeStamp"));
  }, [todo]);

  const removeComment = (id: string) => {
    setComments((comments) => comments.filter((_) => _.id != id));
    setTodo((todo) => ({
      ...todo,
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
            <DeleteTodoComponent variables={{ todoId: Number(todo.id) }}>
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
            <button>Completed</button>
          </div>
        )}
      </div>
      <div>
        <b>{todo.todoTitle}</b>
        <span>{todo.todoBody}</span>
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
  todo: GroupTodos;
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
              // refetchQueries: [
              //   {
              //     query: groupQuery,
              //     variables: { groupId: todo.todoGroupId },
              //   },
              // ],
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
