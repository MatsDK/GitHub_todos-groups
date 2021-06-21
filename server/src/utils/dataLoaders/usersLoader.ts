import DataLoader from "dataloader";
import { In } from "typeorm";
import { GroupUser } from "../../entity/GroupUser";
import { User } from "../../entity/User";

const batchUsers = async (ids: number[]): Promise<Array<User[]>> => {
  const whereQuery = {
    groupId: In(ids),
  };

  const data = await GroupUser.find({
    join: {
      alias: "GroupUser",
      leftJoinAndSelect: {
        user: "GroupUser.user",
      },
    },
    where: whereQuery,
  });

  const map: Map<number, User[]> = new Map();

  data.forEach((_) => {
    if (map.has(_.groupId))
      map.set(_.groupId, [...(map.get(_.groupId) || []), (_ as any).__user__]);
    else map.set(_.groupId, [(_ as any).__user__]);
  });

  return ids.map((_: number) => map.get(_) || []);
};

export const createUsersLoader = () => new DataLoader(batchUsers as any);
