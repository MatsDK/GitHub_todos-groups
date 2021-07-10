import { GroupUser } from "../../entity/GroupUser";
import { MyContext } from "../../types/MyContext";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Group } from "../../entity/Group";
import { isAuth } from "../middleware/isAuth";
import { Todo } from "../../entity/Todo";

@Resolver()
export class GroupUserResolver {
  @UseMiddleware(isAuth)
  @Query(() => Group, { nullable: true })
  async group(
    @Arg("groupId") groupId: number,
    // @Arg("path") _: string,
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

    // const todos = await Todo.find({
    //   where: { todoGroupId: group.id, fileName: Like(`%${path}%`) },
    // });
    const todos = await Todo.find({
      where: { todoGroupId: group.id },
    });
    group.todos = () => todos;

    return group;
  }

  @Query(() => [Group])
  groups(): Promise<Group[]> {
    return Group.find();
  }
}
