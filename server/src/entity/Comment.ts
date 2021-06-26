import { Field, ID, ObjectType } from "type-graphql";
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

  @Field(() => User)
  async author(): Promise<User | undefined> {
    return User.findOne(this.commentAuthorId);
  }
}