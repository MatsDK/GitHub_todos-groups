import { Ctx, Field, Float, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { MyContext } from "src/types/types";

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
