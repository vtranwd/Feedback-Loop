# Database Migration Guide

## Quick Start

### Option 1: Run Migration Manually (Recommended First Time)

```bash
npm run migrate
```

This reads `init.sql` and creates all tables in your database. Safe to run multiple times (uses `CREATE TABLE IF NOT EXISTS`).

### Option 2: Use Railway Pre-Deploy Command (Automated)

If you want migrations to run automatically on every deploy:

1. Go to your Railway project dashboard
2. Select the `web` service
3. Go to **Settings → Deploy**
4. In **Pre-Deploy Command**, add:
   ```
   npm run migrate
   ```
5. Save and redeploy

Now the migration runs automatically before each deployment.

---

## What Gets Created

- **users** — User accounts and workspace info
- **projects** — Environmental projects with CO2 targets
- **feedback** — User feedback entries
- **tags** — Feedback tags
- **observations** — Project observations (location, metrics, etc.)
- **impact_metrics** — Calculated impact metrics per project
- **alerts** — Project alerts with severity levels

All tables include indexes on foreign keys and commonly queried fields for performance.

---

## Connecting the Database

The migration uses `DATABASE_URL` environment variable. Railway automatically provides this from the Postgres service.

To verify it's set:
```bash
echo $DATABASE_URL
```

Should output: `postgres://user:password@hostname:5432/feedback`

---

## Troubleshooting

### Migration fails with "connection refused"
- Check that DATABASE_URL is set correctly
- Verify Postgres service is running on Railway
- Make sure your app has the reference variable set

### Tables already exist
- This is fine. The migration uses `CREATE TABLE IF NOT EXISTS`, so re-running is safe.

### Want to reset everything
```bash
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run migrate
```

⚠️ **Warning**: This deletes all data. Only do this in development/staging.

---

## Manual Migration with psql

If you prefer to run SQL directly:

```bash
psql $DATABASE_URL < init.sql
```

---

## Adding New Tables

1. Edit `init.sql`
2. Add your table definition
3. Run `npm run migrate` again (or redeploy if pre-deploy command is enabled)

