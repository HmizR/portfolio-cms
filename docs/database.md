# Database foundation

PortfolioCMS uses PostgreSQL through Drizzle ORM and the `pg` driver.

The schema entry point is `src/db/schema/index.ts`. Milestone 2 owns the `users`, `accounts`, `sessions`, `verifications`, and `rate_limits` tables. Later domain tables are introduced only by their owning milestones. Production deployment must use `npm run db:migrate`; destructive schema push is not a deployment workflow.

## Commands

- `npm run db:check` loads the standard Next.js environment files, validates the server configuration, and verifies the configured PostgreSQL connection.
- `npm run db:generate` creates a migration after a schema change.
- `npm run db:migrate` applies checked-in migrations.
- `npm run db:studio` opens Drizzle Studio for local inspection.

All commands require `DATABASE_URL` and load the standard Next.js environment files, including `.env.local`. Authentication timestamps use timezone-aware PostgreSQL types and are stored in UTC.

Playwright uses `TEST_DATABASE_URL` when supplied. Its database name must end in `_test`; when omitted locally, the test runner derives a sibling `_test` database from `DATABASE_URL`. It creates that database if necessary, applies checked-in migrations, and truncates only authentication tables before the run.
