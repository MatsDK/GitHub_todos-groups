import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
import {
  CreateCommentComponent,
  GroupComments,
  GroupTodos,
  NestedCommentsComponent,
} from "../../generated/apolloComponents";
import { InputField } from "./inputField";
import { Formik, Field } from "formik";
import { sortDates } from "../sortDates";
import Picture from "../ui/Picture";
import { NestedCommentsQuery } from "../../graphql/todo/query/comments";
import { responseIsInvalid } from "../isResponseValid";

interface Props {
  todo: GroupTodos;
}

const Todo: React.FC<Props> = ({ todo }) => {
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(true);
  const [comments, setComments] = useState<GroupComments[]>(
    sortDates(todo.comments || [], "timeStamp")
  );

  return (
    <div>
      <p style={{ marginBottom: 0, marginTop: "10px" }}>
        {todo.author!.pictureUrl && <Picture src={todo.author!.pictureUrl} />}
        {todo.author!.name}
        {" - "}
        {todo.author!.email}
        {" - "}
        {dayjs(todo.timeStamp).format("MMMM D, YYYY h:mm A")}
      </p>
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
          hideForm={() => setShowCommentForm(false)}
          todoId={Number(todo.id)}
          setComments={setComments}
        />
      )}

      {showComments && (
        <div
          style={{ padding: 15, marginLeft: 10, borderLeft: "1px solid black" }}
        >
          {comments.map((comment: GroupComments, idx: number) => (
            <Comment comment={comment} key={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentFormProps {
  setComments: React.Dispatch<React.SetStateAction<GroupComments[]>>;
  todoId: number;
  hideForm: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  todoId,
  setComments,
  hideForm,
}) => {
  return (
    <div style={{ padding: 15, marginLeft: 10, borderLeft: "1px solid black" }}>
      <CreateCommentComponent>
        {(createComment) => (
          <Formik
            validateOnBlur={false}
            enableReinitialize={true}
            validateOnChange={false}
            onSubmit={async (data) => {
              const res = await createComment({
                variables: { data: { todoId, ...data, parentCommentId: null } },
              });

              if (!res || !res.data || !res.data.createComment) return;

              setComments(
                (comments) => [res.data!.createComment, ...comments] as any
              );
              hideForm();
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
};

interface CommentProps {
  comment: GroupComments;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [nestedComments, setNestedComments] = useState<GroupComments[] | null>(
    comment.comments ? sortDates(comment.comments as any, "timeStamp") : null
  );
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

  return (
    <div>
      <div style={{ display: "flex" }}>
        {comment.author.pictureUrl && (
          <Picture src={comment.author.pictureUrl} />
        )}
        <p>{comment.author.name}</p>
        <p>{comment.author.email}</p>
        <p>{dayjs(comment.timeStamp).format("MMMM D, YYYY h:mm A")}</p>
      </div>
      <div
        style={{
          marginBottom: 10,
          padding: 15,
          marginLeft: 10,
          borderLeft: "1px solid black",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <span>{comment.text}</span>
        </div>

        <NestedCommentsComponent
          skip={true}
          variables={{ parentId: Number(comment.id) }}
        >
          {(comments) => {
            return (
              <div>
                <button
                  onClick={async () => {
                    setShowComments((showcomments) => !showcomments);

                    if (!nestedComments) {
                      setLoadingComments(true);

                      const res = await comments.client.query({
                        query: NestedCommentsQuery,
                        variables: { parentId: Number(comment.id) },
                      });

                      if (responseIsInvalid(res, "nestedComments"))
                        return setLoadingComments(false);

                      setNestedComments((nestedComments) =>
                        sortDates(
                          [
                            ...(res.data.nestedComments as any),
                            ...((nestedComments as any) || []),
                          ],
                          "timeStamp"
                        )
                      );

                      setLoadingComments(false);
                    }
                  }}
                >
                  ({comment.commentsCount}) Comments
                </button>

                <button
                  onClick={() =>
                    setShowCommentForm((showCommentForm) => !showCommentForm)
                  }
                >
                  Comment
                </button>

                {showCommentForm && (
                  <NestedCommentForm
                    todoId={comment.todoId}
                    parentCommentId={parseInt(comment.id)}
                    setNestedComments={setNestedComments}
                    showComments={setShowComments}
                  />
                )}

                {loadingComments && "Loading..."}

                {showComments &&
                  nestedComments &&
                  nestedComments.map((_: GroupComments, idx: number) => (
                    <Comment comment={_} key={idx} />
                  ))}
              </div>
            );
          }}
        </NestedCommentsComponent>
      </div>
    </div>
  );
};

interface NestedCommentFormProps {
  todoId: number;
  parentCommentId: number;
  setNestedComments: React.Dispatch<
    React.SetStateAction<GroupComments[] | null>
  >;
  showComments: React.Dispatch<React.SetStateAction<boolean>>;
}

const NestedCommentForm: React.FC<NestedCommentFormProps> = ({
  todoId,
  parentCommentId,
  setNestedComments,
  showComments,
}) => {
  return (
    <div style={{ marginLeft: 25 }}>
      <CreateCommentComponent>
        {(createComment) => (
          <Formik
            validateOnBlur={false}
            enableReinitialize={true}
            validateOnChange={false}
            onSubmit={async (data) => {
              const res = await createComment({
                variables: {
                  data: { todoId, text: data.text, parentCommentId },
                },
              });

              if (!res || !res.data || !res.data.createComment) return;

              setNestedComments((nestedComments) => [
                res.data!.createComment as any,
                ...((nestedComments as any) || []),
              ]);

              showComments(true);
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
};

export default Todo;
