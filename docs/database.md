# Database foundation

PortfolioCMS uses PostgreSQL through Drizzle ORM and the `pg` driver.

The schema entry point is `src/db/schema/index.ts`. It is intentionally empty during Milestone 0: domain tables and their checked-in Drizzle migrations are introduced by the milestone that owns each domain. Production deployment must use `npm run db:migrate`; destructive schema push is not a deployment workflow.

## Commands

- `npm run db:check` loads the standard Next.js environment files, validates the server configuration, and verifies the configured PostgreSQL connection.
- `npm run db:generate` creates a migration after a schema change.
- `npm run db:migrate` applies checked-in migrations.
- `npm run db:studio` opens Drizzle Studio for local inspection.

All commands require `DATABASE_URL`. Timestamps in future schemas must use timezone-aware PostgreSQL types and be stored in UTC.
