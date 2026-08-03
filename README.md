# Feedback Loop

A production-ready GraphQL API for collecting and analyzing customer feedback. Built with Node.js, TypeScript, TypeGraphQL, and PostgreSQL.

## Features

✅ **GraphQL API** - Type-safe API with TypeGraphQL  
✅ **Pagination** - Efficiently handle large datasets  
✅ **Error Handling** - Comprehensive input validation  
✅ **Logging & Observability** - Track queries, errors, and performance  
✅ **Database Indexes** - Optimized for common queries  
✅ **Scalability Analysis** - Plan for growth  

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for Postgres)
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/vtranwd/feedback-loop.git
cd feedback-loop

# Install dependencies
npm install --legacy-peer-deps

# Start Postgres in Docker
docker run --name feedback-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=feedback \
  -p 5432:5432 \
  -d postgres:15

# Create tables (from schema.sql or run manually)
docker exec -it feedback-postgres psql -U postgres -d feedback
# Then paste SQL from Part 2 of setup guide

# Start the development server
npm run dev
```

Visit http://localhost:4000/graphql

### Example Queries

**Create feedback:**
```graphql
mutation {
  createFeedback(text: "API is confusing", source: "slack") {
    id
    text
    createdAt
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

**Get most common feedback themes:**
```graphql
query {
  topTags(limit: 10) {
    name
    count
  }
}
```

See [QUERIES.md](./QUERIES.md) for full API documentation.

## Architecture

- **Frontend**: React (not included, use separately)
- **API**: Express + TypeGraphQL
- **Database**: PostgreSQL with indexes
- **Deployment**: Docker + AWS (guide in [ARCHITECTURE.md](./ARCHITECTURE.md))

## Performance

Current performance with test data:

| Operation | Latency |
|-----------|---------|
| listFeedback | 5-10ms |
| createFeedback | 3-5ms |
| feedbackByUser | 3-8ms |
| topTags | 8-15ms |

See [PERFORMANCE_CHECKLIST.md](./PERFORMANCE_CHECKLIST.md) for optimization roadmap.

## Development

```bash
# Start dev server (auto-reloads)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Logging & Observability

The API logs all queries with timing information:
[2026-08-02T08:30:15.123Z] INFO: [Query] listFeedback - fetching all feedback
[2026-08-02T08:30:15.128Z] INFO: Query completed in 5ms (1 rows)

Slow queries (> 100ms) are logged as WARN.

See [OBSERVABILITY.md](./OBSERVABILITY.md) for details.

## Project Structure
src/
├── index.ts # Server setup
├── db.ts # Database connection
├── logger.ts # Logging utility
├── entities/
│ ├── Feedback.ts # Feedback entity
│ ├── User.ts # User entity
│ └── Tag.ts # Tag entity
├── resolvers/
│ ├── FeedbackResolver.ts # Feedback queries/mutations
│ ├── UserResolver.ts # User queries/mutations
│ └── TagResolver.ts # Tag queries
└── types/
├── PaginationArgs.ts # Pagination input type
└── PaginatedFeedback.ts # Paginated result type

## Learning Journey

This project was built over 2 weeks to learn:

**Week 1:**
- TypeScript + Express
- GraphQL API design
- PostgreSQL integration
- Logging & error handling

**Week 2:**
- Database schema design
- Indexing & performance
- Input validation
- Pagination & advanced queries
- Scalability thinking

See [learning-project-guide.md](../learning-project-guide.md) for the full curriculum.

## Future Improvements

- [ ] Authentication (JWT)
- [ ] Rate limiting
- [ ] Redis caching for topTags
- [ ] Async tag count updates
- [ ] Database connection pooling optimization
- [ ] Unit & integration tests
- [ ] CI/CD pipeline
- [ ] Deployment to AWS

## Resources

- [GraphQL Docs](https://graphql.org/learn/)
- [TypeGraphQL Docs](https://typegraphql.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Express Docs](https://expressjs.com/)

## License

MIT