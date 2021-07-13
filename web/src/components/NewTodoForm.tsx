import { CreateTodoComponent } from "../../generated/apolloComponents";
import { Formik, Field } from "formik";
import { InputField, TextAreaField } from "./inputField";
import { useState } from "react";
import { useEffect } from "react";
import { groupQuery } from "../../graphql/group/query/group";
import styled from "styled-components";
import { CloseIcon } from "./icons";
import { Button } from "../ui/Button";

interface Props {
  groupId: number;
  path: string[];
  addTodo: any;
  closeForm: () => void;
}

const Label = styled.p`
  font-size: 20px;
  margin: 10px 0 5px 0;
  color: ${(props) => props.theme.textColors[2]};
`;

const NewTodoPopup = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 100;
`;

const NewTodoPopupInner = styled.div`
  min-width: 200px;
  width: calc(100vw - 600px);
  border-radius: 3px;
  padding: 20px 50px;
  max-width: 1000px;
  /* height: 40vh; */
  min-height: 300px;
  max-height: 600px;
  background: ${(props) => props.theme.secondaryBgColor};
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0;
`;

const newTodoForm: React.SFC<Props> = ({
  groupId,
  path,
  addTodo,
  closeForm,
}) => {
  const [pathPlaceHolder, setPathPlaceHolder] = useState<string>(
    path.join("/")
  );

  useEffect(() => {
    setPathPlaceHolder(path.join("/"));

    return () => {};
  }, [path]);

  return (
    <NewTodoPopup
      onClick={(e) => {
        if (e.target == e.currentTarget) closeForm();
      }}
    >
      <NewTodoPopupInner>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title>Create New Todo</Title>
          <div onClick={() => closeForm()}>
            <CloseIcon />
          </div>
        </div>
        <CreateTodoComponent>
          {(createTodo) => (
            <Formik
              validateOnBlur={false}
              enableReinitialize={true}
              validateOnChange={false}
              onSubmit={async (data) => {
                if (
                  !data.todoBody.trim().length ||
                  !data.todoTitle.trim().length
                )
                  return;
                console.log({
                  ...data,
                  todoGroupId: groupId,
                  fileName: data.fileName || "",
                });

                const res = await createTodo({
                  variables: {
                    data: {
                      ...data,
                      todoGroupId: groupId,
                      fileName: data.fileName || "",
                    },
                  },
                  update: (cache, { data }) => {
                    try {
                      const cacheData: any = cache.readQuery({
                        query: groupQuery,
                        variables: { groupId },
                      });

                      if (
                        !cacheData ||
                        !cacheData.group ||
                        !data ||
                        !data.createTodo
                      )
                        return;

                      cacheData.group.todos = [
                        data.createTodo,
                        ...cacheData.group.todos,
                      ];

                      cache.writeQuery({
                        query: groupQuery,
                        variables: { groupId },
                        data: cacheData,
                      });
                    } catch {}
                  },
                });

                if (!res || !res.data || !res.data.createTodo) return;

                closeForm();
                addTodo(res.data.createTodo);
              }}
              initialValues={{
                fileName: pathPlaceHolder,
                todoTitle: "",
                todoBody: "",
              }}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit} style={{ flex: "1" }}>
                  <Label>Todo Title</Label>
                  <Field
                    name="todoTitle"
                    placeholder="todo title"
                    component={InputField}
                  />
                  <Label>Write Todo Body</Label>
                  <Field
                    name="todoBody"
                    placeholder="todo body"
                    component={TextAreaField}
                  />
                  <Label>File Path</Label>
                  <Field
                    name="fileName"
                    placeholder={"filename"}
                    component={InputField}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="submit">Create Todo</Button>
                  </div>
                </form>
              )}
            </Formik>
          )}
        </CreateTodoComponent>
      </NewTodoPopupInner>
    </NewTodoPopup>
  );
};

export default newTodoForm;
