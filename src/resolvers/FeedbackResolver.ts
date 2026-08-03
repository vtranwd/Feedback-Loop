import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Feedback } from '../entities/Feedback';
import { pool } from '../db';

@Resolver(() => Feedback)
export class FeedbackResolver {
  @Query(() => [Feedback])
  async listFeedback(): Promise<Feedback[]> {
    try {
      console.log('[Query] listFeedback - fetching all feedback');
      const startTime = Date.now();
      
      const result = await pool.query(
        'SELECT id, text, source, created_at as "createdAt" FROM feedback ORDER BY created_at DESC'
      );
      
      const duration = Date.now() - startTime;
      console.log(`[Query] listFeedback - completed in ${duration}ms, returned ${result.rows.length} rows`);
      
      return result.rows;
    } catch (error) {
      console.error('[Query] listFeedback - ERROR:', error);
      throw new Error('Failed to fetch feedback from database');
    }
  }

  @Mutation(() => Feedback)
  async createFeedback(
    @Arg('text') text: string,
    @Arg('source', { nullable: true }) source?: string
  ): Promise<Feedback> {
    try {
      console.log('[Mutation] createFeedback - creating feedback:', { text, source });
      const startTime = Date.now();
      
      const result = await pool.query(
        'INSERT INTO feedback (text, source) VALUES ($1, $2) RETURNING id, text, source, created_at as "createdAt"',
        [text, source]
      );
      
      const duration = Date.now() - startTime;
      const feedback = result.rows[0];
      console.log(`[Mutation] createFeedback - completed in ${duration}ms, created feedback id=${feedback.id}`);
      
      return feedback;
    } catch (error) {
      console.error('[Mutation] createFeedback - ERROR:', error);
      throw new Error('Failed to create feedback in database');
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