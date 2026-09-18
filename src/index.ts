import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { graphqlHTTP } from 'express-graphql';
import { FeedbackResolver } from './resolvers/FeedbackResolver';
import { UserResolver } from './resolvers/UserResolver';
import { TagResolver } from './resolvers/TagResolver';
import { AuthResolver } from './resolvers/AuthResolver';
import { ProjectResolver } from './resolvers/ProjectResolver';
import { ObservationResolver } from './resolvers/ObservationResolver';
import { ImpactMetricResolver } from './resolvers/ImpactMetricResolver';
import { AlertResolver } from './resolvers/AlertResolver';
import { Logger } from './logger';

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    const schema = await buildSchema({
      resolvers: [
        FeedbackResolver,
        UserResolver,
        TagResolver,
        AuthResolver,
        ProjectResolver,
        ObservationResolver,
        ImpactMetricResolver,
        AlertResolver,
      ],
    });

    console.log('✅ Schema built successfully');

    const app = express();

    app.use((req, res, next) => {
      console.log(`📨 ${req.method} ${req.path}`);
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://feedback-loop-frontend-xyz.vercel.app',
      ];
      
      const origin = req.headers.origin as string;
      if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      } else {
        res.header('Access-Control-Allow-Origin', '*');
      }
      
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') return res.sendStatus(200);
      next();
    });

    app.use('/graphql', graphqlHTTP({
      schema: schema,
      graphiql: true,
      customFormatErrorFn: (error) => {
        console.error('❌ GraphQL Error:', error);
        return error;
      },
    }));

    app.listen(PORT, () => {
      console.log(`🌍 GraphQL API running at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();