import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { Alert } from '../entities/Alert';
import { pool } from '../db';
import { Logger } from '../logger';

@Resolver(() => Alert)
export class AlertResolver {
  @Query(() => [Alert])
  async activeAlerts(): Promise<Alert[]> {
    try {
      Logger.info('[Query] activeAlerts - fetching active alerts');
      const startTime = Date.now();

      const result = await pool.query(
        'SELECT id, project_id as "projectId", alert_type as "alertType", severity, description, status, created_at as "createdAt", resolved_at as "resolvedAt" FROM alerts WHERE status = $1 ORDER BY created_at DESC',
        ['open']
      );

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM alerts WHERE status=open', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] activeAlerts - Error', error);
      throw new Error('Failed to fetch alerts');
    }
  }

  @Query(() => [Alert])
  async alertsByProject(
    @Arg('projectId', () => Int) projectId: number,
    @Arg('status', { nullable: true }) status?: string
  ): Promise<Alert[]> {
    try {
      Logger.info('[Query] alertsByProject - fetching alerts', { projectId, status });
      const startTime = Date.now();

      let query = 'SELECT id, project_id as "projectId", alert_type as "alertType", severity, description, status, created_at as "createdAt", resolved_at as "resolvedAt" FROM alerts WHERE project_id = $1';
      const params: any[] = [projectId];

      if (status) {
        query += ' AND status = $2';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);

      const duration = Date.now() - startTime;
      Logger.query('SELECT FROM alerts WHERE project_id', duration, result.rows.length);

      return result.rows;
    } catch (error) {
      Logger.error('[Query] alertsByProject - Error', error);
      throw new Error('Failed to fetch alerts');
    }
  }

  @Mutation(() => Alert)
  async createAlert(
    @Arg('projectId', () => Int) projectId: number,
    @Arg('alertType') alertType: string,
    @Arg('severity') severity: string,
    @Arg('description') description: string
  ): Promise<Alert> {
    if (!alertType || alertType.trim().length === 0) {
      Logger.warn('[Mutation] createAlert - Empty alert type');
      throw new Error('Alert type cannot be empty');
    }

    if (!['low', 'medium', 'high', 'critical'].includes(severity)) {
      Logger.warn('[Mutation] createAlert - Invalid severity', { severity });
      throw new Error('Severity must be low, medium, high, or critical');
    }

    try {
      Logger.info('[Mutation] createAlert - Creating alert', { projectId, alertType, severity });
      const startTime = Date.now();

      const result = await pool.query(
        'INSERT INTO alerts (project_id, alert_type, severity, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, project_id as "projectId", alert_type as "alertType", severity, description, status, created_at as "createdAt", resolved_at as "resolvedAt"',
        [projectId, alertType, severity, description, 'open']
      );

      const duration = Date.now() - startTime;
      const alert = result.rows[0];
      Logger.query('INSERT INTO alerts', duration, 1);
      Logger.info('[Mutation] createAlert - Success', { id: alert.id });

      return alert;
    } catch (error) {
      Logger.error('[Mutation] createAlert - Error', error);
      throw new Error('Failed to create alert');
    }
  }

  @Mutation(() => Alert)
  async resolveAlert(
    @Arg('alertId', () => Int) alertId: number
  ): Promise<Alert> {
    try {
      Logger.info('[Mutation] resolveAlert - Resolving alert', { alertId });
      const startTime = Date.now();

      const result = await pool.query(
        'UPDATE alerts SET status = $1, resolved_at = NOW() WHERE id = $2 RETURNING id, project_id as "projectId", alert_type as "alertType", severity, description, status, created_at as "createdAt", resolved_at as "resolvedAt"',
        ['resolved', alertId]
      );

      if (result.rows.length === 0) {
        throw new Error('Alert not found');
      }

      const duration = Date.now() - startTime;
      const alert = result.rows[0];
      Logger.query('UPDATE alerts', duration, 1);
      Logger.info('[Mutation] resolveAlert - Success', { id: alert.id });

      return alert;
    } catch (error) {
      Logger.error('[Mutation] resolveAlert - Error', error);
      throw new Error('Failed to resolve alert');
    }
  }
}