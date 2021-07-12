import { GroupTodos } from "../../generated/apolloComponents";

export const FilterTodos = <T extends GroupTodos>(
  todos: T[],
  path: string[]
): T[] => todos.filter((_: T) => _.fileName.includes(path.join("/")));
