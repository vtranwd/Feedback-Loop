"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const express_graphql_1 = require("express-graphql");
const FeedbackResolver_1 = require("./resolvers/FeedbackResolver");
const UserResolver_1 = require("./resolvers/UserResolver");
const TagResolver_1 = require("./resolvers/TagResolver");
const AuthResolver_1 = require("./resolvers/AuthResolver");
const ProjectResolver_1 = require("./resolvers/ProjectResolver");
const ObservationResolver_1 = require("./resolvers/ObservationResolver");
const ImpactMetricResolver_1 = require("./resolvers/ImpactMetricResolver");
const AlertResolver_1 = require("./resolvers/AlertResolver");
const logger_1 = require("./logger");
const PORT = process.env.PORT || 4000;
async function main() {
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [
            FeedbackResolver_1.FeedbackResolver,
            UserResolver_1.UserResolver,
            TagResolver_1.TagResolver,
            AuthResolver_1.AuthResolver,
            ProjectResolver_1.ProjectResolver,
            ObservationResolver_1.ObservationResolver,
            ImpactMetricResolver_1.ImpactMetricResolver,
            AlertResolver_1.AlertResolver,
        ],
    });
    const app = (0, express_1.default)();
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS')
            return res.sendStatus(200);
        next();
    });
    app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
        schema: schema,
        graphiql: true,
    }));
    app.listen(PORT, () => {
        logger_1.Logger.info(`🌍 GraphQL API running at http://localhost:${PORT}/graphql`);
    });
}
main().catch(console.error);
