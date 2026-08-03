import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number;

  @Field()
  email!: string;

  @Field()
  workspace!: string;

  @Field()
  createdAt!: Date;
}