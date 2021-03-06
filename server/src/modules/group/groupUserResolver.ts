import { Invite } from "../../entity/Invite";
import { MyContext } from "../../types/types";
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Group } from "../../entity/Group";
import { GroupUser } from "../../entity/GroupUser";
import { isAuth } from "../middleware/isAuth";
import { User } from "../../entity/User";

@Resolver()
export class GroupUserResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Group)
  async createGroup(
    @Arg("name") name: string,
    @Arg("repoName") repoName: string,
    @Arg("mainBranch") mainBranch: string,
    @Arg("userId") userId: number,
    @Arg("repoOwner") repoOwner: string
  ): Promise<Group> {
    const group = Group.create({ name, repoName, mainBranch, repoOwner });

    await group.save();

    const user_group = GroupUser.create({
      groupId: group.id,
      userId,
      isOwner: true,
    });
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
      })
        .save()
        .catch(() => {
          console.log("already in group");
        });

      await Invite.delete({
        group_id: groupId,
        user_target: (ctx.req as any).userId,
      });

      return true;
    } catch (err) {
      return false;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async inviteUser(
    @Arg("groupId", () => Int) groupId: number,
    @Arg("userEmail") userEmail: string
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) return false;

    await Invite.create({ group_id: groupId, user_target: user.id }).save();

    return true;
  }
}
