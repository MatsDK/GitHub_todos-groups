import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { Group } from "../../entity/Group";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class GroupUserResolver {
  @UseMiddleware(isAuth)
  @Query(() => Group, { nullable: true })
  async group(@Arg("groupId") groupId: number): Promise<Group | undefined> {
    return Group.findOne(groupId);
  }

  @Query(() => [Group])
  async groups(): Promise<Group[]> {
    return Group.find();
  }
}
