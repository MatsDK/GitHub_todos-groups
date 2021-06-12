import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Group } from "../../entity/Group";
import { GroupUser } from "../../entity/GroupUser";

@Resolver()
export class GroupUserResolver {
  @Mutation(() => Group)
  async createGroup(
    @Arg("name") name: string,
    @Arg("userId") userId: number
  ): Promise<Group> {
    console.log(userId);
    const group = Group.create({ name });

    await group.save();

    const user_group = GroupUser.create({ groupId: group.id, userId });
    await user_group.save();

    return group;
  }

  @Query(() => [Group])
  async groups(): Promise<Group[]> {
    return Group.find();
  }
}
