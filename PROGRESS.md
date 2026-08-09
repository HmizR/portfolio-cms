# PROGRESS.md

# PortfolioCMS — Development Progress

Last updated: 2026-08-09

This file is the persistent handoff document for ongoing implementation.

Update this file after meaningful completed work.

Do not use this file as a replacement for requirements or architecture documentation.

---

# 1. Project Status

Current phase:

**Milestone 4 complete / ready for Milestone 5**

Overall status:

**The application foundation, responsive public shell, authentication, profile/settings, and complete custom-page publishing workflow are implemented and validated. Milestone 5 has not started.**

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
- Authentication: Better Auth session-based email/password with the Drizzle PostgreSQL adapter
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
- The database enforces the single-administrator invariant.
- Login throttling is database-backed and keyed by a non-reversible HMAC of the normalized email.
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

Status: **Complete**

Tasks:

- [x] Create users schema
- [x] Add migration
- [x] Implement first-time `/setup`
- [x] Disable setup after admin creation
- [x] Implement login
- [x] Implement logout
- [x] Implement secure password hashing
- [x] Implement sessions
- [x] Protect `/admin/**`
- [x] Protect admin mutations
- [x] Add login rate limiting where practical
- [x] Build admin shell/sidebar
- [x] Add auth tests

Completion checks:

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run test:e2e`
- [x] `npm run build`
- [x] Authentication migration generated, inspected, and applied to development and isolated test databases
- [x] Authentication and deployment documentation updated

---

## Milestone 3 — Profile + Settings

Status: **Complete**

Tasks:

- [x] Add profile schema
- [x] Add social_links schema
- [x] Add site settings model
- [x] Add migrations
- [x] Build profile admin form
- [x] Build social link management
- [x] Build site title/description settings
- [x] Build basic appearance settings
- [x] Replace fixture public profile with database data
- [x] Replace fixture site title with database data

Completion checks:

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run test:e2e`
- [x] `npm run build`
- [x] Profile/settings migration generated, inspected, and applied to development, isolated test, and Compose databases
- [x] Profile/settings, public-shell, database, architecture, README, and progress documentation updated

---

## Milestone 4 — Pages

Status: **Complete**

Tasks:

- [x] Add pages schema
- [x] Add migrations
- [x] Add page validation
- [x] Implement page CRUD
- [x] Implement slug generation
- [x] Implement reserved slug validation
- [x] Implement slug uniqueness
- [x] Create shared Markdown renderer
- [x] Add GFM
- [x] Add code highlighting
- [x] Add KaTeX
- [x] Add Mermaid
- [x] Add safe Markdown sanitization
- [x] Build CodeMirror editor
- [x] Build preview mode
- [x] Build split mode
- [x] Implement autosave with private draft isolation
- [x] Implement draft/published/archived status
- [x] Implement public `/[slug]`
- [x] Implement secure draft preview
- [x] Add page tests

