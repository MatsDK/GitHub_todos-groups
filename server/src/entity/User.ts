import { MyContext } from "src/types/types";
import { Ctx, Field, ID, ObjectType, Root } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Group } from "./Group";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  pictureUrl: string;

  @Column("int", { nullable: true, default: 0 })
  count: number;

  @OneToMany(() => Group, (group) => group.users)
  groupConnection: Promise<Group[]>;

  @Field(() => [Group])
  groups(@Ctx() { groupsLoader }: MyContext): Promise<Group[]> {
    return groupsLoader.load(this.id);
  }

  @Field(() => [Group])
  invites(@Ctx() { invitesLoader }: MyContext): Promise<Group[]> {
    return invitesLoader.load(this.id);
  }

  @Field({ nullable: true })
  isOwner: boolean;
}
