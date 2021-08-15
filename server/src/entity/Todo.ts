import { Ctx, Field, Float, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { MyContext } from "src/types/types";
import { Group } from "./Group";

@ObjectType()
@Entity()
export class Todo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  todoTitle: string;

  @Field()
  @Column()
  todoBody: string;

  @Field()
  @Column("int")
  todoGroupId: number;

  @Field()
  @Column("int")
  todoAuthorId: number;

  @Field()
  @Column()
  timeStamp: string;

  @Field()
  @Column({ default: "" })
  fileName: string;

  @Field(() => Boolean)
  @Column("bool", { default: false })
  completed: boolean;

  @Field(() => Number, { nullable: true })
  @Column("int", { nullable: true })
  userId: number | null;

  @Field(() => User, { nullable: true })
  user(): Promise<User | undefined> {
    return User.findOne({ where: { id: this.userId } });
  }

  @Field(() => Group, { nullable: true })
  group(@Ctx() { groupsLoaderById }: MyContext): Promise<Group> {
    return groupsLoaderById.load(this.todoGroupId);
  }

  @Field({ nullable: true })
  @Column("int", { nullable: true })
  startLineNumber: number;

  @Field({ nullable: true })
  @Column("int", { nullable: true })
  endLineNumber: number;

  @Field(() => User, { nullable: true })
  author(@Ctx() { authorsLoader }: MyContext): Promise<User> {
    return authorsLoader.load(this.todoAuthorId);
  }

  @Field(() => [Comment])
  comments(@Ctx() { commentsLoader }: MyContext): Promise<Comment[]> {
    return commentsLoader.load(this.id);
  }

  @Field(() => Float)
  commentsCount(@Ctx() { countsLoader }: MyContext): Promise<number> {
    return countsLoader.load([this.id, null]);
  }
}
