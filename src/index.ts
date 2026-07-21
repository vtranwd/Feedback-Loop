import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { graphqlHTTP } from 'express-graphql';
import { FeedbackResolver } from './resolvers/FeedbackResolver';

const PORT = 4000;

async function main() {
  const schema = await buildSchema({
    resolvers: [FeedbackResolver],
  });

  const app = express();

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));

  app.listen(PORT, () => {
    console.log(`GraphQL API running at http://localhost:${PORT}/graphql`);
  });
}

main().catch(console.error);