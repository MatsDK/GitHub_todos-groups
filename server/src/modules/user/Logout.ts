import { MyContext } from "src/types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((res, rej) => {
      ctx.req.session.destroy((err) => {
        if (err) return rej(false);

        ctx.res.clearCookie("qid");
        return res(true);
      });
    });
  }
}
