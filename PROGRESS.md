# PROGRESS.md

# PortfolioCMS — Development Progress

Last updated: 2026-08-11

This file is the persistent handoff document for ongoing implementation.

Update this file after meaningful completed work.

Do not use this file as a replacement for requirements or architecture documentation.

---

# 1. Project Status

Current phase:

**Milestone 7 complete / ready for Milestone 8**

Overall status:

**The application foundation, responsive public shell, authentication, profile/settings, pages, navigation, posts/RSS, and featured portfolio projects with normalized technologies are implemented and validated. Milestone 8 has not started.**

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
- Post Markdown autosave is private and separate from canonical published content, matching the page publication boundary.
- Tags are normalized rows related to posts by stable IDs and updated transactionally with post content.
- Project lifecycle is independent from CMS publication state; project technologies are normalized and updated transactionally with project content.

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

Status: **Complete**

Tasks:

- [x] Add navigation_items schema
- [x] Add migration
- [x] Implement navigation CRUD
- [x] Implement item visibility
- [x] Implement open-new-tab
- [x] Implement internal/system/external destinations
- [x] Implement drag reordering
- [x] Implement keyboard-accessible reordering
- [x] Persist sort order transactionally
- [x] Replace fixture public nav with database nav
- [x] Add navigation tests

Completion checks:

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run test:e2e`
- [x] `npm run build`
- [x] Navigation migration generated, inspected, and applied to development, isolated test, and Compose databases
- [x] Navigation, public-shell, pages, database, architecture, README, and progress documentation updated

---

## Milestone 6 — Posts

Status: **Complete**

Tasks:

- [x] Add posts schema
- [x] Add tags schema
- [x] Add post_tags schema
- [x] Add migrations
- [x] Implement post CRUD
- [x] Implement tag management
- [x] Implement post editor
- [x] Implement post archive
- [x] Implement post detail
- [x] Implement chronological presentation
- [x] Implement RSS feed
- [x] Add post tests
- [x] Verify migration against development and isolated test databases
- [x] Update posts, database, architecture, README, and progress documentation

---

## Milestone 7 — Projects

Status: **Complete**

Tasks:

- [x] Add projects schema
- [x] Add technologies schema
- [x] Add project_technologies schema
- [x] Add migrations
- [x] Implement project CRUD
- [x] Implement technologies
- [x] Implement project lifecycle status
- [x] Implement featured projects
- [x] Implement project index
- [x] Implement project detail
- [x] Add project tests
- [x] Verify migration against development and isolated test databases
- [x] Update projects, database, architecture, README, and progress documentation

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

**Milestone 7 — Projects is complete. No implementation task is currently in progress.**

Completed project work:

1. `projects` stores summary, canonical/private Markdown, checked CMS and project lifecycle states, featured state, optional dates, validated external links, cover/social image bridges, and content SEO overrides.
2. Database checks enforce project lifecycle values, public publication timestamps, valid date ordering, and unique slugs.
3. `technologies` uses case-insensitive unique names and unique slugs; `project_technologies` uses cascading UUID relationships, a composite primary key, and non-negative ordering.
4. `/admin/projects` provides CRUD and CMS lifecycle management. `/admin/projects/technologies` provides technology create, rename, delete, conflict handling, and usage counts.
5. The shared CodeMirror and Markdown pipeline now serves projects. Autosave remains private, previews require authentication, and every mutation independently authenticates and validates input.
6. Project content and complete technology assignments update transactionally. Draft and CMS-archived projects are excluded from public reads regardless of project lifecycle status.
7. `/projects` renders a restrained featured-first, recency-aware project index; `/projects/[slug]` renders lifecycle, dates, technologies, safe external links, and Markdown.
8. Public project reads share targeted cache invalidation across index, detail, lifecycle, and technology changes.
9. The admin overview now includes project count, featured project count, projects in draft totals/recent content, and a project quick action.
10. Unit tests cover lifecycle/date/URL/relationship validation. Playwright covers technology CRUD/conflicts, project slug conflicts, autosave isolation, secure preview, featured ordering, project/CMS lifecycle independence, links, archive removal, and cascade cleanup.

Next recommended task: **Milestone 8 — Media**. It has not been started.

---

# 7. Known Issues

- `npm audit --omit=dev` reports five moderate development-server advisories through Drizzle Kit's deprecated nested `@esbuild-kit`/esbuild dependency. Better Auth's optional Drizzle Kit peer makes npm include the tooling path in the omit-dev report; the vulnerable package is not used by the production application runtime, and npm offers only a breaking Drizzle Kit downgrade as an automated fix.
- The host currently uses Node.js 20.12.2, below the dependency toolchain's declared Node.js 20.19 minimum. Validation passes on the host, while the production Dockerfile uses Node.js 22.
- Docker Desktop's BuildKit worker returned `DeadlineExceeded` during the Milestone 6 container-image verification. Compose configuration and the running PostgreSQL/storage services remain healthy, but both BuildKit and legacy image-build attempts stalled until their bounded timeouts. Retry the image build after restarting Docker Desktop; do not treat this host builder condition as an application build failure.

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

Milestone 5 — 2026-08-09

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (11 files, 22 tests; navigation coverage includes destination integrity, unsafe external URLs, duplicate reorder IDs, built-in route mapping, and published-page filtering)
- `npm run test:e2e`: PASS (5 Chromium tests; the critical flow covers page publishing, page/external/system navigation CRUD, native drag ordering, keyboard ordering, persisted visibility, navbar order/new-tab behavior, archive removal, and page-delete cascade cleanup)
- `npm run build`: PASS (`/admin/navigation` and all public routes render dynamically without requiring a live database during image compilation)
- `npm run db:generate`: PASS (`drizzle/0004_previous_madelyne_pryor.sql`; final schema check reports no further changes)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database creation and migration: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS
- `docker compose build app migrate`: PASS (Node 22 standalone application and migration images)
- `docker compose run --rm migrate`: PASS against the healthy Compose PostgreSQL service
- Compose `postgres` and `storage` services: RUNNING and HEALTHY
- In-app browser manual inspection: UNAVAILABLE because browser discovery and its recovery guidance both timed out; the complete standalone Playwright desktop/mobile rendering and interaction suite passed
- `npm audit --omit=dev`: 5 moderate tooling-only esbuild advisories through Drizzle Kit; npm still offers only a breaking Drizzle Kit downgrade as an automated fix

Milestone 6 — 2026-08-10

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (13 files, 25 tests; post coverage includes optional-field normalization, unsafe URL rejection, tag uniqueness validation, XML escaping, absolute RSS links, dates, and categories)
- Focused post/authentication Playwright flow: PASS
- `npm run test:e2e`: PASS (5 Chromium tests; the serial flow covers tag create/rename/conflict/delete, post slug conflicts, CodeMirror autosave, explicit draft save, secure preview, publish, chronological archive/detail rendering, RSS inclusion/removal, public autosave isolation, archive, delete, and relationship cleanup)
- `npm run build`: PASS (all admin/public post routes, protected preview, and `/feed.xml` compile as dynamic routes)
- `npm run db:generate`: PASS (`drizzle/0005_true_marauders.sql`; final schema check reports no further changes)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database creation, migration, and reset: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS (sandbox could not read the user Docker config, but Compose validation exited successfully)
- Compose `postgres` and `storage` services: RUNNING and HEALTHY
- Container image build: UNAVAILABLE because Docker Desktop's BuildKit worker returned `DeadlineExceeded`; a legacy-builder retry also stalled and was terminated without changing running services
- `npm audit --omit=dev`: 5 moderate tooling-only esbuild advisories through Drizzle Kit; npm still offers only a breaking Drizzle Kit downgrade as an automated fix

Milestone 7 — 2026-08-11

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (14 files, 27 tests; project coverage includes optional-field normalization, exact calendar dates, date ranges, safe URLs, lifecycle values, technology slugs, and unique assignments)
- Focused project/authentication Playwright flow: PASS
- `npm run test:e2e`: PASS (5 Chromium tests; the serial flow covers technology create/rename/conflict/delete, project slug conflicts, CodeMirror autosave, explicit draft save, secure preview, publish, featured-first ordering, lifecycle/date/link rendering, public autosave isolation, archive, delete, and relationship cleanup)
- `npm run build`: PASS (all admin/public project routes and the protected project preview compile as dynamic routes)
- `npm run db:generate`: PASS (`drizzle/0006_medical_war_machine.sql`; final schema check reports no further changes)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database creation, migration, and reset: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS (sandbox could not read the user Docker config, but Compose validation exited successfully)
- Compose `postgres` and `storage` services: RUNNING and HEALTHY
- Container image build: UNAVAILABLE because Docker Desktop's BuildKit worker again accepted the build without producing progress and the bounded retry was terminated; the production Next.js build passed independently
- Dependency audit status is unchanged from Milestone 6 because this milestone added no packages

---

# 11. Important Handoff Notes

Any future coding session should:

1. Read `AGENTS.md`.
2. Read `REQUIREMENTS.md`.
3. Read `ARCHITECTURE.md`.
4. Read this file.
5. Inspect the repository before making changes.
6. Begin Milestone 8 only when it is the requested scope.
7. Avoid prematurely implementing later milestones.
8. Update this file before ending meaningful work.

Milestone 0 handoff decisions:

- Do not add tables to the empty Drizzle schema until the owning milestone requires them.
- Use checked-in Drizzle migrations for schema changes; do not use destructive schema push for deployment.
- Keep all environment reads behind `src/lib/env/server.ts`, except tooling configuration and conventional `NODE_ENV` checks.
- Standalone CLI tools must use the framework-neutral `src/db/client.ts` factory instead of importing the Next.js `server-only` database entry point.

Milestone 1 handoff decisions:

- Profile/site fixture replacement was completed in Milestone 3, and navigation fixture replacement was completed in Milestone 5. No public data fixture remains.
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
- Public navigation is now database-driven through the Milestone 5 navigation feature.
- The avatar URL is an intentional bridge to Milestone 8; future uploads must replace it through the storage abstraction rather than adding storage code to the profile feature.
- Appearance values remain controlled tokens. Dark mode is still an open product decision, not an unfinished Milestone 3 requirement.

Milestone 4 handoff decisions:

- Keep `content_markdown` canonical and `draft_markdown` private. Autosave must never write public content directly; explicit save/lifecycle actions promote the editor value and clear the draft.
- Keep all later Markdown consumers on `src/lib/markdown/render.ts`. Do not add separate public, admin-preview, or content-type renderers.
- Normalize timestamp values after the Next.js public-page cache boundary because cached values are serialized before being returned to application code.
- Keep raw HTML disabled and Mermaid in strict mode. Shiki remains server-side; only diagram rendering is dynamically loaded in the browser when required.
- Page navigation now stores stable page IDs and resolves current slugs through the Milestone 5 navigation feature.
- Keep URL-based image insertion as the Milestone 4 boundary. Uploads, drag/drop, clipboard images, and the media picker belong to Milestone 8 and must use the storage abstraction.
- The external page Open Graph image URL is an interim bridge. Replace it with a media relationship in Milestone 8 without duplicating the later shared SEO architecture from Milestone 11.

Milestone 5 handoff decisions:

- Keep destination types finite: page, posts, projects, publications, CV, and external. Do not introduce an arbitrary internal-path type that bypasses typed destination integrity.
- Keep page navigation relationships ID-based. Public page hrefs must be resolved from the current slug and omitted when the target is not published.
- Keep complete-list reorder validation and transactional writes. Do not persist drag order through independent client updates that can leave partial positions.
- Preserve both native drag-and-drop and explicit up/down controls; the latter is the keyboard-accessible ordering path.
- Keep public navigation reads behind `getPublicNavigation()` and its cache tag. Navigation mutations and relevant page lifecycle changes must invalidate that tag.
- Page deletion intentionally cascades its page navigation items. Other destination types do not depend on future content tables yet.
- Built-in posts and projects destinations are live. Publications and CV links may be configured before those routes ship in Milestones 9 and 10.

Milestone 6 handoff decisions:

- Keep post autosave isolated in `draft_markdown`; it must never change canonical public content or publication state.
- Keep pages and posts on the shared CodeMirror component and the single `src/lib/markdown/render.ts` rendering pipeline.
- Keep tag names normalized as rows, relationships ID-based, and complete assignment changes in the same transaction as post updates.
- Keep public post reads behind `PUBLIC_POSTS_CACHE_TAG`; lifecycle, slug, content, and tag changes must invalidate the archive, details, and RSS.
- Keep `/feed.xml` limited to published posts and generate absolute links from the centrally validated `APP_URL`.
- Cover and social image URLs are temporary Milestone 6 bridges. Milestone 8 should replace them with media IDs through the storage abstraction.
- The posts built-in navigation destination is live. Projects are now live through Milestone 7; publications and CV remain owned by later milestones.

Milestone 7 handoff decisions:

- Keep project lifecycle (`planned`, `active`, `completed`, `archived`) independent from CMS publication status (`draft`, `published`, `archived`).
- Keep project autosave isolated in `draft_markdown` and projects on the shared editor/Markdown renderer.
- Keep technologies normalized, relationships ID-based, and complete assignment replacement in the same transaction as project updates.
- Preserve non-negative `project_technologies.sort_order`, even though the current selection UI uses stable alphabetical checkbox order rather than drag reordering.
- Keep public project reads behind `PUBLIC_PROJECTS_CACHE_TAG` and preserve featured-first then recency ordering.
- Keep GitHub, demo, and external project URLs limited to validated HTTP(S) links rendered with safe new-tab attributes.
- Project cover and social image URLs are Milestone 7 bridges. Milestone 8 should migrate them to media IDs through the storage abstraction.
- The projects built-in navigation destination is now live. Publications and CV routes remain owned by Milestones 9 and 10.
