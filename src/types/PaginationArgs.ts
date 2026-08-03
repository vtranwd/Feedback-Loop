import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 10 })
  limit!: number;

  @Field(() => Int, { defaultValue: 0 })
  offset!: number;
}