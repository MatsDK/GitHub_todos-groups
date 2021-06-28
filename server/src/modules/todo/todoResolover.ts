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
import { MyContext } from "../../types/MyContext";
import { isAuth } from "../middleware/isAuth";
import { CreateTodoInput } from "./createTodoInput";

@Resolver()
export class TodoResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => [Todo], { nullable: true })
  async createTodo(
    @Arg("data")
    { todoBody, todoTitle, fileName, todoGroupId }: CreateTodoInput,
    @Ctx() ctx: MyContext
  ): Promise<Todo[] | undefined> {
    const timeStamp = dayjs().format("YYYY-MM-DD HH:mm:ss");

    await Todo.create({
      todoAuthorId: (ctx.req as any).userId,
      fileName,
      todoTitle,
      todoBody,
      timeStamp,
      todoGroupId,
    }).save();

    return Todo.find({ where: { todoGroupId } });
  }

  @UseMiddleware(isAuth)
  @Query(() => [Todo])
  getTodos(@Arg("groupId") groupId: number): Promise<Todo[]> {
    return Todo.find({ where: { todoGroupId: groupId } });
  }

  @Query(() => [Todo])
  async todos(): Promise<Todo[]> {
    return Todo.find();
  }
}
