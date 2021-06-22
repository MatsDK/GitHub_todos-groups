import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  @Column({ nullable: true })
  fileName: string;
}
