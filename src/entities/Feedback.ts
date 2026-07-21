import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Feedback {
  @Field(() => Int)
  id!: number;

  @Field()
  text!: string;

  @Field({ nullable: true })
  source?: string;

  @Field()
  createdAt!: Date;
}