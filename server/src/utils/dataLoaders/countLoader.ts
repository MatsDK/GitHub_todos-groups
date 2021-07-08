// import DataLoader from "dataloader";
// import { Comment } from "../../entity/Comment";

// const batchCounts = async (ids: number[]): Promise<any[]> => {
//   let str: string = "(";
//   ids.forEach(
//     (_: number, idx) => (str += `${_} ${idx == ids.length - 1 ? "" : ", "} `)
//   );
//   str += ")";

//   const data = await Comment.query(
//     `SELECT a.id, count(*) FROM "todo" a JOIN "comment" d ON a.id=d."todoId"
//     WHERE a.id IN ${str}GROUP BY a.id;`
//   );
//   const dataMap: Map<number, number> = new Map();

//   data.forEach((_: { id: number; count: string }) => {
//     dataMap.set(_.id, parseInt(_.count));
//   });

//   return ids.map((_: number) => dataMap.get(_) || 0);
// };

// export const createCountsLoader = () => new DataLoader(batchCounts as any);

// SELECT a."parentCommentId", count(*)
//  FROM "comment" a
//  WHERE a."parentCommentId" = 5
//  GROUP BY a."parentCommentId";
import DataLoader from "dataloader";
import { Comment } from "../../entity/Comment";

const batchCounts = async (ids: number[][]): Promise<any[]> => {
  let id = 0;
  if (ids[0][0] == null) id = 1;

  let str: string = "(";
  ids.forEach(
    (_: number[], idx) =>
      (str += `${_[id]} ${idx == ids.length - 1 ? "" : ", "} `)
  );
  str += ")";

  let data: any[] = [];

  if (id)
    data =
      await Comment.query(`SELECT a."parentCommentId" AS "id", count(*) FROM "comment" a
      WHERE a."parentCommentId" IN ${str} GROUP BY a."parentCommentId";`);
  else
    data = await Comment.query(`SELECT a.id, count(*) FROM "todo" a 
      JOIN "comment" d ON a.id=d."todoId" WHERE ${
        id ? "a.id" : 'd."parentCommentId"'
      } IN ${str} GROUP BY a.id;`);

  const dataMap: Map<number, number> = new Map();

  data.forEach((_: { id: number; count: string }) => {
    dataMap.set(_.id, parseInt(_.count));
  });

  return ids.map((_: number[]) => dataMap.get(_[id]) || 0);
};

export const createCountsLoader = () => new DataLoader(batchCounts as any);
