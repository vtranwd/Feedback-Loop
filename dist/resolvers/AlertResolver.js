"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Alert_1 = require("../entities/Alert");
const db_1 = require("../db");
const logger_1 = require("../logger");
let AlertResolver = class AlertResolver {
    async activeAlerts() {
        try {
            logger_1.Logger.info('[Query] activeAlerts - fetching active alerts');
            const startTime = Date.now();
            const result = await db_1.pool.query('SELECT id, project_id as "projectId", alert_type as "alertType", severity, description, status, created_at as "createdAt", resolved_at as "resolvedAt" FROM alerts WHERE status = $1 ORDER BY created_at DESC', ['open']);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM alerts WHERE status=open', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] activeAlerts - Error', error);
            throw new Error('Failed to fetch alerts');
        }
    }
    async alertsByProject(projectId, status) {
        try {
            logger_1.Logger.info('[Query] alertsByProject - fetching alerts', { projectId, status });
            const startTime = Date.now();
            let query = 'SELECT id, project_id as "projectId", alert_type as "alertType", severity, description, status, created_at as "createdAt", resolved_at as "resolvedAt" FROM alerts WHERE project_id = $1';
            const params = [projectId];
            if (status) {
                query += ' AND status = $2';
                params.push(status);
            }
            query += ' ORDER BY created_at DESC';
            const result = await db_1.pool.query(query, params);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM alerts WHERE project_id', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] alertsByProject - Error', error);
            throw new Error('Failed to fetch alerts');
        }
    }
    async createAlert(projectId, alertType, severity, description) {
        if (!alertType || alertType.trim().length === 0) {
            logger_1.Logger.warn('[Mutation] createAlert - Empty alert type');
            throw new Error('Alert type cannot be empty');
        }
        if (!['low', 'medium', 'high', 'critical'].includes(severity)) {
            logger_1.Logger.warn('[Mutation] createAlert - Invalid severity', { severity });
            throw new Error('Severity must be low, medium, high, or critical');
        }
        try {
            logger_1.Logger.info('[Mutation] createAlert - Creating alert', { projectId, alertType, severity });
            const startTime = Date.now();
            const result = await db_1.pool.query('INSERT INTO alerts (project_id, alert_type, severity, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, project_id as "projectId", alert_type as "alertType", severity, description, status, created_at as "createdAt", resolved_at as "resolvedAt"', [projectId, alertType, severity, description, 'open']);
            const duration = Date.now() - startTime;
            const alert = result.rows[0];
            logger_1.Logger.query('INSERT INTO alerts', duration, 1);
            logger_1.Logger.info('[Mutation] createAlert - Success', { id: alert.id });
            return alert;
        }
        catch (error) {
            logger_1.Logger.error('[Mutation] createAlert - Error', error);
            throw new Error('Failed to create alert');
        }
    }
    async resolveAlert(alertId) {
        try {
            logger_1.Logger.info('[Mutation] resolveAlert - Resolving alert', { alertId });
            const startTime = Date.now();
            const result = await db_1.pool.query('UPDATE alerts SET status = $1, resolved_at = NOW() WHERE id = $2 RETURNING id, project_id as "projectId", alert_type as "alertType", severity, description, status, created_at as "createdAt", resolved_at as "resolvedAt"', ['resolved', alertId]);
            if (result.rows.length === 0) {
                throw new Error('Alert not found');
            }
            const duration = Date.now() - startTime;
            const alert = result.rows[0];
            logger_1.Logger.query('UPDATE alerts', duration, 1);
            logger_1.Logger.info('[Mutation] resolveAlert - Success', { id: alert.id });
            return alert;
        }
        catch (error) {
            logger_1.Logger.error('[Mutation] resolveAlert - Error', error);
            throw new Error('Failed to resolve alert');
        }
    }
};
exports.AlertResolver = AlertResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Alert_1.Alert]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertResolver.prototype, "activeAlerts", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Alert_1.Alert]),
    __param(0, (0, type_graphql_1.Arg)('projectId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('status', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AlertResolver.prototype, "alertsByProject", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Alert_1.Alert),
    __param(0, (0, type_graphql_1.Arg)('projectId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('alertType')),
    __param(2, (0, type_graphql_1.Arg)('severity')),
    __param(3, (0, type_graphql_1.Arg)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AlertResolver.prototype, "createAlert", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Alert_1.Alert),
    __param(0, (0, type_graphql_1.Arg)('alertId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlertResolver.prototype, "resolveAlert", null);
exports.AlertResolver = AlertResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Alert_1.Alert)
], AlertResolver);
