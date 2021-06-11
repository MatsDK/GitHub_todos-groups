import { MyContext } from "../../../src/types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    ctx.res.clearCookie("refresh-token");
    ctx.res.clearCookie("access-token");

    return true;
  }
}
