import dayjs from "dayjs";
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
