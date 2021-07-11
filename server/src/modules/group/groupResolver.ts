import { GroupUser } from "../../entity/GroupUser";
import { MyContext } from "../../types/types";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Group } from "../../entity/Group";
import { isAuth } from "../middleware/isAuth";
// import { Todo } from "../../entity/Todo";

@Resolver()
export class GroupUserResolver {
  @UseMiddleware(isAuth)
  @Query(() => Group, { nullable: true })
  async group(
    @Arg("groupId") groupId: number,
    @Ctx() ctx: MyContext
  ): Promise<Group | undefined> {
    if (
      !(await GroupUser.findOne({
        where: { groupId, userId: (ctx.req as any).userId },
      }))
    )
      return undefined;

    const group = await Group.findOne(groupId);
    if (!group) return undefined;
    return group;
  }

  @Query(() => [Group])
  groups(): Promise<Group[]> {
    return Group.find();
  }
}
