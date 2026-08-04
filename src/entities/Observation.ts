import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Observation {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  projectId!: number;

  @Field()
  observationType!: string;

  @Field(() => String, { nullable: true })
  value?: string;

  @Field({ nullable: true })
  unit?: string;

  @Field(() => String, { nullable: true })
  latitude?: string;

  @Field(() => String, { nullable: true })
  longitude?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => Int, { nullable: true })
  recordedBy?: number;

  @Field()
  recordedAt!: Date;
}