Completion checks:

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run test:e2e`
- [x] `npm run build`
- [x] Page migrations generated, inspected, and applied to development, isolated test, and Compose databases
- [x] Page, Markdown, database, architecture, README, and progress documentation updated

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

**Milestone 4 — Pages is complete. No implementation task is currently in progress.**

Completed page work:

1. `pages` stores unique stable slugs, lifecycle state, publish time, display settings, page metadata, canonical Markdown, and a separate private autosave buffer.
2. `/admin/pages` provides create, list, edit, delete, publish, move-to-draft, and archive workflows; every mutation independently authenticates and validates external input.
3. CodeMirror 6 provides Markdown, preview, split, toolbar, expanded editing, and an autosave indicator. Autosave never changes canonical published content.
4. One sanitized Markdown pipeline provides GFM, footnotes, heading anchors, server-side Shiki highlighting, KaTeX, and strict Mermaid rendering.
5. Published pages render through the restrained public shell at `/[slug]`; drafts and archived pages return 404.
6. Protected previews use the real public presentation, show current autosaved drafts, require an administrator session, and opt out of indexing.
7. Explicit page mutations invalidate the shared public-page cache and affected old/new slug routes.
8. Unit tests cover slug/validation/Markdown behavior and unsafe content. Playwright covers create, autosave, protected preview, publish, private published-page autosave, archive, and delete.
9. Navigation remains a fixture until Milestone 5; editor uploads and the media picker remain Milestone 8 work.

Next recommended task: **Milestone 5 — Navigation**. It has not been started.

---

# 7. Known Issues

- `npm audit --omit=dev` reports five moderate development-server advisories through Drizzle Kit's deprecated nested `@esbuild-kit`/esbuild dependency. Better Auth's optional Drizzle Kit peer makes npm include the tooling path in the omit-dev report; the vulnerable package is not used by the production application runtime, and npm offers only a breaking Drizzle Kit downgrade as an automated fix.
- The host currently uses Node.js 20.12.2, below the dependency toolchain's declared Node.js 20.19 minimum. Validation passes on the host, while the production Dockerfile uses Node.js 22.

---

# 8. Open Questions

These do not block the next milestone unless discovered to matter during implementation.

- Whether dark mode ships in V1 or immediately after V1.
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

Milestone 2 — 2026-08-08

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (5 files, 9 tests, including validation and password hashing)
- `npm run test:e2e`: PASS (4 Chromium tests; auth coverage includes setup, session cookie isolation, admin protection, invalid and valid login, logout, and rate limiting)
- `npm run build`: PASS (`/login`, `/setup`, and `/admin` confirmed dynamic)
- `npm run db:generate`: PASS (`drizzle/0000_fantastic_vengeance.sql`, 5 authentication tables)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database creation and migration: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS
- `docker compose build app migrate`: PASS (Node 22 production application and one-shot migration images)
- `docker compose run --rm migrate`: PASS against the healthy Compose PostgreSQL service
- In-app browser manual inspection: UNAVAILABLE because no browser tab was exposed; automated Chromium rendering and interaction checks passed
- `npm audit --omit=dev`: 5 moderate tooling-only esbuild advisories through Drizzle Kit; no production application code path is affected

Milestone 3 — 2026-08-09

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (6 files, 11 tests, including profile/appearance validation and unsafe URL rejection)
- `npm run test:e2e`: PASS (4 Chromium tests; profile/social and appearance updates are verified on the public site)
- `npm run build`: PASS (public routes intentionally render on demand; database reads are cached and deferred until runtime)
- `npm run db:generate`: PASS (`drizzle/0001_public_chameleon.sql`; final schema check reports no further changes)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database migration: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS
- `docker compose build app migrate`: PASS after verifying image compilation does not require a live database
- `docker compose run --rm migrate`: PASS against the healthy Compose PostgreSQL service
- In-app browser manual inspection: UNAVAILABLE because the browser connection timed out twice; automated Chromium rendering and interaction checks passed

Milestone 3 appearance-state follow-up — 2026-08-09

- Fixed appearance fields reverting visually to their pre-submit defaults after a successful Server Action.
- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (6 files, 11 tests)
- Focused Playwright profile/appearance flow: PASS, including immediate post-save and full-reload value assertions
- `npm run build`: PASS

Milestone 4 — 2026-08-09

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (9 files, 17 tests; page coverage includes slugs, validation, GFM, anchors, Shiki, KaTeX, Mermaid, raw-HTML removal, and unsafe URL removal)
- `npm run test:e2e`: PASS (5 Chromium tests; the serial publishing flow covers create, CodeMirror editing, autosave, secure preview, publish, private autosave isolation, archive, and delete)
- `npm run build`: PASS (all page and preview routes are dynamic and the build does not require a live database)
- `npm run db:generate`: PASS (`drizzle/0002_boring_madame_web.sql` and `drizzle/0003_brown_wiccan.sql`; final schema check reports no further changes)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database creation and migration: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS
- `docker compose build app migrate`: PASS (Node 22 standalone application and migration images)
- `docker compose run --rm migrate`: PASS against the healthy Compose PostgreSQL service
- Compose `postgres` and `storage` services: RUNNING and HEALTHY
- In-app browser manual inspection: UNAVAILABLE because browser discovery and its recovery guidance both timed out; the complete standalone Playwright rendering and interaction suite passed
- `npm audit --omit=dev`: 5 moderate tooling-only esbuild advisories through Drizzle Kit; npm still offers only a breaking Drizzle Kit downgrade as an automated fix

---

# 11. Important Handoff Notes

Any future coding session should:

1. Read `AGENTS.md`.
2. Read `REQUIREMENTS.md`.
3. Read `ARCHITECTURE.md`.
4. Read this file.
5. Inspect the repository before making changes.
6. Begin Milestone 4 only when it is the requested scope.
7. Avoid prematurely implementing later milestones.
8. Update this file before ending meaningful work.

Milestone 0 handoff decisions:

- Do not add tables to the empty Drizzle schema until the owning milestone requires them.
- Use checked-in Drizzle migrations for schema changes; do not use destructive schema push for deployment.
- Keep all environment reads behind `src/lib/env/server.ts`, except tooling configuration and conventional `NODE_ENV` checks.
- Standalone CLI tools must use the framework-neutral `src/db/client.ts` factory instead of importing the Next.js `server-only` database entry point.

Milestone 1 handoff decisions:

- Profile and site fixture replacement was completed in Milestone 3; only navigation remains in `src/features/public-shell/public-shell.fixtures.ts`.
- Replace fixture navigation with database navigation in Milestone 5; do not scatter fixture imports into public components.
- Keep the public shell server-rendered. Add a Client Component only when interaction cannot be expressed accessibly with native HTML.
- Public defaults use a system sans-serif body stack, Georgia headings, and a restrained teal accent through controlled tokens.
- Preserve the route-group boundary so future admin styling does not leak into public presentation.

Milestone 2 handoff decisions:

- Keep Better Auth server-only; no public catch-all signup route is mounted.
- Keep `/login` and `/setup` dynamic because both depend on current database/session state.
- Protect every future admin mutation with `requireAdmin()` even when its page already lives under the protected layout.
- Do not remove the `users.singleton_key` constraint; it is the race-safe single-administrator enforcement boundary.
- Use `TEST_DATABASE_URL` only for a database ending in `_test`; the E2E bootstrap intentionally truncates authentication tables there.
- Profile and settings persistence is kept in its own Milestone 3 tables; authentication setup only initializes those records after creating the administrator.
- Drizzle commands load the standard Next.js environment files through `drizzle.config.ts`; developers do not need to export `DATABASE_URL` separately when `.env.local` is configured.

Milestone 3 handoff decisions:

- Keep `profiles` and `site_settings` singletons while V1 remains single-administrator.
- Keep social networks flexible; do not replace `social_links` with fixed platform columns or a platform enum.
- Keep public profile/site reads behind `getPublicSiteData()` so request-time deferral, cache tagging, and invalidation remain centralized.
- Navigation remains the only public-shell fixture and is owned by Milestone 5.
- The avatar URL is an intentional bridge to Milestone 8; future uploads must replace it through the storage abstraction rather than adding storage code to the profile feature.
- Appearance values remain controlled tokens. Dark mode is still an open product decision, not an unfinished Milestone 3 requirement.

Milestone 4 handoff decisions:

- Keep `content_markdown` canonical and `draft_markdown` private. Autosave must never write public content directly; explicit save/lifecycle actions promote the editor value and clear the draft.
- Keep all later Markdown consumers on `src/lib/markdown/render.ts`. Do not add separate public, admin-preview, or content-type renderers.
- Normalize timestamp values after the Next.js public-page cache boundary because cached values are serialized before being returned to application code.
- Keep raw HTML disabled and Mermaid in strict mode. Shiki remains server-side; only diagram rendering is dynamically loaded in the browser when required.
- Keep page navigation on the fixture until Milestone 5. Do not attach pages to the navbar before navigation ordering, visibility, and destination integrity are implemented.
- Keep URL-based image insertion as the Milestone 4 boundary. Uploads, drag/drop, clipboard images, and the media picker belong to Milestone 8 and must use the storage abstraction.
- The external page Open Graph image URL is an interim bridge. Replace it with a media relationship in Milestone 8 without duplicating the later shared SEO architecture from Milestone 11.
