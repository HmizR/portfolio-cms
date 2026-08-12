# PROGRESS.md

# PortfolioCMS — Development Progress

Last updated: 2026-08-12

This file is the persistent handoff document for ongoing implementation.

Update this file after meaningful completed work.

Do not use this file as a replacement for requirements or architecture documentation.

---

# 1. Project Status

Current phase:

**Milestone 10 complete / ready for Milestone 11**

Overall status:

**The application foundation through the configurable, print-ready CV is implemented and validated. Milestone 11 has not started.**

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
- Media uses canonical generated storage keys behind a provider interface; the S3-compatible bucket remains private and `/media/[id]` streams validated objects with server-held credentials.
- Managed profile/page/post/project images use nullable media IDs with `ON DELETE SET NULL`; existing external URL fields remain compatibility fallbacks.
- Uploads authenticate independently and validate size, allowlisted MIME/extension agreement, file signatures, and bounded image dimensions before persistence.
- Publications use the shared canonical/private-draft Markdown boundary, transactionally ordered authors, finite publication types, and managed PDF/social media relationships.
- Education and experience use checked structured timelines with explicit ordering; skills use categorized visible rows without percentage bars.

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

Status: **Complete**

Tasks:

- [x] Add media schema
- [x] Add migration
- [x] Create storage provider interface
- [x] Create S3 provider
- [x] Configure local object storage
- [x] Create bucket bootstrap/documentation
- [x] Validate file MIME types
- [x] Validate file sizes
- [x] Generate storage keys
- [x] Build upload flow
- [x] Build media library
- [x] Implement deletion
- [x] Implement alt text editing
- [x] Implement media picker
- [x] Integrate image insertion into Markdown editor
- [x] Implement drag/drop image upload
- [x] Implement clipboard paste image upload
- [x] Add media tests

---

## Milestone 9 — Academic Portfolio

Status: **Complete**

Tasks:

### Publications

- [x] Add publications schema
- [x] Add publication_authors schema
- [x] Add migrations
- [x] Implement publication CRUD
- [x] Implement publication types
- [x] Implement author ordering
- [x] Implement PDF attachment
- [x] Implement publication index
- [x] Implement publication detail

### Education

- [x] Add education schema
- [x] Add migration
- [x] Implement education CRUD
- [x] Implement ordering

### Experience

- [x] Add experience schema
- [x] Add migration
- [x] Implement experience CRUD
- [x] Implement ordering

### Skills

- [x] Add skills schema
- [x] Add migration
- [x] Implement skill CRUD
- [x] Implement skill categories/order

---

## Milestone 10 — CV

Status: **Complete**

Tasks:

- [x] Add CV section configuration
- [x] Add migration if required
- [x] Implement CV section ordering
- [x] Implement visibility
- [x] Implement selected project configuration
- [x] Build `/cv`
- [x] Add print stylesheet
- [x] Verify print/PDF output

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

**Milestone 10 — CV is complete. No implementation task is currently in progress.**

Completed CV work:

1. `cv_sections` stores one seeded row for each finite section type with persistent visibility and unique ordering; `cv_project_selections` stores ordered stable project relationships.
2. Migration `0009_classy_sentinels.sql` creates the constrained configuration and seeds deterministic section IDs for fresh and test databases.
3. `/admin/cv` provides authenticated section visibility, accessible up/down ordering, and published-project selection through a complete Zod-validated configuration form.
4. The CV service validates referenced projects and writes section order, visibility, and project selections in one transaction.
5. `/cv` renders the configured profile, education, experience, projects, publications, and skills from structured public records, using the shared Markdown renderer for timeline descriptions.
6. CV mutations and all contributing public-content mutations revalidate `/cv` so the document reflects current structured data.
7. CV-scoped A4 print styles remove public chrome and controls, preserve readable typography, and avoid splitting entries where practical; browser-native PDF output remains the V1 export path.
8. Unit and browser coverage validates configuration shape, persistence, ordering, visibility, selected projects, public content, print-mode chrome suppression, and real PDF generation.

Next recommended task: **Milestone 11 — SEO**. It has not been started.

---

# 7. Known Issues

- `npm audit --omit=dev` reports five moderate development-server advisories through Drizzle Kit's deprecated nested `@esbuild-kit`/esbuild dependency. Better Auth's optional Drizzle Kit peer makes npm include the tooling path in the omit-dev report; the vulnerable package is not used by the production application runtime, and npm offers only a breaking Drizzle Kit downgrade as an automated fix.
- The host currently uses Node.js 20.12.2, below the dependency toolchain's declared Node.js 20.19 minimum. Validation passes on the host, while the production Dockerfile uses Node.js 22.
- Docker Desktop's BuildKit worker returned `DeadlineExceeded` during Milestone 6 and accepted a Milestone 7 retry without progress even after Docker Desktop restarted. Compose configuration and the running PostgreSQL/storage services remain healthy, while production Next.js builds pass. Treat this as a host builder condition and retry container-image verification when Docker's builder is responsive.

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

