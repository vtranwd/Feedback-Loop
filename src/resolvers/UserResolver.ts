import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../entities/User';
import { pool } from '../db';
import { Logger } from '../logger';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async listUsers(): Promise<User[]> {
    try {
      Logger.info('[Query] listUsers - fetching all users');
      const startTime = Date.now();

      const result = await pool.query(
        'SELECT id, email, workspace, created_at as "createdAt" FROM users ORDER BY created_at DESC'
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM users', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] listUsers - Database error', error);
      throw new Error('Failed to fetch users');
    }
  }

  @Mutation(() => User)
  async createUser(
    @Arg('email') email: string,
    @Arg('workspace') workspace: string
  ): Promise<User> {
    // Validate input
    if (!email || !email.includes('@')) {
      Logger.warn('[Mutation] createUser - Invalid email', { email });
      throw new Error('Invalid email address');
    }

    if (!workspace || workspace.trim().length === 0) {
      Logger.warn('[Mutation] createUser - Empty workspace');
      throw new Error('Workspace cannot be empty');
    }

    try {
      Logger.info('[Mutation] createUser - Creating user', { email, workspace });
      const startTime = Date.now();

      const result = await pool.query(
        'INSERT INTO users (email, workspace) VALUES ($1, $2) RETURNING id, email, workspace, created_at as "createdAt"',
        [email, workspace]
      );

      const duration = Date.now() - startTime;
      const user = result.rows[0];
      Logger.query('INSERT INTO users', duration, 1);
      Logger.info(`[Mutation] createUser - Success`, { id: user.id, email });

      return user;
    } catch (error) {
      if ((error as any).code === '23505') {
        // Unique constraint violation
        Logger.warn('[Mutation] createUser - Email already exists', { email });
        throw new Error('This email is already registered');
      }
      Logger.error('[Mutation] createUser - Database error', error);
      throw new Error('Failed to create user');
    }
  }
}