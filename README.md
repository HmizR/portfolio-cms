# PortfolioCMS

PortfolioCMS is a self-hosted academic and professional portfolio CMS inspired by the restrained information design of Academic Pages. The repository currently includes the application foundation, responsive public shell, secure single-administrator authentication, database-backed profile/settings, custom Markdown pages, dynamic navigation, chronological posts with RSS, featured projects, an S3-backed media library, publications, and structured education, experience, and skills.

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

## Posts and tags

Use `/admin/posts` to create, edit, preview, publish, archive, and delete posts. Reusable normalized tags are managed at `/admin/posts/tags`. Published posts appear chronologically at `/posts`, resolve at `/posts/[slug]`, and are included in `/feed.xml`; drafts and archived posts remain unavailable publicly. See `docs/posts.md` for the lifecycle, tag, caching, and RSS model.

## Projects and technologies

Use `/admin/projects` to create, edit, preview, publish, archive, and delete portfolio projects. Reusable normalized technologies are managed at `/admin/projects/technologies`. Projects have a lifecycle state separate from CMS visibility, optional dates and external links, and a featured flag that prioritizes them on `/projects`. See `docs/projects.md` for the project lifecycle, relationships, caching, and managed media behavior.

## Media

Use `/admin/media` to upload, search, select, describe, copy, and delete JPEG, PNG, WebP, GIF, and PDF files. Uploaded objects remain in the private S3-compatible bucket and are delivered through the application by stable media ID. The shared Markdown editor supports the media picker plus image paste and drop upload. See `docs/media.md` for storage, security, and editor integration details.

## Academic portfolio

Use `/admin/publications` to manage publishable scholarly work, ordered authors, DOI/external links, optional Markdown, and managed PDF attachments. Published work appears at `/publications`. Education, experience, and categorized visible skills are managed through their corresponding admin routes with accessible ordering controls. See `docs/academic-portfolio.md` for lifecycle, validation, ordering, and storage details.

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
- `docs/posts.md` documents post publishing, normalized tags, chronological archives, previews, and RSS.
- `docs/projects.md` documents project publishing, lifecycle states, featured ordering, technologies, previews, and links.
- `docs/media.md` documents the media library, private object delivery, upload security, managed image fields, and editor integration.
- `docs/academic-portfolio.md` documents publications, ordered authors, PDF attachments, education, experience, and skills.

Do not begin a later milestone until the current milestone passes its required checks.
