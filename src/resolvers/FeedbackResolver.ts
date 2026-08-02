import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Feedback } from '../entities/Feedback';
import { pool } from '../db';

@Resolver(() => Feedback)
export class FeedbackResolver {
  @Query(() => [Feedback])
  async listFeedback(): Promise<Feedback[]> {
    try {
      const result = await pool.query(
        'SELECT id, text, source, created_at as "createdAt" FROM feedback ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error('Failed to fetch feedback');
    }
  }

  @Mutation(() => Feedback)
  async createFeedback(
    @Arg('text') text: string,
    @Arg('source', { nullable: true }) source?: string
  ): Promise<Feedback> {
    try {
      const result = await pool.query(
        'INSERT INTO feedback (text, source) VALUES ($1, $2) RETURNING id, text, source, created_at as "createdAt"',
        [text, source]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw new Error('Failed to create feedback');
    }
  }
}

// ---- OLD code below ----
// import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
// import { Feedback } from '../entities/Feedback';

// // Mock data for now (we'll connect to DB next)
// const feedbackData: Feedback[] = [
//   {
//     id: 1,
//     text: 'API is too slow',
//     source: 'slack',
//     createdAt: new Date(),
//   },
// ];

// @Resolver(() => Feedback)
// export class FeedbackResolver {
//   @Query(() => [Feedback])
//   async listFeedback(): Promise<Feedback[]> {
//     return feedbackData;
//   }

//   @Mutation(() => Feedback)
//   async createFeedback(
//     @Arg('text') text: string,
//     @Arg('source', { nullable: true }) source?: string
//   ): Promise<Feedback> {
//     const id = feedbackData.length + 1;
//     const feedback: Feedback = {
//       id,
//       text,
//       source,
//       createdAt: new Date(),
//     };
//     feedbackData.push(feedback);
//     return feedback;
//   }
// }