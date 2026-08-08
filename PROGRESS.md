# PROGRESS.md

# PortfolioCMS — Development Progress

Last updated: 2026-08-08

This file is the persistent handoff document for ongoing implementation.

Update this file after meaningful completed work.

Do not use this file as a replacement for requirements or architecture documentation.

---

# 1. Project Status

Current phase:

**Milestone 1 complete / ready for Milestone 2**

Overall status:

**The application foundation and responsive public shell are implemented and validated. Milestone 2 has not started.**

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

Status: **Complete**

Tasks:

- [x] Build public site header
- [x] Build temporary fixture navigation
- [x] Build profile sidebar
- [x] Build main content layout
- [x] Build footer
- [x] Implement typography
- [x] Implement Academic Pages-inspired spacing
- [x] Implement responsive desktop/mobile layout
- [x] Add skip-to-content
- [x] Add public empty/error states where relevant (intentional public 404; no data-driven empty states exist yet)
- [x] Evaluate visual baselines (responsive Playwright viewport assertions used; no screenshot files committed)

Completion checks:

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run test:e2e`
- [x] `npm run build`
- [x] Database migration not applicable because the milestone has no schema changes

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

**Milestone 1 — Public Shell is complete. No implementation task is currently in progress.**

Completed public shell:

1. A server-rendered public route-group layout owns the public header, profile sidebar, readable content column, and footer.
2. Temporary navigation, profile, site, and social-link fixtures live behind one typed boundary for later database replacement.
3. The desktop two-column shell collapses into a stacked mobile layout without horizontal overflow.
4. Mobile navigation uses a native keyboard-operable disclosure and adds no client-side JavaScript.
5. The shell includes a skip link, visible focus states, semantic landmarks, reduced-motion handling, and accessible external-link notices.
6. The homepage uses restrained academic typography, spacing, and text-first sample content rather than dashboard or card-heavy presentation.
7. A public 404 state reuses the same shell and returns the correct HTTP status.
8. README and `docs/public-shell.md` document the fixture boundary and responsive architecture.

Next recommended task: **Milestone 2 — Authentication**. It has not been started.

---

# 7. Known Issues

- `npm audit --omit=dev` reports zero runtime vulnerabilities. The full development dependency audit reports four moderate advisories from Drizzle Kit's deprecated nested `@esbuild-kit`/esbuild dependency; the installed Drizzle Kit version is the current stable line, and npm offers only a breaking downgrade as an automated fix.
- The host currently uses Node.js 20.12.2, below the dependency toolchain's declared Node.js 20.19 minimum. Validation passes on the host, while the production Dockerfile uses Node.js 22.

---

# 8. Open Questions

These do not block the next milestone unless discovered to matter during implementation.

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

Milestone 1 — 2026-08-08

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (3 files, 5 tests)
- `npm run test:e2e`: PASS (3 Chromium tests covering desktop shell, keyboard/mobile behavior, responsive overflow, health, and 404)
- `npm run build`: PASS (static public homepage and public not-found UI)
- Database migration: NOT APPLICABLE (no schema changes)
- In-app browser manual inspection: UNAVAILABLE because no browser backend was exposed in the session; automated Chromium rendering checks passed

---

# 11. Important Handoff Notes

Any future coding session should:

1. Read `AGENTS.md`.
2. Read `REQUIREMENTS.md`.
3. Read `ARCHITECTURE.md`.
4. Read this file.
5. Inspect the repository before making changes.
6. Begin Milestone 2 only when it is the requested scope.
7. Avoid prematurely implementing later milestones.
8. Update this file before ending meaningful work.

Milestone 0 handoff decisions:

- Do not add tables to the empty Drizzle schema until the owning milestone requires them.
- Use checked-in Drizzle migrations for schema changes; do not use destructive schema push for deployment.
- Keep all environment reads behind `src/lib/env/server.ts`, except tooling configuration and conventional `NODE_ENV` checks.
- Standalone CLI tools must use the framework-neutral `src/db/client.ts` factory instead of importing the Next.js `server-only` database entry point.

Milestone 1 handoff decisions:

- Replace `src/features/public-shell/public-shell.fixtures.ts` profile/site values with database data in Milestone 3.
- Replace fixture navigation with database navigation in Milestone 5; do not scatter fixture imports into public components.
- Keep the public shell server-rendered. Add a Client Component only when interaction cannot be expressed accessibly with native HTML.
- Public defaults use a system sans-serif body stack, Georgia headings, and a restrained teal accent through controlled tokens.
- Preserve the route-group boundary so future admin styling does not leak into public presentation.
