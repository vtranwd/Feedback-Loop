import { Resolver, Query, Arg, Int } from 'type-graphql';
import { Tag } from '../entities/Tag';
import { pool } from '../db';
import { Logger } from '../logger';

@Resolver(() => Tag)
export class TagResolver {
  @Query(() => [Tag])
  async topTags(
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<Tag[]> {
    // Validate input
    if (limit < 1 || limit > 100) {
      Logger.warn('[Query] topTags - Invalid limit', { limit });
      throw new Error('Limit must be between 1 and 100');
    }

    try {
      Logger.info(`[Query] topTags - Fetching top ${limit} tags`);
      const startTime = Date.now();

      const result = await pool.query(
        `SELECT t.id, t.name, COUNT(ft.feedback_id)::integer as count, t.created_at as "createdAt"
         FROM tags t
         LEFT JOIN feedback_tags ft ON t.id = ft.tag_id
         GROUP BY t.id, t.name, t.created_at
         ORDER BY count DESC
         LIMIT $1`,
        [limit]
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT topTags', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] topTags - Database error', error);
      throw new Error('Failed to fetch top tags');
    }
  }
}