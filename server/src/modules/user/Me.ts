import { MyContext } from "src/types/MyContext";
import { Resolver, Query, Ctx } from "type-graphql";
import { User } from "../../entity/User";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!(ctx.req.session as any).userId) return undefined;

    return User.findOne((ctx.req.session as any).userId);
  }
}
