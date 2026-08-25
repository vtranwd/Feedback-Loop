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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedFeedback = void 0;
const type_graphql_1 = require("type-graphql");
const Feedback_1 = require("../entities/Feedback");
let PaginatedFeedback = class PaginatedFeedback {
};
exports.PaginatedFeedback = PaginatedFeedback;
__decorate([
    (0, type_graphql_1.Field)(() => [Feedback_1.Feedback]),
    __metadata("design:type", Array)
], PaginatedFeedback.prototype, "items", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PaginatedFeedback.prototype, "total", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PaginatedFeedback.prototype, "limit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PaginatedFeedback.prototype, "offset", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Boolean)
], PaginatedFeedback.prototype, "hasMore", void 0);
exports.PaginatedFeedback = PaginatedFeedback = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedFeedback);
