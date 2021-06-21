import DataLoader from "dataloader";
import { getConnection } from "typeorm";
import { Invite } from "../../entity/Invite";
import { Group } from "../../entity/Group";

const batchInvites = async (ids: number[]): Promise<Array<Group[]>> => {
  const data = await getConnection()
    .getRepository(Invite)
    .createQueryBuilder("invite")
    .where("invite.user_target IN(:...ids)", { ids: ids || [] })
    .getMany();

  let groups: Group[] = [],
    inviteGroupIds = data.map((_: Invite) => _.group_id);

  if (inviteGroupIds.length)
    groups = await getConnection()
      .getRepository(Group)
      .createQueryBuilder("group")
      .leftJoinAndSelect("invite", "invite", "invite.group_id = group.id")
      .where("invite.user_target IN(:...ids)", { ids: ids || [] })
      .where("group.id IN(:...ids)", {
        ids: inviteGroupIds,
      })
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

  const ret: Array<Group[]> = [];
  ids.forEach((_: number, idx: number) => {
    ret[idx] = map.get(_) || [];
  });

  return ret;
};

export const createInvitesLoader = () => new DataLoader(batchInvites as any);
