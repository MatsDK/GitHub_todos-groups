import DataLoader from "dataloader";
import { Comment } from "../../entity/Comment";
import { In } from "typeorm";

const batchComments = async (ids: number[]) => {
  const data = await Comment.find({
    where: { todoId: In(ids), parentCommentId: null },
  });

  const map: Map<number, Comment[]> = new Map();

  data.forEach((comment: Comment) => {
    if (map.has(comment.todoId))
      map.set(comment.todoId, [...(map.get(comment.todoId) || []), comment]);
    else map.set(comment.todoId, [comment]);
  });

  return ids.map((_: number) => map.get(_) || []);
};

export const createCommentsLoader = () => new DataLoader(batchComments as any);

const batchNestedComments = async (ids: number[]) => {
  const data = await Comment.find({
    where: { parentCommentId: In(ids) },
  });

  const map: Map<number, Comment[]> = new Map();

  data.forEach((comment: Comment) => {
    if (map.has(comment.parentCommentId))
      map.set(comment.parentCommentId, [
        ...(map.get(comment.parentCommentId) || []),
        comment,
      ]);
    else map.set(comment.parentCommentId, [comment]);
  });

  return ids.map((_: number) => map.get(_) || []);
};

export const createNestedCommentsLoader = () =>
  new DataLoader(batchNestedComments as any);
