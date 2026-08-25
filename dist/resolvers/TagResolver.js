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
exports.TagResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Tag_1 = require("../entities/Tag");
const db_1 = require("../db");
const logger_1 = require("../logger");
let TagResolver = class TagResolver {
    async topTags(limit) {
        // Validate input
        if (limit < 1 || limit > 100) {
            logger_1.Logger.warn('[Query] topTags - Invalid limit', { limit });
            throw new Error('Limit must be between 1 and 100');
        }
        try {
            logger_1.Logger.info(`[Query] topTags - Fetching top ${limit} tags`);
            const startTime = Date.now();
            const result = await db_1.pool.query(`SELECT t.id, t.name, COUNT(ft.feedback_id)::integer as count, t.created_at as "createdAt"
         FROM tags t
         LEFT JOIN feedback_tags ft ON t.id = ft.tag_id
         GROUP BY t.id, t.name, t.created_at
         ORDER BY count DESC
         LIMIT $1`, [limit]);
            const duration = Date.now() - startTime;
            logger_1.Logger.query('SELECT topTags', duration, result.rows.length);
            return result.rows;
        }
        catch (error) {
            logger_1.Logger.error('[Query] topTags - Database error', error);
            throw new Error('Failed to fetch top tags');
        }
    }
};
exports.TagResolver = TagResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Tag_1.Tag]),
    __param(0, (0, type_graphql_1.Arg)('limit', () => type_graphql_1.Int, { defaultValue: 10 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TagResolver.prototype, "topTags", null);
exports.TagResolver = TagResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Tag_1.Tag)
], TagResolver);
