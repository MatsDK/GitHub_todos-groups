import { GetTodoGetTodo } from "../../../generated/apolloComponents";
import CodeHighlight from "../../components/CodeHighlight";
import { LINE_LIMIT } from "../../utils/constants";

interface Props {
  file: string | null;
  todo: GetTodoGetTodo;
  fileData: {
    attachedFileData: string;
    setFileData: React.Dispatch<React.SetStateAction<string | null>>;
  };
  canShowMoreLines: boolean;
  setCanShowMoreLines: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoAttachtedFile: React.SFC<Props> = ({
  file,
  todo,
  fileData: { attachedFileData, setFileData },
  canShowMoreLines,
  setCanShowMoreLines,
}) => {
  return (
    <div>
      <CodeHighlight
        startNumber={todo.startLineNumber || 1}
        fileData={attachedFileData}
        path={todo.fileName}
      />
      {canShowMoreLines && (
        <button
          onClick={() => {
            setFileData((_) => {
              const data = _!.split("\n");
              const shownLines =
                (todo.startLineNumber as number) - 1 + data.length;

              const newFileData = [
                ...data,
                ...file!
                  .split("\n")
                  .slice(
                    shownLines,
                    Math.min(
                      shownLines + LINE_LIMIT,
                      todo.endLineNumber as number
                    )
                  ),
              ];

              setCanShowMoreLines(
                newFileData.length <
                  Math.min(
                    (todo.endLineNumber as number) -
                      (todo.startLineNumber as number),
                    (file || "").split("\n").length -
                      (todo.startLineNumber as number)
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
  );
};

export default TodoAttachtedFile;
