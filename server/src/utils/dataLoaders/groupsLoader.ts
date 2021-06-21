import DataLoader from "dataloader";
import { Group } from "src/entity/Group";
import { In } from "typeorm";
import { GroupUser } from "../../entity/GroupUser";

const batchGroups = async (ids: number[]): Promise<Array<Group[]>> => {
  const whereQuery = {
    userId: In(ids),
  };

  const data = await GroupUser.find({
    join: {
      alias: "GroupUser",
      leftJoinAndSelect: {
        group: "GroupUser.group",
      },
    },
    where: whereQuery,
  });

  const map: Map<number, Group[]> = new Map();

  data.forEach((_) => {
    if (map.has(_.userId))
      map.set(_.userId, [...(map.get(_.userId) || []), (_ as any).__group__]);
    else map.set(_.userId, [(_ as any).__group__]);
  });

  return ids.map((_: number) => map.get(_) || []);
};

export const createGroupsLoader = () => new DataLoader(batchGroups as any);
