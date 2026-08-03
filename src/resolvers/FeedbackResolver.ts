import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { Feedback } from '../entities/Feedback';
import { PaginatedFeedback } from '../types/PaginatedFeedback';
import { PaginationArgs } from '../types/PaginationArgs';
import { pool } from '../db';
import { Logger } from '../logger';

@Resolver(() => Feedback)
export class FeedbackResolver {
  @Query(() => PaginatedFeedback)
  async listFeedback(
    @Arg('pagination', () => PaginationArgs, { nullable: true }) pagination?: PaginationArgs
  ): Promise<PaginatedFeedback> {
    const limit = pagination?.limit || 10;
    const offset = pagination?.offset || 0;

    // Validate pagination
    if (limit < 1 || limit > 100) {
      Logger.warn('[Query] listFeedback - Invalid limit', { limit });
      throw new Error('Limit must be between 1 and 100');
    }

    if (offset < 0) {
      Logger.warn('[Query] listFeedback - Invalid offset', { offset });
      throw new Error('Offset cannot be negative');
    }

    try {
      Logger.info('[Query] listFeedback - Fetching feedback', { limit, offset });
      const startTime = Date.now();

      // Get total count
      const countResult = await pool.query('SELECT COUNT(*) as count FROM feedback');
      const total = parseInt(countResult.rows[0].count);

      // Get paginated results
      const result = await pool.query(
        'SELECT id, text, source, created_at as "createdAt" FROM feedback ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM feedback (paginated)', duration, result.rows.length);

      return {
        items: result.rows,
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      Logger.error('[Query] listFeedback - Database error', error);
      throw new Error('Failed to fetch feedback from database');
    }
  }

  @Query(() => [Feedback])
  async feedbackByUser(
    @Arg('userId', () => Int) userId: number
  ): Promise<Feedback[]> {
    if (userId < 1) {
      Logger.warn('[Query] feedbackByUser - Invalid userId', { userId });
      throw new Error('User ID must be positive');
    }

    try {
      Logger.info('[Query] feedbackByUser - Fetching feedback for user', { userId });
      const startTime = Date.now();

      const result = await pool.query(
        'SELECT id, text, source, created_at as "createdAt" FROM feedback WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM feedback WHERE user_id', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] feedbackByUser - Database error', error);
      throw new Error('Failed to fetch user feedback');
    }
  }

  @Query(() => [Feedback])
  async recentFeedback(
    @Arg('days', () => Int, { defaultValue: 7 }) days: number
  ): Promise<Feedback[]> {
    if (days < 1 || days > 365) {
      Logger.warn('[Query] recentFeedback - Invalid days', { days });
      throw new Error('Days must be between 1 and 365');
    }

    try {
      Logger.info('[Query] recentFeedback - Fetching feedback from last', { days });
      const startTime = Date.now();

      const result = await pool.query(
        `SELECT id, text, source, created_at as "createdAt" FROM feedback 
         WHERE created_at >= NOW() - INTERVAL '1 day' * $1 
         ORDER BY created_at DESC`,
        [days]
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM feedback (recent)', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] recentFeedback - Database error', error);
      throw new Error('Failed to fetch recent feedback');
    }
  }

  @Mutation(() => Feedback)
  async createFeedback(
    @Arg('text') text: string,
    @Arg('source', { nullable: true }) source?: string,
    @Arg('userId', () => Int, { nullable: true }) userId?: number
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
      Logger.info('[Mutation] createFeedback - Creating feedback', { textLength: text.length, source, userId });
      const startTime = Date.now();

      const result = await pool.query(
        'INSERT INTO feedback (text, source, user_id) VALUES ($1, $2, $3) RETURNING id, text, source, created_at as "createdAt"',
        [text, source, userId || null]
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