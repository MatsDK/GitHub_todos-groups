import React from "react";
import {
  GetTodoGetTodo,
  CreateCommentComponent,
} from "../../../generated/apolloComponents";
import { InputField } from "./inputField";
import { Formik, Field } from "formik";

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

export default CommentForm;
