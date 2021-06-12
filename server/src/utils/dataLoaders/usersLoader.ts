import DataLoader from "dataloader";
import { In } from "typeorm";
import { GroupUser } from "../../entity/GroupUser";
import { User } from "../../entity/User";

const batchUsers = async (ids: number[]) => {
  const whereQuery = {
    groupId: In(ids),
  };

  const data = await GroupUser.find({
    join: {
      alias: "GroupUser",
      innerJoinAndSelect: {
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

  return new Array(ids.length)
    .fill([])
    .map((_: any[], idx: number) => Array.from(map.values())[idx] || []);
};

export const createUsersLoader = () => new DataLoader(batchUsers as any);
