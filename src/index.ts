import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { graphqlHTTP } from 'express-graphql';
import { FeedbackResolver } from './resolvers/FeedbackResolver';
import { UserResolver } from './resolvers/UserResolver';
import { TagResolver } from './resolvers/TagResolver';

const PORT = 4000;

async function main() {
  const schema = await buildSchema({
    resolvers: [FeedbackResolver, UserResolver, TagResolver],
  });

  const app = express();

  // Add logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));

  app.listen(PORT, () => {
    console.log(`GraphQL API running at http://localhost:${PORT}/graphql`);
  });
}

main().catch(console.error);