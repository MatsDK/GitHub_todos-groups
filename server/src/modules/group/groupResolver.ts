import { GroupUser } from "../../entity/GroupUser";
import { MyContext } from "../../types/MyContext";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Group } from "../../entity/Group";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class GroupUserResolver {
  @UseMiddleware(isAuth)
  @Query(() => Group, { nullable: true })
  async group(
    @Arg("groupId") groupId: number,
    @Ctx() ctx: MyContext
  ): Promise<Group | undefined> {
    const group = await Group.findOne(groupId);
    if (!group) return undefined;

    if (
      !(await GroupUser.findOne({
        where: { groupId, userId: (ctx.req as any).userId },
      }))
    )
      return undefined;

    return group;
  }

  @Query(() => [Group])
  async groups(): Promise<Group[]> {
    return Group.find();
  }
}
