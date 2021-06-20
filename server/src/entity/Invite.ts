import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Invite extends BaseEntity {
  @Field()
  @PrimaryColumn("int")
  user_target: number;

  @Field()
  @PrimaryColumn("int")
  group_id: number;
}
