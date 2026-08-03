import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { graphqlHTTP } from 'express-graphql';
import { FeedbackResolver } from './resolvers/FeedbackResolver';
import { UserResolver } from './resolvers/UserResolver';
import { TagResolver } from './resolvers/TagResolver';
import { Logger } from './logger';

const PORT = 4000;

async function main() {
  const schema = await buildSchema({
    resolvers: [FeedbackResolver, UserResolver, TagResolver],
  });

  const app = express();

  // Add logging middleware
  app.use((req, res, next) => {
    const startTime = Date.now();
    Logger.info(`${req.method} ${req.path}`);

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      Logger.info(`Response: ${res.statusCode} - ${duration}ms`);
    });

    next();
  });

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));

  app.listen(PORT, () => {
    Logger.info(`GraphQL API running at http://localhost:${PORT}/graphql`);
  });
}

main().catch(console.error);