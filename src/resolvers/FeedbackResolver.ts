import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Feedback } from '../entities/Feedback';
import { pool } from '../db';
import { Logger } from '../logger';

@Resolver(() => Feedback)
export class FeedbackResolver {
  @Query(() => [Feedback])
  async listFeedback(): Promise<Feedback[]> {
    try {
      Logger.info('[Query] listFeedback - fetching all feedback');
      const startTime = Date.now();

      const result = await pool.query(
        'SELECT id, text, source, created_at as "createdAt" FROM feedback ORDER BY created_at DESC'
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM feedback', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] listFeedback - Database error', error);
      throw new Error('Failed to fetch feedback from database');
    }
  }

  @Mutation(() => Feedback)
  async createFeedback(
    @Arg('text') text: string,
    @Arg('source', { nullable: true }) source?: string
  ): Promise<Feedback> {
    // Validate input
    if (!text || text.trim().length === 0) {
      Logger.warn('[Mutation] createFeedback - Empty text provided');
      throw new Error('Feedback text cannot be empty');
    }

    if (text.length > 1000) {
      Logger.warn('[Mutation] createFeedback - Text too long', { length: text.length });
      throw new Error('Feedback text cannot exceed 1000 characters');
    }

    try {
      Logger.info('[Mutation] createFeedback - Creating feedback', { textLength: text.length, source });
      const startTime = Date.now();

      const result = await pool.query(
        'INSERT INTO feedback (text, source) VALUES ($1, $2) RETURNING id, text, source, created_at as "createdAt"',
        [text, source]
      );

      const duration = Date.now() - startTime;
      const feedback = result.rows[0];
      Logger.query('INSERT INTO feedback', duration, 1);
      Logger.info(`[Mutation] createFeedback - Success`, { id: feedback.id });

      return feedback;
    } catch (error) {
      Logger.error('[Mutation] createFeedback - Database error', error);
      throw new Error('Failed to create feedback in database');
    }
  }
}