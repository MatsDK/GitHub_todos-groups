import { Todo } from "../../entity/Todo";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { isAuth } from "../middleware/isAuth";
import { CreateTodoInput } from "./createTodoInput";
import dayjs from "dayjs";

@Resolver()
export class TodoResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Todo, { nullable: true })
  async createTodo(
    @Arg("data")
    { todoBody, todoTitle, fileName, todoGroupId }: CreateTodoInput,
    @Ctx() ctx: MyContext
  ): Promise<Todo | undefined> {
    const timeStamp = dayjs().format("YYYY-MM-DD HH:mm");

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

  @Query(() => [Todo])
  async todos(): Promise<Todo[]> {
    return Todo.find();
  }
}
