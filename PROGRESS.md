# PROGRESS.md

# PortfolioCMS — Development Progress

Last updated: 2026-08-08

This file is the persistent handoff document for ongoing implementation.

Update this file after meaningful completed work.

Do not use this file as a replacement for requirements or architecture documentation.

---

# 1. Project Status

Current phase:

**Milestone 0 complete / ready for Milestone 1**

Overall status:

**The production-ready application foundation is implemented and validated. Milestone 1 has not started.**

---

# 2. Product Goal

Build a self-hosted academic/professional portfolio CMS inspired by Academic Pages.

The public site should preserve a restrained academic portfolio layout while the admin panel provides browser-based management of content, navigation, profile, Markdown, projects, publications, CV, media, SEO, and site settings.

---

# 3. Core Technology Decisions

Current decisions:

- Framework: Next.js App Router
- Language: TypeScript
- Database: PostgreSQL
- ORM: Drizzle ORM
- Authentication: session-based email/password
- Admin UI: shadcn/ui
- Public UI: Tailwind + custom Academic Pages-inspired styling
- Markdown editor: CodeMirror 6
- Markdown renderer: unified/remark/rehype
- Code highlighting: Shiki
- Math: KaTeX
- Diagrams: Mermaid
- Validation: Zod
- Forms: React Hook Form where useful
- Object storage: S3-compatible
- Local object storage: RustFS or compatible implementation
- Tests: Vitest + Playwright
- Deployment: Docker / Docker Compose

---

# 4. Architectural Decisions

Confirmed:

- Modular monolith.
- No microservices.
- No Redis in V1.
- No worker service in V1.
- No Elasticsearch in V1.
- Public content is data-driven.
- Markdown is canonical long-form content.
- Public and admin design systems remain visually distinct.
- S3 storage is abstracted behind a provider interface.
- Public URLs use slugs.
- Database relations use stable IDs.
- V1 has one logical administrator role.
- Content statuses are draft, published, archived.
- Scheduled publishing is future work.
- Raw HTML in Markdown is disabled by default.
- Full visual page builder is out of scope.

---

# 5. Milestone Status

## Milestone 0 — Foundation

Status: **Complete**

Tasks:

- [x] Initialize Next.js project
- [x] Enable strict TypeScript
- [x] Configure Tailwind CSS
- [x] Configure shadcn/ui
- [x] Add PostgreSQL
- [x] Configure Drizzle ORM
- [x] Create Dockerfile
- [x] Create docker-compose.yml
- [x] Add S3-compatible local storage service
- [x] Add environment validation
- [x] Create `.env.example`
- [x] Configure lint
- [x] Configure formatter if used (no separate formatter selected; ESLint is the code-quality baseline)
- [x] Configure Vitest
- [x] Configure Playwright
- [x] Add initial health/startup verification
- [x] Verify production build
- [x] Update README

