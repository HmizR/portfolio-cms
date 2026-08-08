# PortfolioCMS

PortfolioCMS is a self-hosted academic and professional portfolio CMS inspired by the restrained information design of Academic Pages. The repository currently includes the completed application foundation and responsive public shell; database-backed portfolio features are added incrementally in later milestones.

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
npm run db:check
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`. Replace all example secrets before using anything beyond local development.

## Public shell

The public homepage currently uses realistic temporary fixtures for the owner profile, social links, and navigation. These fixtures intentionally live behind one typed boundary and will be replaced with database data during the Profile + Settings and Navigation milestones. See `docs/public-shell.md` for the component and responsive-layout decisions.

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

Do not begin a later milestone until the current milestone passes its required checks.
