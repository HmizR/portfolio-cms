# Database foundation

PortfolioCMS uses PostgreSQL through Drizzle ORM and the `pg` driver.

The schema entry point is `src/db/schema/index.ts`. Milestone 2 owns the authentication tables, Milestone 3 adds profile and site settings, Milestone 4 adds `pages`, Milestone 5 adds `navigation_items`, and Milestone 6 adds `posts`, `tags`, and `post_tags`. Later domain tables are introduced only by their owning milestones. Production deployment must use `npm run db:migrate`; destructive schema push is not a deployment workflow.

`profiles` and `site_settings` use database-enforced singleton keys because PortfolioCMS V1 has one owner. A profile belongs to the administrator, and social links belong to the profile with cascade deletion, non-negative ordering, and unique URLs per profile. Appearance values are constrained to the supported application presets. Migration `0001_public_chameleon.sql` also initializes profile and site rows for an administrator created before Milestone 3.

The `pages` table has a database-unique slug and a checked draft/published/archived status. Timezone-aware `published_at` records the first publication time. `content_markdown` is canonical explicitly saved content; nullable `draft_markdown` isolates editor autosaves so they cannot silently alter an already-published page. Migrations `0002_boring_madame_web.sql` and `0003_brown_wiccan.sql` introduce the table and that draft boundary.

The `navigation_items` table stores labels, finite destination types, optional page/URL targets, contiguous non-negative sort positions, visibility, and new-tab behavior. A database check enforces the destination shape, and page references cascade on deletion. Migration `0004_previous_madelyne_pryor.sql` introduces the table.

The `posts` table uses unique slugs, checked lifecycle states, timezone-aware first-publication timestamps, canonical Markdown, and an isolated private autosave buffer. A database check requires every published row to have `published_at`. `tags` has case-insensitive unique names and unique slugs. `post_tags` uses stable IDs, cascading foreign keys, and a composite primary key so a tag cannot be assigned twice. Migration `0005_true_marauders.sql` introduces all three tables.

## Commands

- `npm run db:check` loads the standard Next.js environment files, validates the server configuration, and verifies the configured PostgreSQL connection.
- `npm run db:generate` creates a migration after a schema change.
- `npm run db:migrate` applies checked-in migrations.
- `npm run db:studio` opens Drizzle Studio for local inspection.

All commands require `DATABASE_URL` and load the standard Next.js environment files, including `.env.local`. Authentication timestamps use timezone-aware PostgreSQL types and are stored in UTC.

Playwright uses `TEST_DATABASE_URL` when supplied. Its database name must end in `_test`; when omitted locally, the test runner derives a sibling `_test` database from `DATABASE_URL`. It creates that database if necessary, applies checked-in migrations, and truncates the owned application tables before the run.
