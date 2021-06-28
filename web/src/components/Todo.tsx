import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
import {
  CreateCommentComponent,
  GroupComments,
  GroupTodos,
} from "../../generated/apolloComponents";
import { InputField } from "./inputField";
import { Formik, Field } from "formik";
import { sortDates } from "../sortDates";
import Picture from "../ui/Picture";

interface Props {
  todo: GroupTodos;
}

const Todo: React.FC<Props> = ({ todo }) => {
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [comments, setComments] = useState<GroupComments[]>(
    sortDates(todo.comments || [], "timeStamp")
  );

  return (
    <div>
      <p style={{ marginBottom: 0, marginTop: "10px" }}>
        {todo.author.pictureUrl && <Picture src={todo.author.pictureUrl} />}
        {todo.author.name}
        {" - "}
        {todo.author.email}
        {" - "}
        {dayjs(todo.timeStamp).format("MMMM D, YYYY h:mm A")}
      </p>
      <div>
        <b>{todo.todoTitle}</b>
        <span>{todo.todoBody}</span>
      </div>

      <button onClick={() => setShowCommentForm((_) => !_)}>Comment</button>
      {showCommentForm && (
        <CommentForm
          hideForm={() => setShowCommentForm(false)}
          todoId={Number(todo.id)}
          setComments={setComments}
        />
      )}

      <div style={{ marginLeft: 25 }}>
        {comments.map((comment: GroupComments, idx: number) => (
          <Comment comment={comment} key={idx} />
        ))}
      </div>
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
    <div style={{ marginLeft: 25 }}>
      <CreateCommentComponent>
        {(createComment) => (
          <Formik
            validateOnBlur={false}
            enableReinitialize={true}
            validateOnChange={false}
            onSubmit={async (data) => {
              const res = await createComment({
                variables: { data: { todoId, ...data } },
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
      <span>{comment.text}</span>
    </div>
  );
};

export default Todo;
