import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { Project } from '../entities/Project';
import { pool } from '../db';
import { Logger } from '../logger';

@Resolver(() => Project)
export class ProjectResolver {
  @Query(() => [Project])
  async projects(): Promise<Project[]> {
    try {
      Logger.info('[Query] projects - fetching all projects');
      const startTime = Date.now();

      const result = await pool.query(
        'SELECT id, name, location, project_type as "projectType", co2_baseline as "co2Baseline", target_co2_reduction as "targetCo2Reduction", created_at as "createdAt" FROM projects ORDER BY created_at DESC'
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM projects', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] projects - Error', error);
      throw new Error('Failed to fetch projects');
    }
  }

  @Query(() => Project, { nullable: true })
  async project(@Arg('id', () => Int) id: number): Promise<Project | null> {
    try {
      Logger.info('[Query] project - fetching project', { id });
      const startTime = Date.now();

      const result = await pool.query(
        'SELECT id, name, location, project_type as "projectType", co2_baseline as "co2Baseline", target_co2_reduction as "targetCo2Reduction", created_at as "createdAt" FROM projects WHERE id = $1',
        [id]
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM projects WHERE id', duration, result.rows.length);

      return result.rows[0] || null;
    } catch (error) {
      Logger.error('[Query] project - Error', error);
      throw new Error('Failed to fetch project');
    }
  }

  @Mutation(() => Project)
  async createProject(
    @Arg('name') name: string,
    @Arg('location', { nullable: true }) location?: string,
    @Arg('projectType', { nullable: true }) projectType?: string,
    @Arg('co2Baseline', { nullable: true }) co2Baseline?: string,
    @Arg('targetCo2Reduction', { nullable: true }) targetCo2Reduction?: string
  ): Promise<Project> {
    if (!name || name.trim().length === 0) {
      Logger.warn('[Mutation] createProject - Empty name provided');
      throw new Error('Project name cannot be empty');
    }

    try {
      Logger.info('[Mutation] createProject - Creating project', { name, projectType });
      const startTime = Date.now();

      const result = await pool.query(
        'INSERT INTO projects (name, location, project_type, co2_baseline, target_co2_reduction) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, location, project_type as "projectType", co2_baseline as "co2Baseline", target_co2_reduction as "targetCo2Reduction", created_at as "createdAt"',
        [name, location || null, projectType || null, co2Baseline || null, targetCo2Reduction || null]
      );

      const duration = Date.now() - startTime;
      const project = result.rows[0];
      Logger.query('INSERT INTO projects', duration, 1);
      Logger.info('[Mutation] createProject - Success', { id: project.id });

      return project;
    } catch (error) {
      Logger.error('[Mutation] createProject - Error', error);
      throw new Error('Failed to create project');
    }
  }
}