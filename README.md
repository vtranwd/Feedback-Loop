# Feedback Loop

A production-ready GraphQL API for collecting and analyzing customer feedback. Built with Node.js, TypeScript, TypeGraphQL, and PostgreSQL.

## Features

✅ **GraphQL API** - Type-safe API with TypeGraphQL  
✅ **Authentication** - JWT-based user authentication  
✅ **Pagination** - Efficiently handle large datasets  
✅ **Error Handling** - Comprehensive input validation  
✅ **Logging & Observability** - Track queries and performance  
✅ **Docker Support** - Easy local and cloud deployment  
✅ **Database Optimization** - Indexes and efficient queries  

## Quick Start

### Prerequisites
- Docker Desktop
- Node.js 18+ (for local development)

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up
```

This starts Postgres and the backend. Visit http://localhost:4000/graphql

### Option 2: Local Development

```bash
# Start Postgres
docker run --name feedback-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=feedback \
  -p 5432:5432 \
  -d postgres:15

# Install and run
npm install --legacy-peer-deps
npm run dev
```

Visit http://localhost:4000/graphql

## Project Structure
├── src/
│ ├── index.ts # Server entry point
│ ├── db.ts # Database connection
│ ├── auth.ts # JWT utilities
│ ├── logger.ts # Logging utility
│ ├── entities/ # Data models
│ ├── resolvers/ # GraphQL resolvers
│ └── types/ # Custom types
├── docker-compose.yml # Local development
├── Dockerfile # Production container
└── DEPLOYMENT.md # AWS deployment guide

## API Examples

**Create feedback:**
```graphql
mutation {
  createFeedback(text: "Great API!", source: "slack") {
    id
    text
  }
}
```

**List feedback (paginated):**
```graphql
query {
  listFeedback(pagination: { limit: 10, offset: 0 }) {
    items { id text }
    total
    hasMore
  }
}
```

**Login:**
```graphql
mutation {
  login(email: "user@example.com", workspace: "engineering") {
    token
    userId
  }
}
```

See [QUERIES.md](./QUERIES.md) for full API reference.

## Architecture

- **Backend**: Express + TypeGraphQL + PostgreSQL
- **Frontend**: React + Fetch (separate repo)
- **Database**: PostgreSQL with strategic indexes
- **Deployment**: Docker + AWS (ECS + RDS)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

## Development

```bash
# Start dev server (auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Monitoring

View logs:
```bash
npm run logs
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for AWS setup.

## Learning Journey

This project demonstrates:
- Full-stack application architecture
- Database design & optimization
- GraphQL API design patterns
- Authentication & authorization
- Production-ready code structure
- Logging & observability
- Docker containerization
- AWS deployment

## Key Technologies

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **API**: GraphQL + Express
- **Database**: PostgreSQL
- **ORM**: None (direct SQL with pg)
- **Auth**: JWT
- **Deployment**: Docker + AWS ECS
- **Frontend**: React (separate repo)

## Performance

Typical latencies:
- List feedback: 5-10ms
- Create feedback: 3-5ms
- Login: 10-20ms
- Top tags: 8-15ms

See [PERFORMANCE_CHECKLIST.md](./PERFORMANCE_CHECKLIST.md).

## License

MIT