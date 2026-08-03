# Deployment Guide

## Local Development

### Prerequisites
- Docker Desktop
- Node.js 18+
- npm

### Start Everything

```bash
docker-compose up
```

This starts:
- Postgres on localhost:5432
- Backend on localhost:4000
- Automatically runs migrations

### Stop Everything

```bash
docker-compose down
```

---

## AWS Deployment

### Prerequisites
- AWS account
- AWS CLI configured
- Docker

### 1. Create ECR Repository

```bash
aws ecr create-repository --repository-name feedback-loop --region us-east-1
```

Note the repository URI.

### 2. Set GitHub Secrets

In your GitHub repo, go to Settings → Secrets and add:

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `ECR_REGISTRY`: Your ECR registry URI

### 3. Deploy Database (RDS)

```bash
aws rds create-db-instance \
  --db-instance-identifier feedback-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourSecurePassword \
  --allocated-storage 20
```

### 4. Deploy Backend (ECS Fargate)

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name feedback-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster feedback-cluster \
  --service-name feedback-service \
  --task-definition feedback-loop:1 \
  --desired-count 1 \
  --launch-type FARGATE
```

### 5. Deploy Frontend (Vercel)

```bash
cd ../feedback-loop-frontend
npm install -g vercel
vercel
```

Follow prompts to deploy to Vercel.

---

## Monitoring

### CloudWatch Logs

```bash
aws logs tail /ecs/feedback-loop --follow
```

### Health Check

```bash
curl http://your-api.com/graphql
```

Should return GraphQL playground.

---

## Environment Variables

Set these in ECS task definition:
DATABASE_URL=postgres://user:pass@rds-endpoint:5432/feedback
NODE_ENV=production
JWT_SECRET=your-production-secret-key

---

## Rollback

If deployment fails:

```bash
aws ecs update-service \
  --cluster feedback-cluster \
  --service feedback-service \
  --force-new-deployment
```

---

## Cost Estimation (Monthly)

- **ECS Fargate**: ~$30/month (1 task)
- **RDS Postgres**: ~$15/month (db.t3.micro)
- **CloudWatch**: ~$5/month (logs)
- **Total**: ~$50/month