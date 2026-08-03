# Scalability Concerns

## Current Implementation

### What works well:
- Indexes on user_id, created_at, and tags
- Efficient JOIN queries for tags
- Database connection pooling

### What would break at scale:

1. **Top Tags Query** (10M+ rows)
   - Current: Counts feedback per tag on every request
   - Problem: GROUP BY with JOIN is slow with many rows
   - Solution: Denormalize tag counts, update asynchronously
   - Alternative: Use Redis cache for top tags

2. **Feedback List** (1M+ rows)
   - Current: No pagination
   - Problem: Returning all feedback at once is slow
   - Solution: Add pagination (LIMIT/OFFSET)

3. **User Feedback** (many users, millions of rows)
   - Current: Can query all feedback by user
   - Problem: Without proper indexes, this could be slow
   - Solution: Ensure index on (user_id, created_at)

## Measurements

Currently with test data:
- listFeedback: ~5-10ms
- topTags: ~8-15ms
- createFeedback: ~3-5ms

## Next Steps (If scaling)

1. Add caching layer (Redis)
2. Denormalize counts
3. Implement pagination
4. Monitor slow queries in production