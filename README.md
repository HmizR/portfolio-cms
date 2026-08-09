# PortfolioCMS

PortfolioCMS is a self-hosted academic and professional portfolio CMS inspired by the restrained information design of Academic Pages. The repository currently includes the application foundation, responsive public shell, secure single-administrator authentication, and database-backed profile and site settings.

## Foundation stack

- Next.js App Router, React, and strict TypeScript
- Tailwind CSS with shadcn/ui-compatible tokens and aliases
- PostgreSQL with Drizzle ORM
- Zod-validated server environment
- Vitest unit tests and Playwright browser tests
- Docker Compose with the app, PostgreSQL, and S3-compatible MinIO storage

## Prerequisites

- Node.js 20.19 or newer (Node.js 22 LTS recommended)
- npm 10 or newer
- Docker with Docker Compose for local infrastructure or full-container deployment

## Quick start

```bash
npm install
cp .env.example .env.local
docker compose up -d postgres storage storage-init
npm run db:migrate
npm run db:check
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`. Replace all example secrets before using anything beyond local development. Visit <http://localhost:3000/setup> once to create the administrator; after that, setup redirects to sign-in or the protected admin area.

## Administrator access

PortfolioCMS uses Better Auth with database sessions and HttpOnly cookies. There is no default password and the database enforces one administrator. See `docs/authentication.md` for the setup, session, rate-limit, and recovery model.

## Profile and appearance

After creating the administrator, use `/admin/profile` to manage the public identity, biography, avatar URL, and ordered social links. Use `/admin/appearance` to manage the site title, description, accent preset, content width, profile-image shape, and typography preset. The public shell reads these values from PostgreSQL. Navigation remains a temporary fixture until Milestone 5.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Project documentation

- `REQUIREMENTS.md` defines product behavior.
- `ARCHITECTURE.md` defines structural decisions.
- `AGENTS.md` defines the implementation workflow.
- `PROGRESS.md` records implementation status.
- `docs/database.md` documents the database foundation.
- `docs/deployment.md` documents local and container deployment.
- `docs/public-shell.md` documents the temporary public shell and fixture boundary.
- `docs/authentication.md` documents administrator setup and authentication security.
- `docs/profile-settings.md` documents profile, social-link, site-identity, and appearance settings.

Do not begin a later milestone until the current milestone passes its required checks.
