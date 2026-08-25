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
exports.ImpactMetricResolver = void 0;
const type_graphql_1 = require("type-graphql");
const ImpactMetric_1 = require("../entities/ImpactMetric");
const db_1 = require("../db");
const logger_1 = require("../logger");
let ImpactMetricResolver = class ImpactMetricResolver {
    async impactMetricsByProject(projectId) {
        try {
            logger_1.Logger.info('[Query] impactMetricsByProject - fetching metrics', { projectId });
            const startTime = Date.now();
            const result = await db_1.pool.query('SELECT id, project_id as "projectId", metric_type as "metricType", value, unit, calculated_at as "calculatedAt" FROM impact_metrics WHERE project_id = $1 ORDER BY calculated_at DESC', [projectId]);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM impact_metrics', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] impactMetricsByProject - Error', error);
            throw new Error('Failed to fetch impact metrics');
        }
    }
    async createImpactMetric(projectId, metricType, value, unit) {
        if (!metricType || metricType.trim().length === 0) {
            logger_1.Logger.warn('[Mutation] createImpactMetric - Empty metric type');
            throw new Error('Metric type cannot be empty');
        }
        try {
            logger_1.Logger.info('[Mutation] createImpactMetric - Creating metric', { projectId, metricType });
            const startTime = Date.now();
            const result = await db_1.pool.query('INSERT INTO impact_metrics (project_id, metric_type, value, unit) VALUES ($1, $2, $3, $4) RETURNING id, project_id as "projectId", metric_type as "metricType", value, unit, calculated_at as "calculatedAt"', [projectId, metricType, value, unit]);
            const duration = Date.now() - startTime;
            const metric = result.rows[0];
            logger_1.Logger.query('INSERT INTO impact_metrics', duration, 1);
            logger_1.Logger.info('[Mutation] createImpactMetric - Success', { id: metric.id });
            return metric;
        }
        catch (error) {
            logger_1.Logger.error('[Mutation] createImpactMetric - Error', error);
            throw new Error('Failed to create impact metric');
        }
    }
};
exports.ImpactMetricResolver = ImpactMetricResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [ImpactMetric_1.ImpactMetric]),
    __param(0, (0, type_graphql_1.Arg)('projectId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImpactMetricResolver.prototype, "impactMetricsByProject", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ImpactMetric_1.ImpactMetric),
    __param(0, (0, type_graphql_1.Arg)('projectId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('metricType')),
    __param(2, (0, type_graphql_1.Arg)('value')),
    __param(3, (0, type_graphql_1.Arg)('unit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ImpactMetricResolver.prototype, "createImpactMetric", null);
exports.ImpactMetricResolver = ImpactMetricResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => ImpactMetric_1.ImpactMetric)
], ImpactMetricResolver);
