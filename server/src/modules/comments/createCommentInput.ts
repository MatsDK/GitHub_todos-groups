import { Length } from "class-validator";
import { Field, Float, InputType } from "type-graphql";

@InputType()
export class CreateCommentInput {
  @Field()
  @Length(1, 255)
  text: string;

  @Field(() => Float)
  todoId: number;
}
