import { Resolver, Query, Arg, Int } from 'type-graphql';
import { Tag } from '../entities/Tag';
import { pool } from '../db';

@Resolver(() => Tag)
export class TagResolver {
  @Query(() => [Tag])
  async topTags(
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<Tag[]> {
    try {
      console.log(`[Query] topTags - fetching top ${limit} tags`);
      const startTime = Date.now();

      // Count feedback per tag
      const result = await pool.query(
        `SELECT t.id, t.name, COUNT(ft.feedback_id) as count, t.created_at as "createdAt"
         FROM tags t
         LEFT JOIN feedback_tags ft ON t.id = ft.tag_id
         GROUP BY t.id, t.name, t.created_at
         ORDER BY count DESC
         LIMIT $1`,
        [limit]
      );

      const duration = Date.now() - startTime;
      console.log(`[Query] topTags - completed in ${duration}ms, returned ${result.rows.length} tags`);

      return result.rows;
    } catch (error) {
      console.error('[Query] topTags - ERROR:', error);
      throw new Error('Failed to fetch top tags');
    }
  }
}