import { MyContext } from "src/types/MyContext";
import { Ctx, Field, Float, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column("int")
  todoId: number;

  @Field()
  @Column("int")
  commentAuthorId: number;

  @Field()
  @Column()
  timeStamp: string;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  parentCommentId: number;

  @Field(() => [Comment])
  comments(@Ctx() { nestedCommentsLoader }: MyContext): Promise<Comment[]> {
    return nestedCommentsLoader.load(this.id);
  }

  @Field(() => User)
  author(@Ctx() { authorsLoader }: MyContext): Promise<User | undefined> {
    return authorsLoader.load(this.commentAuthorId);
  }

  @Field(() => Float)
  commentsCount(@Ctx() { countsLoader }: MyContext): Promise<number> {
    return countsLoader.load([null, this.id]);
  }
}
