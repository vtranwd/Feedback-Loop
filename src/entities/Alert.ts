import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Alert {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  projectId!: number;

  @Field()
  alertType!: string;

  @Field()
  severity!: string;

  @Field()
  description!: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;

  @Field({ nullable: true })
  resolvedAt?: Date;
}