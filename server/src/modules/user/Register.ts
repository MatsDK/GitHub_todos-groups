import { hash } from "bcryptjs";
import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("data") { password, ...rest }: RegisterInput
  ): Promise<User> {
    console.log(rest);
    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      password: hashedPassword,
      ...rest,
    }).save();

    return user;
  }
}
