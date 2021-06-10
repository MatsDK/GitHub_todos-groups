import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { compare } from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";
import { sign } from "jsonwebtoken";

const MAX_AGE_REFRESH_TOKEN: number = 1000 * 60 * 60 * 24 * 7,
  MAX_AGE_ACCESS_TOKeN: number = 1000 * 60 * 15;

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const valid = await compare(password, user.password);
    if (!valid) return null;

    const refreshToken = sign(
      { userId: user.id, count: user.count },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    const accessToken = sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    ctx.res.cookie("refresh-token", refreshToken, {
      maxAge: MAX_AGE_REFRESH_TOKEN,
    });
    ctx.res.cookie("access-token", accessToken, {
      maxAge: MAX_AGE_ACCESS_TOKeN,
    });

    return user;
  }
}
