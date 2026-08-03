# Observability Guide

## Logging Levels

- **INFO**: Normal operations (queries completed, mutations executed)
- **WARN**: Unusual but handled cases (invalid input, validation failures)
- **ERROR**: Unexpected failures (database errors, connection issues)

## Slow Query Detection

Queries taking longer than 100ms are logged as WARN:
[2026-08-02T...] WARN: SLOW QUERY (125ms) { query: "SELECT ...", rows: 1000 }

If you see slow queries:
1. Check if an index is missing
2. Check if you're fetching too many rows
3. Consider caching or denormalization

## Example Logs

### Successful query:
[2026-08-02T08:30:15.123Z] INFO: [Query] listFeedback - fetching all feedback
[2026-08-02T08:30:15.128Z] INFO: Query completed in 5ms (1 rows)

### Validation error:
[2026-08-02T08:30:20.456Z] WARN: [Mutation] createFeedback - Empty text provided

### Duplicate user error:
[2026-08-02T08:30:25.789Z] WARN: [Mutation] createUser - Email already exists { email: 'alice@example.com' }

### Database error:
[2026-08-02T08:30:30.012Z] ERROR: [Query] listUsers - Database error [database connection failed]

## Monitoring in Production

Track these metrics:
- Slow queries (> 100ms)
- Error rate (failed mutations/queries)
- Query frequency (which queries run most?)
- Response times

## Future: Real Monitoring

For production, integrate with:
- CloudWatch (AWS logs)
- DataDog (APM)
- New Relic (monitoring)