Milestone 8 — 2026-08-11

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (15 files, 33 tests; media coverage includes metadata limits, MIME/extension agreement, signatures, bounded PNG/GIF dimensions, clipboard/drop image selection, and image-only managed-field assignments)
- Focused authentication/media Playwright flow: PASS
- `npm run test:e2e`: PASS (5 Chromium tests; media coverage includes authenticated upload to MinIO, dimensions, alternative text, search, picker insertion, publication, private-bucket delivery, deletion, and anonymous API rejection)
- `npm run build`: PASS (`/admin/media`, `/api/admin/media`, `/media/[id]`, managed-image content routes, and previews compile as dynamic routes)
- `npm run db:generate`: PASS (`drizzle/0007_past_argent.sql`; final schema check reports no further changes)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database creation, all-migration application, and reset: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS (sandbox could not read the user Docker config, but Compose validation exited successfully)
- Compose `postgres` and `storage` services: RUNNING and HEALTHY
- Real S3-compatible upload/read/delete integration: PASS against the running private MinIO bucket
- `npm audit --omit=dev`: 5 moderate tooling-only esbuild advisories through Drizzle Kit; the high-severity no-fix image parser advisory was eliminated by replacing that dependency with bounded allowlisted header parsing
- Playwright development startup uses Next.js's documented webpack fallback because Turbopack's generated task cache panicked during repeated long serial runs; the production Turbopack build passes

Milestone 9 — 2026-08-11

- `npm run lint`: PASS
- `npm run typecheck`: PASS (the restricted sandbox could not resolve the parent user directory, so the identical compiler command was rerun through the approved host execution path)
- `npm run test`: PASS (19 files, 41 tests; new coverage includes publication normalization and academic-record validation)
- `npm run test:e2e`: PASS (5 Chromium tests; academic coverage creates education, experience, and skill records, uploads a real PDF to MinIO, orders multiple authors, publishes a publication, verifies public metadata/PDF delivery, then archives and deletes it)
- `npm run build`: PASS (26 generated pages; all publication, academic admin, public archive/detail, and protected preview routes compile as dynamic routes)
- `npm run db:generate`: PASS (`drizzle/0008_fuzzy_morg.sql`; final schema check reports no further changes)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database creation, all-migration application, and reset: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS
- Compose `postgres` and `storage` services: RUNNING and HEALTHY
- Real managed-PDF upload and private-bucket delivery: PASS against the running S3-compatible service
- `npm audit --omit=dev`: unchanged at 5 moderate tooling-only esbuild advisories through Drizzle Kit; no production application runtime path is affected

Milestone 10 — 2026-08-12

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS (20 files, 43 tests; new coverage validates complete CV configuration, finite section types, unique ordering, and project selections)
- `npm run test:e2e`: PASS (5 Chromium tests; CV coverage persists section ordering/visibility and selected projects, verifies structured public content, emulates print media, and creates a real A4 PDF)
- `npm run build`: PASS (28 generated pages; `/admin/cv` and `/cv` compile as dynamic routes)
- `npm run db:generate`: PASS (`drizzle/0009_classy_sentinels.sql`; final schema check reports no further changes)
- `npm run db:migrate`: PASS against the development PostgreSQL service
- Isolated Playwright database creation, all-migration application, reseeding, and reset: PASS
- `npm run db:check`: PASS against the healthy Compose PostgreSQL service
- `docker compose config --quiet`: PASS
- Compose `postgres` and `storage` services: RUNNING and HEALTHY
- Browser-native print/PDF output: PASS (valid `%PDF` A4 document generated by Chromium)
- Dependency audit status is unchanged from Milestone 9 because this milestone added no packages

---

# 11. Important Handoff Notes

Any future coding session should:

1. Read `AGENTS.md`.
2. Read `REQUIREMENTS.md`.
3. Read `ARCHITECTURE.md`.
4. Read this file.
5. Inspect the repository before making changes.
6. Begin Milestone 11 only when it is the requested scope.
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
- Managed media now owns the preferred avatar relationship; the validated URL remains only a compatibility fallback.
- Appearance values remain controlled tokens. Dark mode is still an open product decision, not an unfinished Milestone 3 requirement.

Milestone 4 handoff decisions:

