import { Comment } from "../../entity/Comment";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../../types/MyContext";
import { CreateCommentInput } from "./createCommentInput";
import dayjs from "dayjs";

@Resolver()
export class commentResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Comment])
  async comments(@Arg("todoId") todoId: number): Promise<Comment[]> {
    return Comment.find({ where: { todoId } });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async createComment(
    @Ctx() ctx: MyContext,
    @Arg("data") { text, todoId }: CreateCommentInput
  ): Promise<Comment> {
    const timeStamp = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const comment = await Comment.create({
      commentAuthorId: (ctx.req as any).userId,
      text,
      todoId,
      timeStamp,
    }).save();

    return comment;
  }
}
