import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class GroupUser extends BaseEntity {
  @PrimaryColumn("int", { unique: false })
  userId: number;

  @PrimaryColumn("int", { unique: false })
  groupId: number;

  @Column("bool", { nullable: true, default: false })
  isOwner: boolean;

  @ManyToOne(() => User, (user) => user.groupConnection, { primary: true })
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @ManyToOne(() => Group, (group) => group.userConnection, { primary: true })
  @JoinColumn({ name: "groupId" })
  group: Promise<Group>;
}
