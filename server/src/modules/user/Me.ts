import { MyContext } from "../../../src/types/MyContext";
import {
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
  Mutation,
  Arg,
} from "type-graphql";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async mequery(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if ((ctx.req as any).userId == null) return undefined;

    return User.findOne((ctx.req as any).userId);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => User, { nullable: true })
  async me(
    @Arg("refreshToken", { nullable: true }) refreshToken: string,
    @Arg("accessToken", { nullable: true }) accessToken: string,
    @Ctx() ctx: MyContext
  ): Promise<User | undefined> {
    console.log(refreshToken, accessToken);
    if ((ctx.req as any).userId == null) return undefined;

    return User.findOne((ctx.req as any).userId);
  }
}
