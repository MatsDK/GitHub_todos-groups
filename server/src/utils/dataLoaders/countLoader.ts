import DataLoader from "dataloader";
import { Comment } from "../../entity/Comment";

const batchCounts = async (ids: any[][]): Promise<any[]> => {
  const [entitName, entityProp] = ids[0];

  const str: string = `(${ids.map((_: number[]) => _[2]).join(", ")})`;

  const query = `SELECT a."${entityProp}" AS "id", count(*) FROM "${entitName}" a
      WHERE a."${entityProp}" IN ${str} ${
    ids[0][3] ? `AND ${ids[0][3]}` : ""
  } GROUP BY a."${entityProp}";`;
  const data = await Comment.query(query);

  const dataMap: Map<number, number> = new Map();

  data.forEach((_: { id: number; count: string }) => {
    dataMap.set(_.id, parseInt(_.count));
  });

  return ids.map((_: number[]) => dataMap.get(_[2]) || 0);
};

export const createCountsLoader = () => new DataLoader(batchCounts as any);

const batchUserCounts = async (ids: number[]): Promise<any[]> => {
  const str: string = `(${ids.join(", ")})`;

  const query = `SELECT a."groupId" AS "id", count(*) FROM "group_user" a
      WHERE a."groupId" IN ${str} GROUP BY a."groupId";`;
  const data = await Comment.query(query);

  const dataMap: Map<number, number> = new Map();

  data.forEach((_: { id: number; count: string }) => {
    dataMap.set(_.id, parseInt(_.count));
  });

  return ids.map((_: number) => dataMap.get(_) || 0);
};

export const createUserCountsLoader = () =>
  new DataLoader(batchUserCounts as any);
