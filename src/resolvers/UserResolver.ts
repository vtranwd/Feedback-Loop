import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { User } from '../entities/User';
import { pool } from '../db';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async listUsers(): Promise<User[]> {
    try {
      console.log('[Query] listUsers - fetching all users');
      const startTime = Date.now();

      const result = await pool.query(
        'SELECT id, email, workspace, created_at as "createdAt" FROM users ORDER BY created_at DESC'
      );

      const duration = Date.now() - startTime;
      console.log(`[Query] listUsers - completed in ${duration}ms, returned ${result.rows.length} rows`);

      return result.rows;
    } catch (error) {
      console.error('[Query] listUsers - ERROR:', error);
      throw new Error('Failed to fetch users');
    }
  }

  @Mutation(() => User)
  async createUser(
    @Arg('email') email: string,
    @Arg('workspace') workspace: string
  ): Promise<User> {
    try {
      console.log('[Mutation] createUser - creating user:', { email, workspace });
      const startTime = Date.now();

      const result = await pool.query(
        'INSERT INTO users (email, workspace) VALUES ($1, $2) RETURNING id, email, workspace, created_at as "createdAt"',
        [email, workspace]
      );

      const duration = Date.now() - startTime;
      const user = result.rows[0];
      console.log(`[Mutation] createUser - completed in ${duration}ms, created user id=${user.id}`);

      return user;
    } catch (error) {
      console.error('[Mutation] createUser - ERROR:', error);
      throw new Error('Failed to create user');
    }
  }
}