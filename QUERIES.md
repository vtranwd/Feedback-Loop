# Available GraphQL Queries

## Feedback Queries

### listFeedback (Paginated)
Returns feedback with pagination support.

```graphql
query {
  listFeedback(pagination: { limit: 10, offset: 0 }) {
    items {
      id
      text
      source
      createdAt
    }
    total
    limit
    offset
    hasMore
  }
}
```

**Parameters:**
- `limit`: Number of results (1-100, default 10)
- `offset`: Skip this many results (default 0)

**Use case:** Building a feed/timeline UI

---

### feedbackByUser
Get all feedback from a specific user.

```graphql
query {
  feedbackByUser(userId: 1) {
    id
    text
    source
  }
}
```

**Parameters:**
- `userId`: The user ID (required)

**Use case:** User profile page showing their feedback history

---

### recentFeedback
Get feedback from the last N days.

```graphql
query {
  recentFeedback(days: 7) {
    id
    text
    createdAt
  }
}
```

**Parameters:**
- `days`: Number of days back (1-365, default 7)

**Use case:** Dashboard showing recent customer feedback

---

## User Queries

### listUsers
Get all users (no pagination yet).

```graphql
query {
  listUsers {
    id
    email
    workspace
  }
}
```

---

## Tag Queries

### topTags
Get the most frequent tags.

```graphql
query {
  topTags(limit: 10) {
    id
    name
    count
  }
}
```

**Parameters:**
- `limit`: Number of tags (1-100, default 10)

**Use case:** Dashboard showing most common feedback themes

---

## Mutations

### createFeedback
Create new feedback.

```graphql
mutation {
  createFeedback(text: "...", source: "slack", userId: 1) {
    id
    text
    createdAt
  }
}
```

**Parameters:**
- `text`: Feedback text (required, 1-1000 chars)
- `source`: Where it came from (optional)
- `userId`: User who submitted it (optional)

---

### createUser
Create a new user.

```graphql
mutation {
  createUser(email: "alice@example.com", workspace: "engineering") {
    id
    email
  }
}
```

**Parameters:**
- `email`: Email address (required, must be valid)
- `workspace`: Team/workspace name (required)