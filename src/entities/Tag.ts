import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Tag {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field(() => Int)
  count!: number;

  @Field()
  createdAt!: Date;
}