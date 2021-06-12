import { MyContext } from "src/types/MyContext";
import { Ctx, Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupUser } from "./GroupUser";
import { User } from "./User";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @OneToMany(() => GroupUser, (gu) => gu.group)
  userConnection: Promise<GroupUser[]>;

  @Field(() => [User])
  async users(@Ctx() { usersLoader }: MyContext): Promise<User[]> {
    return usersLoader.load(this.id);
  }
}
