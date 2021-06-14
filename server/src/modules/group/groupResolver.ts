import { MyContext } from "src/types/MyContext";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Group } from "../../entity/Group";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class GroupUserResolver {
  @Query(() => Group, { nullable: true })
  async group(@Arg("groupId") groupId: number): Promise<Group | undefined> {
    return Group.findOne(groupId);
  }

  @Query(() => [Group])
  async groups(): Promise<Group[]> {
    return Group.find();
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  joinGroup(@Ctx() ctx: MyContext, @Arg("groupId") groupId: number) {
    console.log(groupId, (ctx.req as any).userId);
    return true;
  }
}
