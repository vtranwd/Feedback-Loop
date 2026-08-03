# Feedback Loop Architecture

## Overview

Feedback Loop is a GraphQL API for collecting and analyzing customer feedback. It demonstrates a production-ready backend with proper database design, error handling, and observability.

## System Diagram
┌─────────────────┐
│ React Client │
└────────┬────────┘
│ GraphQL Queries/Mutations
│
┌────────▼──────────────────┐
│ Express + TypeGraphQL │
│ - Input validation │
│ - Error handling │
│ - Logging & observability│
└────────┬──────────────────┘
│ SQL Queries
│
┌────────▼──────────────────┐
│ PostgreSQL (RDS) │
│ - feedback table │
│ - users table │
│ - tags table │
│ - Indexes on hot columns │
└───────────────────────────┘

## Database Schema

### feedback
```sql
id (PK)
text (required)
source (optional)
user_id (FK to users)
created_at (indexed)
```

**Indexes:**
- `idx_feedback_user_id` - for queries by user
- `idx_feedback_created_at` - for sorting/filtering by time

### users
```sql
id (PK)
email (unique, required)
workspace (required)
created_at
```

**Indexes:**
- `idx_users_email` (automatic via UNIQUE)

### tags
```sql
id (PK)
name (unique, required)
created_at
```

**Indexes:**
- `idx_tags_name` (automatic via UNIQUE)

### feedback_tags (junction table)
```sql
feedback_id (FK to feedback)
tag_id (FK to tags)
PRIMARY KEY (feedback_id, tag_id)
```

**Indexes:**
- `idx_feedback_tags_tag_id` - for tag lookups

---

## API Layer

### Resolvers

**FeedbackResolver**
- `listFeedback(pagination)` - Get all feedback with pagination
- `feedbackByUser(userId)` - Get feedback from specific user
- `recentFeedback(days)` - Get feedback from last N days
- `createFeedback(text, source, userId)` - Create new feedback

**UserResolver**
- `listUsers()` - Get all users
- `createUser(email, workspace)` - Create new user

**TagResolver**
- `topTags(limit)` - Get most frequent tags

### Error Handling

All resolvers:
1. Validate input before querying database
2. Log errors with context
3. Return user-friendly error messages
4. Handle database-specific errors (e.g., duplicate email)

### Observability

Logging:
- INFO: Normal operations
- WARN: Validation failures, unusual cases
- ERROR: Unexpected failures

Slow query detection:
- Queries > 100ms are logged as WARN
- Includes query time and row count

---

## Performance Characteristics

### Current Metrics (with test data)

| Operation | Time | Notes |
|-----------|------|-------|
| listFeedback (10 items) | 5-10ms | Uses index on created_at |
| feedbackByUser | 3-8ms | Uses index on user_id |
| recentFeedback (7 days) | 5-12ms | Uses index on created_at |
| createFeedback | 3-5ms | Fast insert |
| topTags | 8-15ms | GROUP BY + JOIN (potential bottleneck) |

### Scalability Analysis

**At 100K rows:**
- listFeedback: Still fast (pagination + index)
- feedbackByUser: Still fast (index on user_id)
- topTags: May slow to 50-100ms (consider caching)

**At 1M rows:**
- listFeedback: Fast (pagination)
- topTags: Slow (100-500ms without optimization)
  - Solution: Denormalize counts or use Redis cache
- feedbackByUser: Still fast if user has < 10K feedback

**At 10M rows:**
- Need: Redis caching layer
- Need: Denormalized counts in tags table
- Need: Async tag count updates

---

## Technology Choices

### Why TypeGraphQL?
- Type-safe schema (leverages TypeScript)
- Less boilerplate than manual schema
- Automatic schema validation
- Self-documenting API

### Why Express + GraphQL?
- Express is lightweight and familiar
- GraphQL provides flexibility for frontend
- Single endpoint (easier to cache, monitor)

### Why Postgres?
- Relational data (feedback ↔ users ↔ tags)
- ACID transactions
- Powerful query language
- Good indexing capabilities

### Why RDS (in production)?
- Managed backups and failover
- Automatic scaling
- Monitoring built-in
- Less ops work

---

## Deployment Architecture (Future)
┌──────────────┐
│ Vercel │ (Frontend)
│ React SPA │
└──────┬───────┘
│
┌──────▼────────────────┐
│ AWS Route 53 │ (DNS)
└──────┬────────────────┘
│
┌──────▼────────────────┐
│ AWS ECS Fargate │ (Backend)
│ - Docker containers │
│ - Auto-scaling │
│ - Health checks │
└──────┬────────────────┘
│
┌──────▼────────────────┐
│ AWS RDS Postgres │ (Database)
│ - Multi-AZ │
│ - Automated backups │
│ - Read replicas │
└───────────────────────┘

CloudWatch (Logs, Metrics, Alarms)

---

## Key Learnings

1. **Indexes matter** - Small indexes solve big performance problems
2. **Validation first** - Catch errors before database
3. **Logging is crucial** - You can't fix what you can't see
4. **Design for scale** - Think about 10x data growth
5. **Simple is better** - Avoid premature optimization