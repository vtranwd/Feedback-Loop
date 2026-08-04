import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class ImpactMetric {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  projectId!: number;

  @Field()
  metricType!: string;

  @Field(() => String, { nullable: true })
  value?: string;

  @Field({ nullable: true })
  unit?: string;

  @Field()
  calculatedAt!: Date;
}