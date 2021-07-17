import {
  CreateTodoComponent,
  GroupGroup,
} from "../../../generated/apolloComponents";
import { Formik, Field } from "formik";
import { InputField, TextAreaField } from "./inputField";
import { useState } from "react";
import { useEffect } from "react";
import { groupQuery } from "../../../graphql/group/query/group";
import styled from "styled-components";
import { CloseIcon } from "../icons";
import { Button } from "../../ui/Button";
import ReactMarkdown from "react-markdown";
import { GetTypeQueryComponent } from "../../../generated/github-apollo-components";
import { getTypeQuery } from "../../../github-graphql/query/getType";

interface Props {
  group: GroupGroup;
  path: string[];
  addTodo: any;
  isFilePath: boolean;
  closeForm: () => void;
}
type LineNumbers = {
  startLineNumber: null | number;
  endLineNumber: null | number;
};

const Label = styled("p")<{ button?: any }>`
  font-size: 20px;
  margin: 10px 0 5px 0;
  color: ${(props) => props.theme.textColors[2]};
  cursor: ${(props) => (props.button ? "pointer" : "inerhit")};
  margin-right: ${(props) => (props.button ? "10px" : "0")};
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

const Preview = styled.div`
  resize: vertical;
  max-height: 400px;
  min-height: 150px;
  flex: 1;
  border: 2px solid ${(props) => props.theme.mainBgColor};
  width: calc(100% - 20px);
  padding: 2px 10px;
`;

const newTodoForm: React.SFC<Props> = ({
  group,
  path,
  addTodo,
  closeForm,
  ...rest
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [fileName, setFileName] = useState<string>(path.join("/"));
  const [isFilePath, setIsFilePath] = useState<boolean>(rest.isFilePath);
  const [startLineNumber, setStartLineNumber] = useState<null | number>(null);
  const [endLineNumber, setEndLineNumber] = useState<null | number>(null);
  const [pathPlaceHolder, setPathPlaceHolder] = useState<string>(
    path.join("/")
  );

  useEffect(() => {
    setPathPlaceHolder(path.join("/"));

    return () => {};
  }, [path]);

  useEffect(() => {
    if (path.join("/") == fileName) return setIsFilePath(rest.isFilePath);
    if (!rest.isFilePath) setIsFilePath(false);
  }, [fileName]);

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

                const validLineNumbers: boolean =
                  startLineNumber != null &&
                  endLineNumber != null &&
                  endLineNumber > startLineNumber &&
                  endLineNumber - startLineNumber > 0;

                const lineNumbers: LineNumbers = {
                  startLineNumber: validLineNumbers ? startLineNumber : null,
                  endLineNumber: validLineNumbers ? endLineNumber : null,
                };

                const res = await createTodo({
                  variables: {
                    data: {
                      ...data,
                      todoGroupId: Number(group.id),
                      fileName: data.fileName || "",
                      ...lineNumbers,
                    },
                  },
                  update: (cache, { data }) => {
                    try {
                      const cacheData: any = cache.readQuery({
                        query: groupQuery,
                        variables: { groupId: Number(group.id) },
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
                        variables: { groupId: Number(group.id) },
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
                startLineNumber: "",
                endLineNumber: "",
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
                  <div style={{ display: "flex" }}>
                    <Label button onClick={() => setShowPreview(false)}>
                      Write
                    </Label>
                    <Label button onClick={() => setShowPreview(true)}>
                      Preview
                    </Label>
                  </div>
                  {!showPreview ? (
                    <Field
                      name="todoBody"
                      placeholder="todo body"
                      setValue={setInputValue}
                      component={TextAreaField}
                    />
                  ) : (
                    <Preview>
                      <ReactMarkdown>{inputValue}</ReactMarkdown>
                    </Preview>
                  )}
                  <Label>File Path</Label>
                  <div style={{ display: "flex" }}>
                    <Field
                      name="fileName"
                      placeholder={"filename"}
                      setValue={setFileName}
                      component={InputField}
                    />
                    <GetTypeQueryComponent skip={true}>
                      {(query) => (
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await query.client.query({
                              query: getTypeQuery,
                              context: { server: "github" },
                              variables: {
                                owner: group.repoOwner,
                                name: group.repoName,
                                expression: `${group.mainBranch}:${fileName}`,
                              },
                            });

                            if (!res || !res.data || !res.data.repository)
                              return;

                            if (
                              !res.data.repository.object ||
                              !res.data.repository.object.__typename
                            )
                              return console.log("Path not found");

                            setIsFilePath(
                              res.data.repository.object.__typename == "Blob"
                            );
                          }}
                        >
                          Enter
                        </button>
                      )}
                    </GetTypeQueryComponent>
                    {isFilePath && (
                      <div style={{ display: "flex" }}>
                        <Field
                          name="startLineNumber"
                          placeholder="startLineNumber"
                          setValue={(value: string) =>
                            setStartLineNumber(Number(value) || null)
                          }
                          component={InputField}
                        />
                        <Field
                          name="endLineNumber"
                          placeholder="endLineNumber"
                          setValue={(value: string) =>
                            setEndLineNumber(Number(value) || null)
                          }
                          component={InputField}
                        />
                      </div>
                    )}
                  </div>
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
