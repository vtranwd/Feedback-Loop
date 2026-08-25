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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const db_1 = require("../db");
const logger_1 = require("../logger");
let UserResolver = class UserResolver {
    async listUsers() {
        try {
            logger_1.Logger.info('[Query] listUsers - fetching all users');
            const startTime = Date.now();
            const result = await db_1.pool.query('SELECT id, email, workspace, created_at as "createdAt" FROM users ORDER BY created_at DESC');
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM users', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] listUsers - Database error', error);
            throw new Error('Failed to fetch users');
        }
    }
    async createUser(email, workspace) {
        // Validate input
        if (!email || !email.includes('@')) {
            logger_1.Logger.warn('[Mutation] createUser - Invalid email', { email });
            throw new Error('Invalid email address');
        }
        if (!workspace || workspace.trim().length === 0) {
            logger_1.Logger.warn('[Mutation] createUser - Empty workspace');
            throw new Error('Workspace cannot be empty');
        }
        try {
            logger_1.Logger.info('[Mutation] createUser - Creating user', { email, workspace });
            const startTime = Date.now();
            const result = await db_1.pool.query('INSERT INTO users (email, workspace) VALUES ($1, $2) RETURNING id, email, workspace, created_at as "createdAt"', [email, workspace]);
            const duration = Date.now() - startTime;
            const user = result.rows[0];
            logger_1.Logger.query('INSERT INTO users', duration, 1);
            logger_1.Logger.info(`[Mutation] createUser - Success`, { id: user.id, email });
            return user;
        }
        catch (error) {
            if (error.code === '23505') {
                // Unique constraint violation
                logger_1.Logger.warn('[Mutation] createUser - Email already exists', { email });
                throw new Error('This email is already registered');
            }
            logger_1.Logger.error('[Mutation] createUser - Database error', error);
            throw new Error('Failed to create user');
        }
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "listUsers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Arg)('workspace')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => User_1.User)
], UserResolver);
