import { MyContext } from "src/types/MyContext";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Group } from "../../entity/Group";
import { GroupUser } from "../../entity/GroupUser";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class GroupUserResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Group)
  async createGroup(
    @Arg("name") name: string,
    @Arg("repoName") repoName: string,
    @Arg("mainBranch") mainBranch: string,
    @Arg("userId") userId: number
  ): Promise<Group> {
    const group = Group.create({ name, repoName, mainBranch });

    await group.save();

    const user_group = GroupUser.create({ groupId: group.id, userId });
    await user_group.save();

    return group;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async joinGroup(@Ctx() ctx: MyContext, @Arg("groupId") groupId: number) {
    try {
      if ((ctx.req as any).userId == null) return false;
      await GroupUser.create({
        groupId,
        userId: (ctx.req as any).userId,
      }).save();

      return true;
    } catch (err) {
      return false;
    }
  }
}
