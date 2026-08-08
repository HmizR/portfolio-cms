# AGENTS.md

# PortfolioCMS — Instructions for Coding Agents

This file contains mandatory implementation instructions for Codex and other coding agents working in this repository.

Read this file before making changes.

Also read:

- `REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `PROGRESS.md`

before beginning significant work.

If documents disagree:

1. `REQUIREMENTS.md` defines product behavior.
2. `ARCHITECTURE.md` defines structural constraints.
3. `AGENTS.md` defines implementation workflow.
4. `PROGRESS.md` records current state.

Do not silently override these documents.

---

# 1. Main Goal

Build PortfolioCMS as a production-quality self-hosted academic/professional portfolio CMS inspired by Academic Pages.

The public site must preserve a restrained academic look.

The admin panel should provide a polished modern CMS experience.

Do not turn the project into a generic SaaS dashboard or WordPress clone.

---

# 2. Work Incrementally

Implement one milestone at a time.

Do NOT build later milestones early unless required by the current milestone.

Do NOT introduce speculative abstractions for features that do not yet exist.

Finish each vertical slice fully before expanding scope.

---

# 3. Required Workflow

For each task:

1. Read relevant requirements.
2. Inspect existing implementation.
3. Identify affected files.
4. Make the smallest coherent change.
5. Add/update tests.
6. Run validation.
7. Fix failures.
8. Update `PROGRESS.md`.
9. Summarize what changed.

Do not claim a task is complete if required checks fail.

---

# 4. Do Not Rewrite Working Code Without Reason

Prefer targeted changes.

Do not:

- Rewrite large modules only for style.
- Replace libraries without a concrete reason.
- Refactor unrelated code during feature work.
- Rename broad parts of the repository unnecessarily.

If a large refactor is necessary, document the reason first.

---

# 5. Architecture Rules

The application is a modular monolith.

Do not introduce:

- Microservices
- Redis
- Message queues
- Workers
- Kubernetes
- Elasticsearch

unless a written project requirement explicitly requires them.

---

# 6. Framework Rules

Use:

- Next.js App Router
- TypeScript
- React
- PostgreSQL
- Drizzle ORM
- Zod
- Tailwind CSS
- shadcn/ui for admin UI
- CodeMirror 6 for Markdown editing
- S3-compatible storage
- Vitest
- Playwright

Do not swap major stack choices without updating architecture documentation and explaining the reason.

---

# 7. TypeScript Rules

Use strict TypeScript.

Avoid:

- `any`
- unsafe casts
- broad `as unknown as`
- non-null assertions unless logically guaranteed and documented

Prefer typed boundaries.

All server action inputs must be validated.

---

# 8. Coding Style

Prefer:

- Small focused functions
- Early returns
- Clear names
- Explicit types at boundaries
- Async/await
- Feature-local logic
- Composition over inheritance

Avoid:

- Deep nesting
- Giant components
- Giant service files
- Giant `utils.ts`
- Duplicate business logic
- Clever code that reduces readability

---

# 9. Feature Ownership

Keep domain logic close to its feature.

Example:

```text
src/features/projects/
```

may own:

- Project types
- Project validation
- Queries
- Services
- Server actions
- Feature-specific components

Generic reusable primitives belong elsewhere.

Do not create generic abstractions until at least two real consumers require them.

---

# 10. Server vs Client Components

Default to Server Components.

Use `"use client"` only when required.

Typical client-only areas:

- Markdown editor
- Drag-and-drop navigation
- Rich admin forms
- Interactive media picker
- Browser-only UI behavior

Do not convert parent layouts to client components merely to support one interactive child.

---

# 11. Public Bundle Discipline

Do not import admin-only libraries into public components.

Public pages should minimize JavaScript.

The public portfolio should remain fast and content-focused.

---

# 12. Public Design Rules

The public site should resemble the information structure and restrained character of Academic Pages.

Important:

- Top navigation
- Profile/sidebar on desktop
- Main readable content column
- Minimal visual noise
- Academic/professional typography
- Text-first post/archive pages
- Responsive mobile design

Do not make the public frontend look like:

- a shadcn dashboard
- a startup landing page
- a card-heavy SaaS site

---

# 13. Admin Design Rules

shadcn/ui is appropriate for admin.

Use consistent:

- Sidebar
- Forms
- Tables
- Dialogs
- Confirmation UI
- Toasts
- Empty states
- Loading states

Admin should feel polished but not overdecorated.

---

# 14. Data Rules

Public content must come from the database.

Do not hardcode portfolio data into React components once the corresponding feature exists.

Use IDs for relationships.

Use slugs only for URLs.

---

# 15. Database Rules

Use Drizzle migrations.

Do not directly edit production schemas.

Add database constraints for:

- Required values
- Unique slugs
- Relationship integrity
- Unique join pairs where required

Use transactions for multi-row operations that must remain consistent.

---

# 16. Date Rules

Store timestamps in UTC.

Use timezone-aware database types where supported.

Do not persist formatted date strings when real date/time types are appropriate.

---

# 17. Slug Rules

Slug generation must:

- Lowercase
- Normalize spaces to hyphens
- Remove unsupported characters
- Avoid duplicate hyphens
- Validate reserved slugs
- Enforce uniqueness

Do not automatically mutate an existing slug when a title changes.

---

# 18. Authentication Rules

Authentication is security-sensitive.

Must:

- Use secure password hashing
- Use server-validated sessions
- Use HttpOnly cookies
- Protect every admin route
- Protect every mutation
- Disable `/setup` after first admin creation

Never:

- Store auth tokens in localStorage
- Log passwords
- Log session tokens
- Trust client state as authorization

---

# 19. Authorization Rule

Every server action or route that modifies protected data must independently verify authentication.

A protected admin page alone is not sufficient.

---

# 20. Validation Rules

Use Zod for all external input.

Examples:

- Forms
- URL params where meaningful
- Search params where meaningful
- Upload metadata
- Settings
- Homepage section config
- Export/import data

Validate on the server.

Client validation is only UX.

---

# 21. Markdown Rules

There must be ONE shared Markdown rendering pipeline.

Use it for:

- Public pages
- Posts
- Projects
- Publications
- Admin preview

Do not maintain separate rendering logic.

---

# 22. Markdown Security Rules

Raw HTML is disabled by default.

If raw HTML is ever added:

- Sanitize it.
- Add XSS tests.
- Document allowed behavior.

Do not use unsafe `dangerouslySetInnerHTML` with untrusted unsanitized HTML.

---

# 23. Markdown Feature Rules

Support:

- GFM
- Tables
- Task lists
- Footnotes
- Code fences
- Shiki syntax highlighting
- Math/KaTeX
- Mermaid
- Heading anchors

If a plugin causes security or rendering issues, document before changing behavior.

---

# 24. Editor Rules

Persist Markdown, not editor-specific document state.

Editor must support:

- Markdown
- Preview
- Split view

Autosave must never publish automatically.

Publishing is always explicit.

---

# 25. Media Rules

All canonical uploads use the storage abstraction.

Do not write RustFS-specific calls throughout features.

Store:

- storage key
- metadata

Do not treat the public absolute URL as canonical database identity.

---

# 26. Upload Security Rules

Before upload:

- Authenticate.
- Validate MIME.
- Validate size.
- Generate server-side key.
- Reject unsupported types.

Do not trust user filenames.

Do not expose storage credentials to the browser.

---

# 27. Navigation Rules

Navigation is database-driven.

Admin must be able to:

- Add
- Edit
- Delete
- Show/hide
- Reorder

Reordering must be persistent.

Provide accessible keyboard fallback.

---

# 28. Homepage Rules

Homepage uses controlled section types.

Do NOT implement a generic visual page builder.

Configuration JSON is allowed only behind strict typed validation.

---

# 29. SEO Rules

Use shared helpers.

Every public content type should have predictable metadata defaults.

Do not duplicate SEO generation logic in many route files.

---

# 30. Cache/Revalidation Rules

After public-facing content mutation, revalidate affected public routes.

Do not disable caching globally simply to avoid handling invalidation.

---

# 31. Error Handling Rules

Never silently swallow errors.

User-facing forms should receive actionable messages.

Server logs should contain useful context without secrets.

Production responses must not expose stack traces.

---

# 32. Test Rules

New business logic requires tests.

At minimum maintain:

- Unit tests for utilities/validation/Markdown/SEO/export
- Integration tests for database rules
- E2E tests for critical publishing flows

Do not delete tests just to make CI green.

---

# 33. Critical E2E Flow

Maintain an automated test covering:

```text
login
→ create page
→ write Markdown
→ publish
→ add to navbar
→ verify public navbar
→ verify public page
→ remove public visibility
→ verify public page is unavailable
```

This flow is considered core system functionality.

---

# 34. Commands

Before marking work complete, run the relevant commands.

Expected commands should eventually include equivalents of:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

If the repository uses different script names, update this document.

Do not state that checks passed unless they were actually run.

---

# 35. Build Rule

A feature is not done if the production build fails.

---

# 36. Migration Rule

If the database schema changes:

1. Update Drizzle schema.
2. Generate migration.
3. Inspect migration.
4. Test migration.
5. Commit migration.

Never leave schema and migrations inconsistent.

---

# 37. Environment Variables

New environment variables must be added to:

- Validation schema
- `.env.example`
- Documentation

Do not read random `process.env` values throughout the codebase.

Centralize environment validation.

---

# 38. Secrets

Never commit:

- `.env`
- Database passwords
- Auth secrets
- S3 secrets
- Production credentials

If a secret appears in source accidentally, remove it immediately and note rotation is required.

---

# 39. Docker Rules

Docker configuration must remain usable.

Do not assume `localhost` inside containers refers to host services.

Use Compose service DNS names.

Keep local developer experience documented.

---

# 40. Seed Rules

Seed data should demonstrate the product.

Do not use low-quality placeholder content such as:

- lorem ipsum everywhere
- "test test"
- meaningless project names

Use realistic demo portfolio content.

---

# 41. Documentation Rules

When architecture or behavior changes, update docs during the same task.

Do not postpone documentation indefinitely.

---

# 42. PROGRESS.md Rules

Update `PROGRESS.md` after every meaningful completed task.

Do not update it after every tiny line edit.

Record:

- Completed work
- Current work
- Next work
- Important decisions
- Known problems
- Validation status

The goal is to allow a future coding session to resume safely.

---

# 43. Commit Guidance

Do not automatically commit unless the user explicitly requests automatic commits.

When commits are requested:

- Make logical focused commits.
- Do not bundle unrelated changes.
- Use clear commit messages.

Suggested format:

```text
feat(pages): add publish workflow
fix(auth): protect admin mutation
test(projects): add project CRUD coverage
docs: update architecture for storage abstraction
```

---

# 44. Scope Control

If a task suggests a feature outside the current milestone:

- Do not implement it automatically.
- Record it under future work if useful.
- Continue with the requested milestone.

Examples:

- Search while building pages
- Analytics while building dashboard
- Multi-user RBAC while building login
- Scheduled posts while building publishing
- Plugin architecture while building settings

---

# 45. Avoid Premature Generalization

Do not create:

- generic CMS framework
- plugin API
- dynamic component registry
- unnecessary repository pattern
- complex event bus
- internal dependency injection framework

Simple explicit code is preferred.

---

# 46. Quality Bar

This project should be good enough to use as a real personal portfolio.

Do not use "student project" as justification for:

- insecure auth
- broken responsive layout
- poor error handling
- placeholder architecture
- missing tests
- destructive schema behavior
- hardcoded content

---

# 47. Milestones

Implement in this order unless dependencies justify a small adjustment.

## Milestone 0 — Foundation

- Next.js
- TypeScript
- Tailwind
- shadcn setup
- PostgreSQL
- Drizzle
- Docker
- environment validation
- lint
- test setup
- initial docs

## Milestone 1 — Public Shell

- Header
- Static fixture navigation
- Profile sidebar
- Main layout
- Footer
- Typography
- Responsive behavior

Use fixtures only temporarily.

## Milestone 2 — Authentication

- User schema
- First-time setup
- Login
- Logout
- Sessions
- Admin route protection
- Admin shell

## Milestone 3 — Profile + Settings

- Profile persistence
- Social links
- Site title
- Site description
- Basic appearance

Replace public fixtures with database data.

## Milestone 4 — Pages

- Page schema
- CRUD
- Slugs
- Markdown editor
- Markdown renderer
- Draft/publish/archive
- Public custom pages
- Preview

## Milestone 5 — Navigation

- Navigation schema
- CRUD
- Ordering
- Visibility
- Public dynamic navbar

## Milestone 6 — Posts

- Posts
- Tags
- Archive
- Detail
- RSS

## Milestone 7 — Projects

- Projects
- Technologies
- Featured projects
- Project detail
- Project archive

## Milestone 8 — Media

- Storage abstraction
- S3 adapter
- Uploads
- Media library
- Image picker
- Clipboard image
- Drag/drop image

## Milestone 9 — Academic Portfolio

- Publications
- Authors
- Education
- Experience
- Skills

## Milestone 10 — CV

- Structured CV
- Configurable sections
- Print styles

## Milestone 11 — SEO

- Metadata
- Open Graph
- Canonical
- JSON-LD
- Sitemap
- Robots

## Milestone 12 — Portability

- Individual Markdown export
- Full portfolio export
- Document format

## Milestone 13 — Hardening

- Accessibility
- Security review
- E2E coverage
- Error states
- Performance
- Responsive testing
- Documentation review

---

# 48. Definition of Complete Work

Before saying a milestone/task is complete:

- Requirements are satisfied.
- Relevant tests exist.
- Tests pass.
- Typecheck passes.
- Lint passes.
- Production build passes when applicable.
- Database migrations are present when applicable.
- Documentation is updated.
- `PROGRESS.md` is updated.
- No known critical regression remains.

---

# 49. When Unsure

Prefer:

1. Simpler architecture.
2. Safer implementation.
3. Explicit code.
4. Existing project conventions.
5. Product requirements.

Do not invent major requirements.

If a decision materially changes product scope or architecture, document it before proceeding.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
