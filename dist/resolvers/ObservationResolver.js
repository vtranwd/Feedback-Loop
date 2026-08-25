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
exports.ObservationResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Observation_1 = require("../entities/Observation");
const db_1 = require("../db");
const logger_1 = require("../logger");
let ObservationResolver = class ObservationResolver {
    async observationsByProject(projectId, observationType) {
        try {
            logger_1.Logger.info('[Query] observationsByProject - fetching observations', { projectId, observationType });
            const startTime = Date.now();
            let query = 'SELECT id, project_id as "projectId", observation_type as "observationType", value, unit, latitude, longitude, notes, recorded_by as "recordedBy", recorded_at as "recordedAt" FROM observations WHERE project_id = $1';
            const params = [projectId];
            if (observationType) {
                query += ' AND observation_type = $2';
                params.push(observationType);
            }
            query += ' ORDER BY recorded_at DESC';
            const result = await db_1.pool.query(query, params);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM observations', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] observationsByProject - Error', error);
            throw new Error('Failed to fetch observations');
        }
    }
    async createObservation(projectId, observationType, value, unit, latitude, longitude, notes, recordedBy) {
        if (!observationType || observationType.trim().length === 0) {
            logger_1.Logger.warn('[Mutation] createObservation - Empty observation type');
            throw new Error('Observation type cannot be empty');
        }
        try {
            logger_1.Logger.info('[Mutation] createObservation - Creating observation', { projectId, observationType });
            const startTime = Date.now();
            const result = await db_1.pool.query('INSERT INTO observations (project_id, observation_type, value, unit, latitude, longitude, notes, recorded_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, project_id as "projectId", observation_type as "observationType", value, unit, latitude, longitude, notes, recorded_by as "recordedBy", recorded_at as "recordedAt"', [projectId, observationType, value || null, unit || null, latitude || null, longitude || null, notes || null, recordedBy || null]);
            const duration = Date.now() - startTime;
            const observation = result.rows[0];
            logger_1.Logger.query('INSERT INTO observations', duration, 1);
            logger_1.Logger.info('[Mutation] createObservation - Success', { id: observation.id });
            return observation;
        }
        catch (error) {
            logger_1.Logger.error('[Mutation] createObservation - Error', error);
            throw new Error('Failed to create observation');
        }
    }
};
exports.ObservationResolver = ObservationResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Observation_1.Observation]),
    __param(0, (0, type_graphql_1.Arg)('projectId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('observationType', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ObservationResolver.prototype, "observationsByProject", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Observation_1.Observation),
    __param(0, (0, type_graphql_1.Arg)('projectId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('observationType')),
    __param(2, (0, type_graphql_1.Arg)('value', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('unit', { nullable: true })),
    __param(4, (0, type_graphql_1.Arg)('latitude', { nullable: true })),
    __param(5, (0, type_graphql_1.Arg)('longitude', { nullable: true })),
    __param(6, (0, type_graphql_1.Arg)('notes', { nullable: true })),
    __param(7, (0, type_graphql_1.Arg)('recordedBy', () => type_graphql_1.Int, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], ObservationResolver.prototype, "createObservation", null);
exports.ObservationResolver = ObservationResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Observation_1.Observation)
], ObservationResolver);
