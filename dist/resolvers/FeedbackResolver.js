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
exports.FeedbackResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Feedback_1 = require("../entities/Feedback");
const PaginatedFeedback_1 = require("../types/PaginatedFeedback");
const PaginationArgs_1 = require("../types/PaginationArgs");
const db_1 = require("../db");
const logger_1 = require("../logger");
let FeedbackResolver = class FeedbackResolver {
    async listFeedback(pagination) {
        const limit = pagination?.limit || 10;
        const offset = pagination?.offset || 0;
        // Validate pagination
        if (limit < 1 || limit > 100) {
            logger_1.Logger.warn('[Query] listFeedback - Invalid limit', { limit });
            throw new Error('Limit must be between 1 and 100');
        }
        if (offset < 0) {
            logger_1.Logger.warn('[Query] listFeedback - Invalid offset', { offset });
            throw new Error('Offset cannot be negative');
        }
        try {
            logger_1.Logger.info('[Query] listFeedback - Fetching feedback', { limit, offset });
            const startTime = Date.now();
            // Get total count
            const countResult = await db_1.pool.query('SELECT COUNT(*) as count FROM feedback');
            const total = parseInt(countResult.rows[0].count);
            // Get paginated results
            const result = await db_1.pool.query('SELECT id, text, source, created_at as "createdAt" FROM feedback ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM feedback (paginated)', duration, result.rows.length);
            return {
                items: result.rows,
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            };
        }
        catch (error) {
            logger_1.Logger.error('[Query] listFeedback - Database error', error);
            throw new Error('Failed to fetch feedback from database');
        }
    }
    async feedbackByUser(userId) {
        if (userId < 1) {
            logger_1.Logger.warn('[Query] feedbackByUser - Invalid userId', { userId });
            throw new Error('User ID must be positive');
        }
        try {
            logger_1.Logger.info('[Query] feedbackByUser - Fetching feedback for user', { userId });
            const startTime = Date.now();
            const result = await db_1.pool.query('SELECT id, text, source, created_at as "createdAt" FROM feedback WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM feedback WHERE user_id', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] feedbackByUser - Database error', error);
            throw new Error('Failed to fetch user feedback');
        }
    }
    async recentFeedback(days) {
        if (days < 1 || days > 365) {
            logger_1.Logger.warn('[Query] recentFeedback - Invalid days', { days });
            throw new Error('Days must be between 1 and 365');
        }
        try {
            logger_1.Logger.info('[Query] recentFeedback - Fetching feedback from last', { days });
            const startTime = Date.now();
            const result = await db_1.pool.query(`SELECT id, text, source, created_at as "createdAt" FROM feedback 
         WHERE created_at >= NOW() - INTERVAL '1 day' * $1 
         ORDER BY created_at DESC`, [days]);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT FROM feedback (recent)', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] recentFeedback - Database error', error);
            throw new Error('Failed to fetch recent feedback');
        }
    }
    async createFeedback(text, source, userId) {
        // Validate input
        if (!text || text.trim().length === 0) {
            logger_1.Logger.warn('[Mutation] createFeedback - Empty text provided');
            throw new Error('Feedback text cannot be empty');
        }
        if (text.length > 1000) {
            logger_1.Logger.warn('[Mutation] createFeedback - Text too long', { length: text.length });
            throw new Error('Feedback text cannot exceed 1000 characters');
        }
        try {
            logger_1.Logger.info('[Mutation] createFeedback - Creating feedback', { textLength: text.length, source, userId });
            const startTime = Date.now();
            const result = await db_1.pool.query('INSERT INTO feedback (text, source, user_id) VALUES ($1, $2, $3) RETURNING id, text, source, created_at as "createdAt"', [text, source, userId || null]);
            const duration = Date.now() - startTime;
            const feedback = result.rows[0];
            logger_1.Logger.query('INSERT INTO feedback', duration, 1);
            logger_1.Logger.info(`[Mutation] createFeedback - Success`, { id: feedback.id });
            return feedback;
        }
        catch (error) {
            logger_1.Logger.error('[Mutation] createFeedback - Database error', error);
            throw new Error('Failed to create feedback in database');
        }
    }
};
exports.FeedbackResolver = FeedbackResolver;
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedFeedback_1.PaginatedFeedback),
    __param(0, (0, type_graphql_1.Arg)('pagination', () => PaginationArgs_1.PaginationArgs, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationArgs_1.PaginationArgs]),
    __metadata("design:returntype", Promise)
], FeedbackResolver.prototype, "listFeedback", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Feedback_1.Feedback]),
    __param(0, (0, type_graphql_1.Arg)('userId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedbackResolver.prototype, "feedbackByUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Feedback_1.Feedback]),
    __param(0, (0, type_graphql_1.Arg)('days', () => type_graphql_1.Int, { defaultValue: 7 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedbackResolver.prototype, "recentFeedback", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Feedback_1.Feedback),
    __param(0, (0, type_graphql_1.Arg)('text')),
    __param(1, (0, type_graphql_1.Arg)('source', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('userId', () => type_graphql_1.Int, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], FeedbackResolver.prototype, "createFeedback", null);
exports.FeedbackResolver = FeedbackResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Feedback_1.Feedback)
], FeedbackResolver);
