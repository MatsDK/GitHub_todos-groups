import {
  CreateTodoComponent,
  CreateTodoCreateTodo,
  GroupTodos,
} from "../../generated/apolloComponents";
import { Formik, Field } from "formik";
import { InputField } from "./inputField";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  groupId: number;
  setTodos: React.Dispatch<React.SetStateAction<GroupTodos[]>>;
  path: string[];
}

const newTodoForm: React.SFC<Props> = ({ groupId, setTodos, path }) => {
  const [pathPlaceHolder, setPathPlaceHolder] = useState<string>(
    path.join("/")
  );

  useEffect(() => {
    setPathPlaceHolder(path.join("/"));

    return () => {};
  }, [path]);

  return (
    <div>
      <CreateTodoComponent>
        {(createTodo) => (
          <Formik
            validateOnBlur={false}
            enableReinitialize={true}
            validateOnChange={false}
            onSubmit={async (data) => {
              const res = await createTodo({
                variables: { data: { ...data, todoGroupId: groupId } },
              });

              if (!res || !res.data || !res.data.createTodo) return;

              setTodos(res.data.createTodo
                .reverse()
                .filter((_: CreateTodoCreateTodo) =>
                  _.fileName.includes(path.join("/"))
                ) as GroupTodos[]);
            }}
            initialValues={{
              fileName: pathPlaceHolder,
              todoTitle: "",
              todoBody: "",
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  name="todoTitle"
                  placeholder="todo title"
                  component={InputField}
                />
                <Field
                  name="todoBody"
                  placeholder="todo body"
                  component={InputField}
                />
                <Field
                  name="fileName"
                  placeholder={"filename"}
                  component={InputField}
                />
                <button type="submit">create todo</button>
              </form>
            )}
          </Formik>
        )}
      </CreateTodoComponent>
    </div>
  );
};

export default newTodoForm;