- Keep `content_markdown` canonical and `draft_markdown` private. Autosave must never write public content directly; explicit save/lifecycle actions promote the editor value and clear the draft.
- Keep all later Markdown consumers on `src/lib/markdown/render.ts`. Do not add separate public, admin-preview, or content-type renderers.
- Normalize timestamp values after the Next.js public-page cache boundary because cached values are serialized before being returned to application code.
- Keep raw HTML disabled and Mermaid in strict mode. Shiki remains server-side; only diagram rendering is dynamically loaded in the browser when required.
- Page navigation now stores stable page IDs and resolves current slugs through the Milestone 5 navigation feature.
- Keep image insertion on standard Markdown URL text. The Milestone 8 picker, paste, and drop paths all upload through the shared storage abstraction before inserting that portable reference.
- Page Open Graph images now prefer a managed media ID; the validated external URL remains a compatibility fallback without pre-implementing Milestone 11 SEO helpers.

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
- Post cover and social images now prefer managed media IDs through the storage abstraction; validated external URLs remain compatibility fallbacks.
- The posts built-in navigation destination is live. Projects are now live through Milestone 7; publications and CV remain owned by later milestones.

Milestone 7 handoff decisions:

- Keep project lifecycle (`planned`, `active`, `completed`, `archived`) independent from CMS publication status (`draft`, `published`, `archived`).
- Keep project autosave isolated in `draft_markdown` and projects on the shared editor/Markdown renderer.
- Keep technologies normalized, relationships ID-based, and complete assignment replacement in the same transaction as project updates.
- Preserve non-negative `project_technologies.sort_order`, even though the current selection UI uses stable alphabetical checkbox order rather than drag reordering.
- Keep public project reads behind `PUBLIC_PROJECTS_CACHE_TAG` and preserve featured-first then recency ordering.
- Keep GitHub, demo, and external project URLs limited to validated HTTP(S) links rendered with safe new-tab attributes.
- Project cover and social images now prefer managed media IDs through the storage abstraction; validated external URLs remain compatibility fallbacks.
- The projects built-in navigation destination is now live. Publications and CV routes remain owned by Milestones 9 and 10.

Milestone 8 handoff decisions:

- Keep the S3-compatible bucket private. Public files must continue through `/media/[id]` or a documented future signed/CDN design; do not expose bucket credentials or add anonymous bucket policy as a shortcut.
- Keep the database storage key canonical. Browser-facing URLs are derived from `APP_URL` plus the stable media ID, never persisted as object identity.
- Keep upload checks server-side and finite: request/file size, allowlisted MIME type, practical extension agreement, magic signature, bounded image dimensions, and generated UUID key.
- Do not reintroduce a general image parser without reviewing untrusted-input advisories. The current bounded parser reads only the headers required for JPEG, PNG, WebP, and GIF.
- Keep media mutations independently authenticated. The public media route is read-only and resolves only an existing UUID-backed database row.
- Deletion sets managed image foreign keys to null. Markdown URLs are portable text and may become broken after deletion, so preserve the explicit warning until reference tracking is designed.
- Keep the shared CodeMirror picker/paste/drop integration reusable across pages, posts, projects, and publications.
- Playwright uses the documented webpack development fallback on this Windows host because repeated long Turbopack development runs corrupted the generated task cache; production still validates with the default Turbopack build.

Milestone 9 handoff decisions:

- Keep publication canonical Markdown separate from the private autosave draft, matching the established content lifecycle; autosave must never publish.
- Keep publication authors as ordered child rows and replace the complete author list transactionally so author order and publication updates cannot diverge.
- Keep publication PDFs as managed `application/pdf` media IDs. Public delivery continues through the private-bucket media route, and social images remain independently image-validated.
- Keep public publication reads behind `PUBLIC_PUBLICATIONS_CACHE_TAG`, with featured-first and publication-date ordering plus targeted invalidation after public-facing mutations.
- Keep education and experience as structured timeline rows with exact dates, current-state rules, Markdown descriptions, and accessible ordering. They are data sources for later controlled homepage and CV consumers, not CV layout configuration themselves.
- Keep skill categories administrator-defined and skills qualitative; do not add percentage or proficiency bars.
- The publications built-in navigation destination is now live. CV is now live through Milestone 10.

Milestone 10 handoff decisions:

- Keep CV sections finite and seeded. Do not turn the configuration into an arbitrary visual page builder or template registry.
- Keep visibility and ordering in `cv_sections`, and keep selected projects as normalized ID relationships in `cv_project_selections`; do not persist public URLs or project snapshots in CV configuration.
- Submit and validate the complete configuration, then update it transactionally so section order and project selection cannot diverge.
- Only published projects may be selected or rendered. Project deletion cascades its CV selection, while project lifecycle/content mutations revalidate `/cv`.
- Keep `/cv` server-rendered from the existing structured profile, academic, project, publication, and skill records. Timeline Markdown must continue through the one shared renderer.
- Keep print behavior CSS-scoped to the CV layout and use browser-native print/PDF output. Server-generated PDFs and multiple CV templates remain deferred features.
- Milestone 11 owns shared metadata helpers and comprehensive SEO. The CV route currently has only a conservative static title/description and must not grow one-off SEO infrastructure.
