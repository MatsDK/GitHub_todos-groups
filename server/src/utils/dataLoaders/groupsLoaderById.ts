import DataLoader from "dataloader";
import { In } from "typeorm";

import { Group } from "../../entity/Group";

const batchGroupsById = async (ids: number[]): Promise<Array<Group | null>> => {
  const data = await Group.find({
    where: { id: In(ids) },
  });

  const map: Map<number, Group> = new Map();

  data.forEach((group: Group) => {
    map.set(group.id, group);
  });

  return ids.map((_: number) => map.get(_) || null);
};

export const createGroupsLoaderById = () =>
  new DataLoader(batchGroupsById as any);
