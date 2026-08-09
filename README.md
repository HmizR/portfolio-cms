# PortfolioCMS

PortfolioCMS is a self-hosted academic and professional portfolio CMS inspired by the restrained information design of Academic Pages. The repository currently includes the application foundation, responsive public shell, secure single-administrator authentication, database-backed profile/settings, custom Markdown pages, and dynamic navigation.

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

After creating the administrator, use `/admin/profile` to manage the public identity, biography, avatar URL, and ordered social links. Use `/admin/appearance` to manage the site title, description, accent preset, content width, profile-image shape, and typography preset. The public shell reads these values from PostgreSQL.

## Pages

Use `/admin/pages` to create, edit, preview, publish, archive, and delete custom pages. Page content is portable Markdown edited with CodeMirror and rendered through the shared GFM, Shiki, KaTeX, and Mermaid pipeline. Published pages are available at `/[slug]`; autosaved changes stay private until an explicit save or lifecycle action. See `docs/pages.md` for lifecycle and security details.

## Navigation

Use `/admin/navigation` to add page, built-in, or external links; control visibility and new-tab behavior; and reorder items with drag-and-drop or accessible arrow controls. The public header reads only ordered visible items from PostgreSQL and automatically omits page links whose target is not published.

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
- `docs/public-shell.md` documents the responsive, database-driven public shell.
- `docs/authentication.md` documents administrator setup and authentication security.
- `docs/profile-settings.md` documents profile, social-link, site-identity, and appearance settings.
- `docs/pages.md` documents custom-page lifecycle, autosave isolation, the editor, and Markdown rendering.
- `docs/navigation.md` documents destination integrity, public visibility, link behavior, and transactional ordering.

Do not begin a later milestone until the current milestone passes its required checks.
