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
exports.AuthResolver = exports.AuthPayload = void 0;
const type_graphql_1 = require("type-graphql");
const db_1 = require("../db");
const logger_1 = require("../logger");
const auth_1 = require("../auth");
let AuthPayload = class AuthPayload {
};
exports.AuthPayload = AuthPayload;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AuthPayload.prototype, "token", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AuthPayload.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AuthPayload.prototype, "email", void 0);
exports.AuthPayload = AuthPayload = __decorate([
    (0, type_graphql_1.ObjectType)()
], AuthPayload);
let AuthResolver = class AuthResolver {
    async login(email, workspace) {
        // Validate input
        if (!email || !email.includes('@')) {
            logger_1.Logger.warn('[Mutation] login - Invalid email', { email });
            throw new Error('Invalid email address');
        }
        try {
            logger_1.Logger.info('[Mutation] login - User login attempt', { email });
            // Check if user exists
            let result = await db_1.pool.query('SELECT id FROM users WHERE email = $1', [email]);
            let userId;
            if (result.rows.length === 0) {
                // Create user if doesn't exist
                logger_1.Logger.info('[Mutation] login - Creating new user', { email, workspace });
                const createResult = await db_1.pool.query('INSERT INTO users (email, workspace) VALUES ($1, $2) RETURNING id', [email, workspace]);
                userId = createResult.rows[0].id;
            }
            else {
                userId = result.rows[0].id;
            }
            // Generate token
            const token = (0, auth_1.generateToken)(userId, email);
            logger_1.Logger.info('[Mutation] login - Success', { userId, email });
            return {
                token,
                userId: String(userId),
                email,
            };
        }
        catch (error) {
            logger_1.Logger.error('[Mutation] login - Error', error);
            throw new Error('Login failed');
        }
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => AuthPayload),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Arg)('workspace')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AuthResolver);
