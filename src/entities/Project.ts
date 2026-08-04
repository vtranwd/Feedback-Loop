import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Project {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  projectType?: string;

  @Field(() => String, { nullable: true })
  co2Baseline?: string;

  @Field(() => String, { nullable: true })
  targetCo2Reduction?: string;

  @Field()
  createdAt!: Date;
}