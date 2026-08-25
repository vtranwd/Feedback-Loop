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
exports.ProjectResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Project_1 = require("../entities/Project");
const db_1 = require("../db");
const logger_1 = require("../logger");
let ProjectResolver = class ProjectResolver {
    async projects() {
        try {
            logger_1.Logger.info('[Query] projects - fetching all projects');
            const startTime = Date.now();
            const result = await db_1.pool.query('SELECT id, name, location, project_type as "projectType", co2_baseline as "co2Baseline", target_co2_reduction as "targetCo2Reduction", created_at as "createdAt" FROM projects ORDER BY created_at DESC');
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM projects', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] projects - Error', error);
            throw new Error('Failed to fetch projects');
        }
    }
    async project(id) {
        try {
            logger_1.Logger.info('[Query] project - fetching project', { id });
            const startTime = Date.now();
            const result = await db_1.pool.query('SELECT id, name, location, project_type as "projectType", co2_baseline as "co2Baseline", target_co2_reduction as "targetCo2Reduction", created_at as "createdAt" FROM projects WHERE id = $1', [id]);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM projects WHERE id', duration, result.rows.length);
            return result.rows[0] || null;
        }
        catch (error) {
            logger_1.Logger.error('[Query] project - Error', error);
            throw new Error('Failed to fetch project');
        }
    }
    async createProject(name, location, projectType, co2Baseline, targetCo2Reduction) {
        if (!name || name.trim().length === 0) {
            logger_1.Logger.warn('[Mutation] createProject - Empty name provided');
            throw new Error('Project name cannot be empty');
        }
        try {
            logger_1.Logger.info('[Mutation] createProject - Creating project', { name, projectType });
            const startTime = Date.now();
            const result = await db_1.pool.query('INSERT INTO projects (name, location, project_type, co2_baseline, target_co2_reduction) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, location, project_type as "projectType", co2_baseline as "co2Baseline", target_co2_reduction as "targetCo2Reduction", created_at as "createdAt"', [name, location || null, projectType || null, co2Baseline || null, targetCo2Reduction || null]);
            const duration = Date.now() - startTime;
            const project = result.rows[0];
            logger_1.Logger.query('INSERT INTO projects', duration, 1);
            logger_1.Logger.info('[Mutation] createProject - Success', { id: project.id });
            return project;
        }
        catch (error) {
            logger_1.Logger.error('[Mutation] createProject - Error', error);
            throw new Error('Failed to create project');
        }
    }
};
exports.ProjectResolver = ProjectResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Project_1.Project]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "projects", null);
__decorate([
    (0, type_graphql_1.Query)(() => Project_1.Project, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "project", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Project_1.Project),
    __param(0, (0, type_graphql_1.Arg)('name')),
    __param(1, (0, type_graphql_1.Arg)('location', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('projectType', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('co2Baseline', { nullable: true })),
    __param(4, (0, type_graphql_1.Arg)('targetCo2Reduction', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "createProject", null);
exports.ProjectResolver = ProjectResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Project_1.Project)
], ProjectResolver);
