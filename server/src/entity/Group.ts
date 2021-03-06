import { MyContext } from "src/types/types";
import { Ctx, Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupUser } from "./GroupUser";
import { Todo } from "./Todo";
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
  users(@Ctx() { usersLoader }: MyContext): Promise<User[]> {
    return usersLoader.load(this.id);
  }

  @Field()
  @Column()
  repoName: string;

  @Field()
  @Column()
  repoOwner: string;

  @Field()
  @Column()
  mainBranch: string;

  @Field(() => [Todo])
  todos(): Promise<Todo[]> {
    return Todo.find({
      where: { todoGroupId: this.id },
      order: { timeStamp: "DESC" },
    });
  }

  @Field(() => Number)
  activeTodosCount(@Ctx() { countsLoader }: MyContext): Promise<Number> {
    return countsLoader.load([
      "todo",
      "todoGroupId",
      this.id,
      `a."completed" = false`,
    ]);
  }

  @Field(() => Number)
  usersCount(@Ctx() { usersCountLoader }: MyContext): Promise<Number> {
    return usersCountLoader.load(this.id);
  }
}
