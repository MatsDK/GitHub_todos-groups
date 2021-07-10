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
import { COMMENTS_LIMIT } from "../../constants";
import { IsNull } from "typeorm";

@Resolver()
export class commentResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Comment])
  comments(
    @Arg("todoId") todoId: number,
    @Arg("skip") skip: number
  ): Promise<Comment[]> {
    return Comment.find({
      where: { todoId, parentCommentId: IsNull() },
      skip,
      take: COMMENTS_LIMIT,
      order: { timeStamp: "DESC" },
    });
  }

  @UseMiddleware(isAuth)
  @Query(() => [Comment])
  allComments(): Promise<Comment[]> {
    return Comment.find();
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Comment, { nullable: true })
  async createComment(
    @Ctx() ctx: MyContext,
    @Arg("data") { text, todoId, parentCommentId }: CreateCommentInput
  ): Promise<Comment> {
    const timeStamp = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const comment = await Comment.create({
      commentAuthorId: (ctx.req as any).userId,
      parentCommentId,
      text,
      todoId,
      timeStamp,
    }).save();

    return comment;
  }

  @UseMiddleware(isAuth)
  @Query(() => [Comment])
  nestedComments(
    @Arg("parentCommentId") parentCommentId: number,
    @Arg("skip") skip: number
  ) {
    return Comment.find({
      where: { parentCommentId },
      take: COMMENTS_LIMIT,
      skip,
      order: { timeStamp: "DESC" },
    });
  }
}
