import { ObjectType, Field, Int } from 'type-graphql';
import { Feedback } from '../entities/Feedback';

@ObjectType()
export class PaginatedFeedback {
  @Field(() => [Feedback])
  items!: Feedback[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  offset!: number;

  @Field(() => Int)
  hasMore!: boolean;
}