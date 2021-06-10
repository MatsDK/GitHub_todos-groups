import { MyContext } from "src/types/MyContext";
import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    console.log((ctx.req as any).userId);
    if ((ctx.req as any).userId == null) return undefined;

    return User.findOne((ctx.req as any).userId);
  }
}
