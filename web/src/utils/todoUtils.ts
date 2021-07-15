import dayjs from "dayjs";
import languages from "../../languages.json";
import { GroupTodos } from "../../generated/apolloComponents";

export const FilterTodos = <T extends GroupTodos>(
  todos: T[],
  path: string[]
): T[] => todos.filter((_: T) => _.fileName.includes(path.join("/")));

export const SortTodos = <T extends GroupTodos>(
  todos: T[],
  key: "timeStamp"
): T[] =>
  todos.sort((a, b) => {
    if (a.completed != b.completed) {
      if (a.completed) return 1;
      else return -1;
    } else return dayjs(b[key]).unix() - dayjs(a[key]).unix();
  });

export const hasAttachedFile = (
  fileData: string | null,
  {
    endLineNumber,
    startLineNumber,
  }: { endLineNumber: number | null; startLineNumber: number | null }
): boolean =>
  !!fileData &&
  typeof startLineNumber == "number" &&
  typeof endLineNumber == "number";

export const detectLanguage = (path: string): string => {
  const ext: string = `.${path.split(".").pop()}`;
  const language: undefined | any[] = Object.entries(languages as any).find(
    (_: any) => {
      return _[1] && _[1].extensions && (_[1] as any).extensions.includes(ext);
    }
  );

  if (language) return language[0].toLowerCase();

  return "markdown";
};
