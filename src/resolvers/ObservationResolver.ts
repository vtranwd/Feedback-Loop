import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { Observation } from '../entities/Observation';
import { pool } from '../db';
import { Logger } from '../logger';

@Resolver(() => Observation)
export class ObservationResolver {
  @Query(() => [Observation])
  async observationsByProject(
    @Arg('projectId', () => Int) projectId: number,
    @Arg('observationType', { nullable: true }) observationType?: string
  ): Promise<Observation[]> {
    try {
      Logger.info('[Query] observationsByProject - fetching observations', { projectId, observationType });
      const startTime = Date.now();

      let query = 'SELECT id, project_id as "projectId", observation_type as "observationType", value, unit, latitude, longitude, notes, recorded_by as "recordedBy", recorded_at as "recordedAt" FROM observations WHERE project_id = $1';
      const params: any[] = [projectId];

      if (observationType) {
        query += ' AND observation_type = $2';
        params.push(observationType);
      }

      query += ' ORDER BY recorded_at DESC';

      const result = await pool.query(query, params);

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM observations', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] observationsByProject - Error', error);
      throw new Error('Failed to fetch observations');
    }
  }

  @Mutation(() => Observation)
  async createObservation(
    @Arg('projectId', () => Int) projectId: number,
    @Arg('observationType') observationType: string,
    @Arg('value', { nullable: true }) value?: string,
    @Arg('unit', { nullable: true }) unit?: string,
    @Arg('latitude', { nullable: true }) latitude?: string,
    @Arg('longitude', { nullable: true }) longitude?: string,
    @Arg('notes', { nullable: true }) notes?: string,
    @Arg('recordedBy', () => Int, { nullable: true }) recordedBy?: number
  ): Promise<Observation> {
    if (!observationType || observationType.trim().length === 0) {
      Logger.warn('[Mutation] createObservation - Empty observation type');
      throw new Error('Observation type cannot be empty');
    }

    try {
      Logger.info('[Mutation] createObservation - Creating observation', { projectId, observationType });
      const startTime = Date.now();

      const result = await pool.query(
        'INSERT INTO observations (project_id, observation_type, value, unit, latitude, longitude, notes, recorded_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, project_id as "projectId", observation_type as "observationType", value, unit, latitude, longitude, notes, recorded_by as "recordedBy", recorded_at as "recordedAt"',
        [projectId, observationType, value || null, unit || null, latitude || null, longitude || null, notes || null, recordedBy || null]
      );

      const duration = Date.now() - startTime;
      const observation = result.rows[0];
      Logger.query('INSERT INTO observations', duration, 1);
      Logger.info('[Mutation] createObservation - Success', { id: observation.id });

      return observation;
    } catch (error) {
      Logger.error('[Mutation] createObservation - Error', error);
      throw new Error('Failed to create observation');
    }
  }
}