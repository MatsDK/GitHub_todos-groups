import DataLoader from "dataloader";
import { User } from "../../entity/User";
import { In } from "typeorm";

const batchAuthors = async (ids: number[]) => {
  const data = await User.find({ where: { id: In(ids) } });

  return ids.map((_: number) => data.find((x) => x.id == _));
};

export const createAuthorsLoader = () => new DataLoader(batchAuthors as any);
