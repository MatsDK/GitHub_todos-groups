import dayjs from "dayjs";
import {
  Arg,
  Ctx,
  Int,
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
    data: CreateTodoInput,
    @Ctx() ctx: MyContext
  ): Promise<Todo> {
    const timeStamp = dayjs().format("YYYY-MM-DD HH:mm:ss");

    return await Todo.create({
      todoAuthorId: (ctx.req as any).userId,
      timeStamp,

      ...data,
    }).save();
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

  @UseMiddleware(isAuth)
  @Query(() => Todo, { nullable: true })
  getTodo(@Arg("todoId") todoId: number): Promise<Todo | undefined> {
    return Todo.findOne({ where: { id: todoId } });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async completeTodo(
    @Arg("todoId", () => Int) todoId: number
  ): Promise<boolean> {
    try {
      await Todo.update({ id: todoId }, { completed: true, userId: null });

      return true;
    } catch (e) {
      return false;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async takeTodo(
    @Arg("todoId", () => Int) todoId: number,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    try {
      await Todo.update({ id: todoId }, { userId: context.req.userId });

      return true;
    } catch (e) {
      return false;
    }
  }
}
