import { Formik, Field } from "formik";
import { CreateCommentComponent } from "../../../generated/apolloComponents";
import { InputField } from "./inputField";

interface NestedCommentFormProps {
  todoId: number;
  parentCommentId: number;
  newComment: (newComments: any) => void;
}

const NestedCommentForm: React.FC<NestedCommentFormProps> = ({
  todoId,
  parentCommentId,
  newComment,
}) => (
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

            newComment(res.data.createComment);
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
export default NestedCommentForm;
