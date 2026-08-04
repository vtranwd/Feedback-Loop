import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { ImpactMetric } from '../entities/ImpactMetric';
import { pool } from '../db';
import { Logger } from '../logger';

@Resolver(() => ImpactMetric)
export class ImpactMetricResolver {
  @Query(() => [ImpactMetric])
  async impactMetricsByProject(
    @Arg('projectId', () => Int) projectId: number
  ): Promise<ImpactMetric[]> {
    try {
      Logger.info('[Query] impactMetricsByProject - fetching metrics', { projectId });
      const startTime = Date.now();

      const result = await pool.query(
        'SELECT id, project_id as "projectId", metric_type as "metricType", value, unit, calculated_at as "calculatedAt" FROM impact_metrics WHERE project_id = $1 ORDER BY calculated_at DESC',
        [projectId]
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM impact_metrics', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] impactMetricsByProject - Error', error);
      throw new Error('Failed to fetch impact metrics');
    }
  }

  @Mutation(() => ImpactMetric)
  async createImpactMetric(
    @Arg('projectId', () => Int) projectId: number,
    @Arg('metricType') metricType: string,
    @Arg('value') value: string,
    @Arg('unit') unit: string
  ): Promise<ImpactMetric> {
    if (!metricType || metricType.trim().length === 0) {
      Logger.warn('[Mutation] createImpactMetric - Empty metric type');
      throw new Error('Metric type cannot be empty');
    }

    try {
      Logger.info('[Mutation] createImpactMetric - Creating metric', { projectId, metricType });
      const startTime = Date.now();

      const result = await pool.query(
        'INSERT INTO impact_metrics (project_id, metric_type, value, unit) VALUES ($1, $2, $3, $4) RETURNING id, project_id as "projectId", metric_type as "metricType", value, unit, calculated_at as "calculatedAt"',
        [projectId, metricType, value, unit]
      );

      const duration = Date.now() - startTime;
      const metric = result.rows[0];
      Logger.query('INSERT INTO impact_metrics', duration, 1);
      Logger.info('[Mutation] createImpactMetric - Success', { id: metric.id });

      return metric;
    } catch (error) {
      Logger.error('[Mutation] createImpactMetric - Error', error);
      throw new Error('Failed to create impact metric');
    }
  }
}