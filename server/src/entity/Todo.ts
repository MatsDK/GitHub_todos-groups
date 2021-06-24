import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

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

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.todos, {
    primary: true,
  })
  @JoinColumn({ name: "todoAuthorId" })
  author: Promise<User>;
}
