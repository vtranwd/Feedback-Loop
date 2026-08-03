import { Resolver, Mutation, Arg, ObjectType, Field } from 'type-graphql';
import { pool } from '../db';
import { Logger } from '../logger';
import { generateToken } from '../auth';

@ObjectType()
export class AuthPayload {
  @Field()
  token!: string;

  @Field(() => String)
  userId!: string;

  @Field()
  email!: string;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthPayload)
  async login(
    @Arg('email') email: string,
    @Arg('workspace') workspace: string
  ): Promise<AuthPayload> {
    // Validate input
    if (!email || !email.includes('@')) {
      Logger.warn('[Mutation] login - Invalid email', { email });
      throw new Error('Invalid email address');
    }

    try {
      Logger.info('[Mutation] login - User login attempt', { email });

      // Check if user exists
      let result = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      let userId: number;

      if (result.rows.length === 0) {
        // Create user if doesn't exist
        Logger.info('[Mutation] login - Creating new user', { email, workspace });
        const createResult = await pool.query(
          'INSERT INTO users (email, workspace) VALUES ($1, $2) RETURNING id',
          [email, workspace]
        );
        userId = createResult.rows[0].id;
      } else {
        userId = result.rows[0].id;
      }

      // Generate token
      const token = generateToken(userId, email);

      Logger.info('[Mutation] login - Success', { userId, email });

      return {
        token,
        userId: String(userId),
        email,
      };
    } catch (error) {
      Logger.error('[Mutation] login - Error', error);
      throw new Error('Login failed');
    }
  }
}