Completion checks:

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run build`

---

## Milestone 1 — Public Shell

Status: **Not started**

Tasks:

- [ ] Build public site header
- [ ] Build temporary fixture navigation
- [ ] Build profile sidebar
- [ ] Build main content layout
- [ ] Build footer
- [ ] Implement typography
- [ ] Implement Academic Pages-inspired spacing
- [ ] Implement responsive desktop/mobile layout
- [ ] Add skip-to-content
- [ ] Add public empty/error states where relevant
- [ ] Add visual baseline screenshots if useful

---

## Milestone 2 — Authentication

Status: **Not started**

Tasks:

- [ ] Create users schema
- [ ] Add migration
- [ ] Implement first-time `/setup`
- [ ] Disable setup after admin creation
- [ ] Implement login
- [ ] Implement logout
- [ ] Implement secure password hashing
- [ ] Implement sessions
- [ ] Protect `/admin/**`
- [ ] Protect admin mutations
- [ ] Add login rate limiting where practical
- [ ] Build admin shell/sidebar
- [ ] Add auth tests

---

## Milestone 3 — Profile + Settings

Status: **Not started**

Tasks:

- [ ] Add profile schema
- [ ] Add social_links schema
- [ ] Add site settings model
- [ ] Add migrations
- [ ] Build profile admin form
- [ ] Build social link management
- [ ] Build site title/description settings
- [ ] Build basic appearance settings
- [ ] Replace fixture public profile with database data
- [ ] Replace fixture site title with database data

---

## Milestone 4 — Pages

Status: **Not started**

Tasks:

- [ ] Add pages schema
- [ ] Add migration
- [ ] Add page validation
- [ ] Implement page CRUD
- [ ] Implement slug generation
- [ ] Implement reserved slug validation
- [ ] Implement slug uniqueness
- [ ] Create shared Markdown renderer
- [ ] Add GFM
- [ ] Add code highlighting
- [ ] Add KaTeX
- [ ] Add Mermaid
- [ ] Add safe Markdown sanitization
- [ ] Build CodeMirror editor
- [ ] Build preview mode
- [ ] Build split mode
- [ ] Implement autosave
- [ ] Implement draft/published/archived status
- [ ] Implement public `/[slug]`
- [ ] Implement secure draft preview
- [ ] Add page tests

---

## Milestone 5 — Navigation

Status: **Not started**

Tasks:

- [ ] Add navigation_items schema
- [ ] Add migration
- [ ] Implement navigation CRUD
- [ ] Implement item visibility
- [ ] Implement open-new-tab
- [ ] Implement internal/system/external destinations
- [ ] Implement drag reordering
- [ ] Implement keyboard-accessible reordering
- [ ] Persist sort order transactionally
- [ ] Replace fixture public nav with database nav
- [ ] Add navigation tests

---

## Milestone 6 — Posts

Status: **Not started**

Tasks:

- [ ] Add posts schema
- [ ] Add tags schema
- [ ] Add post_tags schema
- [ ] Add migrations
- [ ] Implement post CRUD
- [ ] Implement tag management
- [ ] Implement post editor
- [ ] Implement post archive
- [ ] Implement post detail
- [ ] Implement chronological presentation
- [ ] Implement RSS feed
- [ ] Add post tests

---

## Milestone 7 — Projects

Status: **Not started**

Tasks:

- [ ] Add projects schema
- [ ] Add technologies schema
- [ ] Add project_technologies schema
- [ ] Add migrations
- [ ] Implement project CRUD
- [ ] Implement technologies
- [ ] Implement project lifecycle status
- [ ] Implement featured projects
- [ ] Implement project index
- [ ] Implement project detail
- [ ] Add project tests

---

## Milestone 8 — Media

Status: **Not started**

Tasks:

- [ ] Add media schema
- [ ] Add migration
- [ ] Create storage provider interface
- [ ] Create S3 provider
- [ ] Configure local object storage
- [ ] Create bucket bootstrap/documentation
- [ ] Validate file MIME types
- [ ] Validate file sizes
- [ ] Generate storage keys
- [ ] Build upload flow
- [ ] Build media library
- [ ] Implement deletion
- [ ] Implement alt text editing
- [ ] Implement media picker
- [ ] Integrate image insertion into Markdown editor
- [ ] Implement drag/drop image upload
- [ ] Implement clipboard paste image upload
- [ ] Add media tests

---

## Milestone 9 — Academic Portfolio

Status: **Not started**

Tasks:

### Publications

- [ ] Add publications schema
- [ ] Add publication_authors schema
- [ ] Add migrations
- [ ] Implement publication CRUD
- [ ] Implement publication types
- [ ] Implement author ordering
- [ ] Implement PDF attachment
- [ ] Implement publication index
- [ ] Implement publication detail

### Education

- [ ] Add education schema
- [ ] Add migration
- [ ] Implement education CRUD
- [ ] Implement ordering

### Experience

- [ ] Add experience schema
- [ ] Add migration
- [ ] Implement experience CRUD
- [ ] Implement ordering

### Skills

- [ ] Add skills schema
- [ ] Add migration
- [ ] Implement skill CRUD
- [ ] Implement skill categories/order

---

## Milestone 10 — CV

Status: **Not started**

Tasks:

- [ ] Add CV section configuration
- [ ] Add migration if required
- [ ] Implement CV section ordering
- [ ] Implement visibility
- [ ] Implement selected project configuration
- [ ] Build `/cv`
- [ ] Add print stylesheet
- [ ] Verify print/PDF output

---

## Milestone 11 — SEO

Status: **Not started**

Tasks:

- [ ] Add global SEO configuration
- [ ] Add shared metadata helpers
- [ ] Add page metadata
- [ ] Add post metadata
- [ ] Add project metadata
- [ ] Add publication metadata
- [ ] Add canonical URLs
- [ ] Add Open Graph
- [ ] Add JSON-LD
- [ ] Add sitemap
- [ ] Add robots
- [ ] Add SEO tests

---

## Milestone 12 — Portability

Status: **Not started**

Tasks:

- [ ] Define export format v1
- [ ] Add export manifest
- [ ] Export page Markdown
- [ ] Export post Markdown
- [ ] Export project Markdown
- [ ] Export publication Markdown
- [ ] Export settings
- [ ] Export media
- [ ] Generate ZIP
- [ ] Document format
- [ ] Add export tests

---

## Milestone 13 — Hardening

Status: **Not started**

Tasks:

- [ ] Security review
- [ ] Accessibility review
- [ ] Responsive review
- [ ] Error-state review
- [ ] Empty-state review
- [ ] Performance review
- [ ] Public bundle review
- [ ] Upload security review
- [ ] Authentication review
- [ ] Critical E2E flow
- [ ] Additional E2E coverage
- [ ] Lighthouse review
- [ ] Production Docker test
- [ ] Fresh install test
- [ ] Seed demo test
- [ ] Documentation review
- [ ] README screenshots
- [ ] Final V1 checklist

---

# 6. Current Task

**Milestone 0 — Foundation is complete. No implementation task is currently in progress.**

Completed foundation:

1. Next.js 16 App Router, React 19, strict TypeScript, and Tailwind CSS 4 are configured.
2. shadcn/ui aliases, design tokens, and utility dependencies are configured without adding admin features early.
3. PostgreSQL access, Drizzle configuration, migration scripts, and a connection-check command are present.
4. The Drizzle schema entry point is intentionally empty until domain-owning milestones add tables and migrations.
5. Docker Compose defines the app, PostgreSQL, MinIO S3-compatible storage, and idempotent bucket initialization.
6. All server environment values are centralized and validated with Zod.
7. Vitest unit tests cover health and environment validation; Playwright covers application startup and the health endpoint.
8. README, database documentation, and deployment documentation describe local and container workflows.

Next recommended task: **Milestone 1 — Public Shell**. It has not been started.

---

# 7. Known Issues

- `npm audit --omit=dev` reports zero runtime vulnerabilities. The full development dependency audit reports four moderate advisories from Drizzle Kit's deprecated nested `@esbuild-kit`/esbuild dependency; the installed Drizzle Kit version is the current stable line, and npm offers only a breaking downgrade as an automated fix.
- The host currently uses Node.js 20.12.2, below the dependency toolchain's declared Node.js 20.19 minimum. Validation passes on the host, while the production Dockerfile uses Node.js 22.

---

# 8. Open Questions

These do not block Milestone 0 unless discovered to matter during setup.

- Exact public font stack.
- Exact accent color defaults.
- Whether dark mode ships in V1 or immediately after V1.
- Whether Better Auth is selected after confirming current compatibility with the chosen Next.js version.
- Exact content revision design for V2.

Do not stop implementation for these unless the current milestone genuinely depends on them.

---

# 9. Deferred Features

Future work:

- Revision history
- Scheduled publishing
- PostgreSQL full-text search
- Analytics
- Multiple administrators
- Multiple themes
- Public API
- Full import
- Academic Pages importer
- Server-generated CV PDF
- Advanced content scheduling
- Search UI

---

# 10. Validation History

2026-08-08

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (3 files, 5 tests)
- `npm run test:e2e`: PASS (1 Chromium smoke test)
- `npm run build`: PASS (Next.js production build)
- `npm run db:generate`: PASS (configuration loaded; 0 tables and no migration, as expected)
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config`: PASS
- Compose `postgres` and `storage` services: RUNNING and HEALTHY
- `npm audit --omit=dev`: PASS (0 runtime vulnerabilities)

---

# 11. Important Handoff Notes

Any future coding session should:

1. Read `AGENTS.md`.
2. Read `REQUIREMENTS.md`.
3. Read `ARCHITECTURE.md`.
4. Read this file.
5. Inspect the repository before making changes.
6. Begin Milestone 1 only when it is the requested scope.
7. Avoid prematurely implementing later milestones.
8. Update this file before ending meaningful work.

Milestone 0 handoff decisions:

- Do not add tables to the empty Drizzle schema until the owning milestone requires them.
- Use checked-in Drizzle migrations for schema changes; do not use destructive schema push for deployment.
- Keep all environment reads behind `src/lib/env/server.ts`, except tooling configuration and conventional `NODE_ENV` checks.
- Standalone CLI tools must use the framework-neutral `src/db/client.ts` factory instead of importing the Next.js `server-only` database entry point.
- Do not replace the neutral foundation page with the public shell until Milestone 1 begins.
