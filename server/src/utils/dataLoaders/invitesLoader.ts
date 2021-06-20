import DataLoader from "dataloader";
import { getConnection } from "typeorm";
import { Invite } from "../../entity/Invite";
import { Group } from "../../entity/Group";

const batchInvites = async (ids: number[]) => {
  const data = await getConnection()
    .getRepository(Invite)
    .createQueryBuilder("invite")
    .where("invite.user_target IN(:...ids)", { ids })
    .getMany();

  const groups = await getConnection()
    .getRepository(Group)
    .createQueryBuilder("group")
    .leftJoinAndSelect("invite", "invite", "invite.group_id = group.id")
    .where("invite.user_target IN(:...ids)", { ids })
    .where("group.id IN(:...ids)", { ids: data.map((_: Invite) => _.group_id) })
    .getMany();

  const map: Map<number, Group[]> = new Map();

  data.forEach((invite: Invite) => {
    const newGroup = groups.find((_: any) => _.id == invite.group_id);
    if (!newGroup) return;

    if (map.has(invite.user_target))
      map.set(invite.user_target, [
        ...(map.get(invite.user_target) || []),
        newGroup,
      ]);
    else map.set(invite.user_target, [newGroup]);
  });

  return new Array(ids.length)
    .fill([])
    .map((_: any[], idx: number) => Array.from(map.values())[idx] || []);
};

export const createInvitesLoader = () => new DataLoader(batchInvites as any);
