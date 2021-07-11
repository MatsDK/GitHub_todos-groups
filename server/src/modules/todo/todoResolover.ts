import dayjs from "dayjs";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Todo } from "../../entity/Todo";
import { isAuth } from "../middleware/isAuth";
import { CreateTodoInput } from "./createTodoInput";
import { Comment } from "../../entity/Comment";
import { MyContext } from "src/types/types";

@Resolver()
export class TodoResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Todo, { nullable: true })
  async createTodo(
    @Arg("data")
    { todoBody, todoTitle, fileName, todoGroupId }: CreateTodoInput,
    @Ctx() ctx: MyContext
  ): Promise<Todo> {
    const timeStamp = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const todo = await Todo.create({
      todoAuthorId: (ctx.req as any).userId,
      fileName,
      todoTitle,
      todoBody,
      timeStamp,
      todoGroupId,
    }).save();

    return todo;
  }

  @UseMiddleware(isAuth)
  @Query(() => [Todo])
  getTodos(@Arg("groupId") groupId: number): Promise<Todo[]> {
    return Todo.find({ where: { todoGroupId: groupId } });
  }

  @Query(() => [Todo])
  todos(): Promise<Todo[]> {
    return Todo.find();
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteTodo(
    @Arg("todoId") todoId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const todo = await Todo.findOne({ where: { id: todoId } });
    if (todo && todo.todoAuthorId != (req as any).userId) return false;

    await Comment.delete({ todoId });
    await todo?.remove();

    return true;
  }
}
