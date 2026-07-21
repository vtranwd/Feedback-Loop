import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { Feedback } from '../entities/Feedback';

// Mock data for now (we'll connect to DB next)
const feedbackData: Feedback[] = [
  {
    id: 1,
    text: 'API is too slow',
    source: 'slack',
    createdAt: new Date(),
  },
];

@Resolver(() => Feedback)
export class FeedbackResolver {
  @Query(() => [Feedback])
  async listFeedback(): Promise<Feedback[]> {
    return feedbackData;
  }

  @Mutation(() => Feedback)
  async createFeedback(
    @Arg('text') text: string,
    @Arg('source', { nullable: true }) source?: string
  ): Promise<Feedback> {
    const id = feedbackData.length + 1;
    const feedback: Feedback = {
      id,
      text,
      source,
      createdAt: new Date(),
    };
    feedbackData.push(feedback);
    return feedback;
  }
}