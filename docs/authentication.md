# Authentication

Milestone 2 implements one logical PortfolioCMS administrator with Better Auth, PostgreSQL, and the Drizzle adapter.

## First-time setup

1. Apply migrations with `npm run db:migrate` (automatic when using Docker Compose).
2. Start PortfolioCMS and visit `/setup`.
3. Create the administrator with a name, email address, and password of 12–128 characters.

There is no default password and no public signup route. Once a user exists, `/setup` redirects to `/login` or `/admin`. A database check constraint plus a unique singleton index prevents a second administrator even if concurrent setup requests race.

## Sessions and protection

- Password hashing is delegated to Better Auth's maintained password implementation; plaintext passwords are never persisted or logged.
- Sessions are opaque database records represented by HttpOnly, SameSite cookies. Production cookies are Secure.
- Sessions expire after 30 days and are refreshed at most once per day.
- The `/admin` layout performs a database-backed session check, which protects every nested admin route.
- Every protected mutation must call the centralized `requireAdmin()` guard independently. The current logout mutation does so.
- Login is rate-limited to five attempts per 15-minute window using the shared PostgreSQL `rate_limits` table. The limiter stores a keyed hash rather than the administrator email and resets after a successful login.

## Recovery

V1 intentionally has no password-reset email flow. For a self-hosted installation, account recovery is an operator procedure requiring direct database access and a deliberate administrative intervention. Do not delete the administrator casually: related sessions and credentials cascade, and the installation will return to first-time setup state.

## Environment

- `AUTH_SECRET`: random secret with at least 32 characters; changing it invalidates authentication state.
- `APP_URL`: the exact public application origin.
- `DATABASE_URL`: PostgreSQL connection used for users, credentials, sessions, and rate limits.
- `TEST_DATABASE_URL`: optional isolated `_test` database used by Playwright.
