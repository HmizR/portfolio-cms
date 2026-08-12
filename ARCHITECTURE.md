# ARCHITECTURE.md

# PortfolioCMS — Software Architecture

## 1. Architecture Overview

PortfolioCMS is a modular monolith built with Next.js and TypeScript.

It combines:

- Public website
- Admin panel
- Authentication
- Content management
- Markdown rendering
- Server-side mutations
- SEO generation

inside one application.

Persistent data is stored in PostgreSQL.

Uploaded files are stored in S3-compatible object storage.

The architecture intentionally avoids microservices, Redis, queues, and dedicated worker services until real requirements justify them.

---

## 2. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │      Browser        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Next.js       │
                         │                     │
                         │ Public UI           │
                         │ Admin UI            │
                         │ Server Components   │
                         │ Server Actions      │
                         │ Route Handlers      │
                         │ Authentication      │
                         └───────┬───────┬─────┘
                                 │       │
                    ┌────────────┘       └────────────┐
                    ▼                                 ▼
          ┌──────────────────┐              ┌──────────────────┐
          │    PostgreSQL    │              │ S3-Compatible    │
          │                  │              │ Object Storage   │
          │ Content          │              │                  │
          │ Settings         │              │ Images           │
          │ Metadata         │              │ PDFs             │
          │ Auth             │              │ Attachments      │
          └──────────────────┘              └──────────────────┘
```

---

# 3. Architectural Principles

## 3.1 Modular Monolith

Keep deployment simple while maintaining clear internal module boundaries.

Do not create separate services for:

- Posts
- Projects
- Authentication
- Media
- Publications

unless future requirements clearly justify them.

---

## 3.2 Server-First

Prefer server-side data loading and authorization.

Use client components only when necessary for:

- Interactive forms
- Drag-and-drop
- Markdown editor
- Live preview controls
- Client-side navigation behavior
- Interactive media selection

Do not turn the whole application into a client-rendered SPA.

---

## 3.3 Data-Driven Public Website

Public content must come from data.

Do not hardcode:

- Navigation items
- Profile content
- Project entries
- Posts
- Publications
- Education
- Experience

Changing portfolio content should normally require no source-code edit.

---

## 3.4 Structured Content + Markdown

Use structured database fields for metadata and Markdown for long-form prose.

Example:

Project structured fields:

- title
- slug
- summary
- dates
- URLs
- technologies
- status

Project Markdown:

- motivation
- architecture
- implementation details
- screenshots
- lessons learned

---

## 3.5 Portable Content

Markdown must remain exportable.

Avoid editor-specific proprietary document formats.

---

## 3.6 Explicit Domain Boundaries

Do not place unrelated business logic in generic `utils` files.

Each feature owns its:

- Types
- Validation
- Queries
- Services
- Server actions
- Feature-specific components

when appropriate.

---

# 4. Technology Decisions

## Application

- Next.js
- React
- TypeScript

## Styling

- Tailwind CSS
- Custom public-site styling
- shadcn/ui for admin UI

## Database

- PostgreSQL
- Drizzle ORM

## Authentication

- Better Auth with its Drizzle PostgreSQL adapter
- Email/password for V1

## Validation

- Zod

## Forms

- React Hook Form where it improves complex form handling

## Markdown

- unified ecosystem
- remark
- rehype
- remark-gfm
- remark-math
- KaTeX
- Shiki
- Mermaid

## Editor

- CodeMirror 6

## Storage

- S3-compatible API

## Tests

- Vitest
- Playwright

## Deployment

- Docker
- Docker Compose

---

# 5. Route Architecture

Suggested routes:

```text
src/app/
├── (public)/
│   ├── page.tsx
│   ├── [slug]/
│   │   └── page.tsx
│   ├── posts/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── publications/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── cv/
│       └── page.tsx
│
├── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── pages/
│   ├── posts/
│   ├── projects/
│   ├── publications/
│   ├── education/
│   ├── experience/
│   ├── skills/
│   ├── profile/
│   ├── navigation/
│   ├── homepage/
│   ├── media/
│   └── settings/
│
├── login/
├── setup/
├── api/
├── sitemap.ts
└── robots.ts
```

Exact file organization may change if a cleaner App Router design emerges.

---

# 6. Source Structure

Suggested:

```text
src/
├── app/
├── components/
│   ├── admin/
│   ├── public/
│   ├── markdown/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── pages/
│   ├── posts/
│   ├── projects/
│   ├── publications/
│   ├── profile/
│   ├── navigation/
│   ├── homepage/
│   ├── media/
│   ├── education/
│   ├── experience/
│   ├── skills/
│   ├── cv/
│   ├── seo/
│   └── export/
│
├── db/
│   ├── schema/
│   ├── migrations/
│   ├── seed/
│   └── index.ts
│
├── lib/
│   ├── auth/
│   ├── env/
│   ├── markdown/
│   ├── storage/
│   └── validation/
│
└── styles/
```

---

# 7. Feature Module Pattern

A feature may contain:

```text
features/projects/
├── project.types.ts
├── project.schema.ts
├── project.queries.ts
├── project.service.ts
├── project.actions.ts
└── components/
```

Not every feature needs every file.

Avoid abstraction for abstraction's sake.

The pattern exists to keep ownership clear.

---

# 8. Database Architecture

## 8.1 Core Tables

Suggested major tables:

```text
users
profiles
social_links
site_settings
navigation_items
homepage_sections

pages
posts
tags
post_tags

projects
technologies
project_technologies

publications
publication_authors

education
experience
skills

media

cv_sections
cv_project_selections
```

Revision tables may be added in V2.

---

# 9. Identifier Strategy

Use UUIDs or another globally safe generated identifier.

Do not use mutable slugs as foreign keys.

Public URLs use slugs.

Database relationships use IDs.

---

# 10. Timestamp Strategy

Use timezone-aware database timestamps.

Store timestamps consistently in UTC.

Render in appropriate local/display timezone where required.

Each mutable record should generally have:

- created_at
- updated_at

Publishable content also has:

- published_at

---

# 11. Content Tables

## Pages

Suggested fields:

```text
id
title
slug
excerpt
content_markdown
draft_markdown
status
published_at
show_title
show_sidebar
seo_title
seo_description
canonical_url
og_image_id
created_at
updated_at
```

Milestone 4 implements this as one `pages` table. `content_markdown` is the canonical, explicitly saved document; nullable `draft_markdown` is an autosave buffer used only by authenticated editing and preview. Explicit save and lifecycle actions promote the buffer to canonical content. Milestone 8 adds an optional media relationship for the Open Graph image while retaining the validated external URL as a compatibility fallback.

## Posts

```text
id
title
slug
excerpt
content_markdown
cover_media_id
status
published_at
seo_title
seo_description
canonical_url
og_image_id
created_at
updated_at
```

Milestone 6 follows the page publication boundary: `content_markdown` is canonical, nullable `draft_markdown` is the authenticated autosave buffer, and explicit save/lifecycle actions promote it. `published_at` records first publication, and a database check prevents a published post without that timestamp. Milestone 8 adds optional media relationships for cover and Open Graph images; validated external URLs remain compatibility fallbacks.

Tags are normalized with case-insensitive unique names and unique slugs. `post_tags` uses a composite primary key and cascading ID relationships. Post content and complete tag assignment replacement are written transactionally. Public post reads are cached behind one tag, ordered by publication time, normalized after cache serialization, and invalidated together with `/posts`, affected detail paths, and `/feed.xml`.

## Projects

```text
id
title
slug
summary
content_markdown
cover_media_id
github_url
demo_url
external_url
status
project_status
featured
started_at
ended_at
seo_title
seo_description
canonical_url
og_image_id
created_at
updated_at
```

Milestone 7 implements `projects` with the same canonical/private-draft Markdown boundary as pages and posts. CMS publication status is independent from the checked project lifecycle (`planned`, `active`, `completed`, `archived`). PostgreSQL checks require a publication timestamp for public rows and reject inverted optional date ranges. Featured state affects public index ordering but does not bypass publication rules.

Technologies are normalized with case-insensitive unique names and unique slugs. `project_technologies` uses stable IDs, cascading foreign keys, a composite primary key, and explicit non-negative ordering. Project content and its complete technology assignment are updated transactionally. Public project queries are cached behind a feature tag, ordered featured-first and then by recency, and invalidated by project and technology mutations. Milestone 8 adds optional cover/social media relationships while retaining validated external URLs as compatibility fallbacks.

## Publications

```text
id
title
slug
abstract
content_markdown
publication_type
venue
publisher
doi
external_url
pdf_media_id
publication_date
featured
status
seo_title
seo_description
canonical_url
og_image_id
created_at
updated_at
```

Milestone 9 implements publications with the same canonical/private-draft Markdown and explicit lifecycle boundary as other publishable content. Public reads are cache-tagged, featured-first, and date ordered. Author rows have UUID identity and unique per-publication positions; complete author replacement occurs transactionally with publication updates. PDF and social-image relationships use managed media IDs with `ON DELETE SET NULL`, and server services verify the selected media MIME type rather than trusting form state.

Education and experience remain separate structured timeline tables with checked date/current-state invariants and explicit ordering. Skills use categorized rows with visibility and case-insensitive uniqueness inside a category. These are data sources for later finite homepage and CV consumers; Milestone 9 does not create CV configuration or a generic page builder.

---

# 12. Relationship Tables

## post_tags

```text
post_id
tag_id
```

Use a composite uniqueness constraint.

## project_technologies

```text
project_id
technology_id
sort_order
```

## publication_authors

```text
id
publication_id
name
profile_url
position
is_owner
```

---

# 13. Profile Architecture

`profiles` represents the owner profile.

`social_links` remains a child table to avoid a schema migration every time a new social platform appears.

For V1, `profiles` has a database-enforced singleton key and a unique relationship to the single administrator. Social links keep explicit platform, label, URL, icon identifier, visibility, and sort order fields so arbitrary networks remain supported without arbitrary JSON.

---

# 14. Site Settings

Use typed configuration, not an uncontrolled dumping ground.

A key/value table may be used only if each setting is validated through a typed application layer.

Do not spread arbitrary string keys throughout the codebase.

Prefer a single configuration service that maps storage values into typed settings.

Milestone 3 uses a singleton `site_settings` row with explicit columns and database checks for controlled appearance presets. The supported settings are site title/description, accent color, content width, profile-image shape, and typography. This is deliberately not a theme engine or visual page builder.

---

# 15. Navigation Architecture

`navigation_items` should contain:

```text
id
label
type
page_id
url
sort_order
is_visible
open_new_tab
created_at
updated_at
```

Rules:

- `page_id` is used for page destinations.
- `url` is used for external destinations.
- System destinations are represented by type.
- Invalid combinations are rejected by validation.

Milestone 5 implements page, external, posts, projects, publications, and CV destinations. Database checks enforce mutually exclusive page/URL/system shapes, and page references cascade on deletion. Public resolution joins page destinations by ID and omits them unless the target is published. Ordering writes and delete compaction are transactional; the admin provides native drag-and-drop plus explicit up/down controls. Public navigation is cached behind its own tag and revalidated by navigation mutations and page lifecycle changes.

---

# 16. Homepage Sections

Suggested:

```text
homepage_sections

id
type
sort_order
is_visible
configuration_json
created_at
updated_at
```

`configuration_json` is allowed here because section options vary by type.

However:

- Validate configuration with Zod discriminated unions.
- Never trust arbitrary JSON.
- Keep supported section types finite.

Example types:

- markdown
- featured_projects
- recent_posts
- featured_publications
- education
- experience
- page_excerpt

---

# 17. Authentication Architecture

Use secure session-based authentication.

Flow:

```text
Browser
   │
   ├── credentials
   ▼
Authentication server logic
   │
   ├── verify password hash
   ├── create/rotate session
   ▼
HttpOnly secure cookie
```

Requirements:

- Better Auth owns password hashing and opaque database sessions.
- Authentication data lives in `users`, `accounts`, `sessions`, `verifications`, and `rate_limits`.
- The database permits one logical administrator through a checked singleton constraint.
- First-time signup is reachable only through the server-side `/setup` action; no public signup API route is mounted.
- Login throttling uses the shared PostgreSQL `rate_limits` table and a keyed hash of the normalized email address, so limits are shared across application instances without storing the address in the limiter.
- No token in localStorage.
- Server checks session.
- Server actions verify session.
- Admin routes verify session.
- Setup route checks whether an admin already exists.

---

# 18. Authorization Architecture

For V1:

```text
authenticated admin
        │
        ├── allowed admin actions
        │
anonymous
        └── public read only
```

Do not create a complicated RBAC framework.

Code should still centralize authorization checks so future roles can be introduced safely.

---

# 19. Markdown Architecture

Create one shared Markdown pipeline.

Suggested module:

```text
src/lib/markdown/
├── render.ts
├── plugins.ts
├── sanitize.ts
├── headings.ts
└── types.ts
```

Pipeline:

```text
Markdown
  │
  ▼
remark-parse
  │
  ├── remark-gfm
  ├── remark-math
  └── custom Mermaid detection if needed
  │
  ▼
remark-rehype
  │
  ├── rehype-katex
  ├── Shiki/highlighting
  ├── heading IDs
  └── sanitization
  │
  ▼
Safe rendered content
```

Milestone 4 implements the shared pipeline in `src/lib/markdown/render.ts`. Sanitization runs after Markdown is converted to HAST and before trusted KaTeX, Mermaid, and Shiki transformations add controlled output. Raw HTML is not passed through. The exact plugin order is covered by renderer tests.

---

# 20. Markdown Security

Treat Markdown content as untrusted input even though V1 has one administrator.

Do not blindly render arbitrary raw HTML.

If raw HTML support is introduced:

- Sanitize it.
- Document supported elements.
- Test XSS vectors.

Safer default: raw HTML disabled.

---

# 21. Mermaid Architecture

Mermaid content must not execute arbitrary JavaScript.

Render diagrams through a controlled component.

Avoid unsafe Mermaid configuration.

Mermaid fences are marked on the server and rendered by a small client boundary only when diagrams exist. Mermaid uses strict security settings; the public bundle does not include a client-side syntax highlighter.

---

# 22. Code Highlighting

Use server-side syntax highlighting where practical.

Shiki is preferred.

Avoid shipping large client-side highlighters if server rendering can provide the same result.

---

# 23. Editor Architecture

The editor is a client-side feature module.

The persisted value is Markdown text.

Do not persist editor-specific state as the canonical content.

Editor states:

- markdown
- preview
- split

Image upload from editor:

```text
drop/paste/select
      │
      ▼
upload endpoint/server action
      │
      ▼
S3-compatible storage
      │
      ▼
media row
      │
      ▼
Markdown image reference inserted
```

---

# 24. Media Storage Abstraction

Create a storage interface.

Example conceptual API:

```ts
interface StorageProvider {
  upload(input: UploadInput): Promise<StoredObject>;
  delete(key: string): Promise<void>;
  read(key: string): Promise<ReadObject>;
}
```

Application code should not directly depend on RustFS-specific APIs.

The S3 adapter is the implementation.

This allows:

- RustFS
- MinIO
- AWS S3
- Cloudflare R2
- other S3-compatible providers

without rewriting feature logic.

Milestone 8 implements this interface with the AWS S3 client against any compatible endpoint. The object bucket remains private. `/media/[id]` resolves the canonical storage key from PostgreSQL and streams the object with server-held credentials, so browser-facing URLs remain stable without exposing the bucket or credentials. Upload persistence compensates for database failure by attempting object cleanup.

---

# 25. Media Storage Keys

Use generated keys.

Example:

```text
uploads/2026/08/<uuid>-questora.png
```

Never use the raw user filename as the entire storage key.

The database stores the key, not a permanent absolute URL.

---

# 26. Server Actions vs Route Handlers

Use Server Actions for first-party admin mutations where appropriate:

- createPage
- updatePage
- publishPost
- updateProfile
- reorderNavigation

Use Route Handlers when HTTP semantics are useful:

- Auth provider endpoints
- File upload where needed
- Export download
- RSS
- Preview/session endpoints where appropriate

Do not build a full REST API only because traditional applications often have one.

---

# 27. Mutation Pattern

Every mutation should follow:

```text
Receive input
   │
   ▼
Authenticate
   │
   ▼
Validate with Zod
   │
   ▼
Apply authorization rules
   │
   ▼
Database transaction if required
   │
   ▼
Revalidate affected routes
   │
   ▼
Return typed result
```

Do not trust form input.

---

# 28. Query Pattern

Feature-specific queries belong near the feature.

Examples:

```text
features/posts/post.queries.ts
features/projects/project.queries.ts
```

Avoid one huge global `queries.ts`.

---

# 29. Transactions

Use database transactions when multiple related writes must succeed atomically.

Examples:

- Create publication + author rows
- Update post + post tags
- Update project + technologies
- Reorder navigation items
- Full import

---

# 30. Caching

Public pages should use Next.js caching where it improves performance.

After writes, use targeted revalidation.

Example:

```text
Update project
   │
   ├── revalidate /projects
   ├── revalidate /projects/[slug]
   └── revalidate homepage if featured
```

Do not globally disable caching to avoid understanding invalidation.

Published page lookups use a shared cache tag. Explicit page mutations invalidate that tag and both the previous and current slug paths. Autosave does not invalidate public content because it writes only the private draft buffer.

---

# 31. Preview Architecture

Draft preview must:

- Require administrator session.
- Use the actual public rendering components.
- Avoid making the content publicly indexable.
- Avoid exposing predictable unauthenticated preview URLs.

Potential approach:

- Protected preview route/session.
- Draft-mode cookie or secure short-lived preview token.

Choose the simplest secure Next.js-native implementation.

---

# 32. SEO Architecture

Create shared SEO helpers.

Inputs:

- Global site settings
- Route-specific data

Outputs:

- Next.js metadata
- Canonical URL
- Open Graph metadata
- Twitter metadata
- JSON-LD where appropriate

Avoid duplicating metadata-building logic across routes.

Milestone 11 implements these outputs in `src/features/seo`. `APP_URL` remains the centrally validated canonical base URL; the singleton site settings own the managed default social-image relationship and optional X/Twitter handle alongside the existing site title and description. Content-specific values override global defaults through one metadata builder. Homepage, post, and publication JSON-LD use a shared serializer that escapes `<` before script injection. Sitemap generation reads only published content, and robots excludes protected authentication, admin, setup, and preview paths.

---

# 33. Export Architecture

Export format should be versioned.

Example manifest:

```json
{
  "format": "portfoliocms-export",
  "version": 1
}
```

Markdown files should contain frontmatter.

Media should be either:

- Included in export, or
- Clearly referenced with documented behavior.

Export code belongs in a dedicated feature module.

---

# 34. CV Architecture

CV is generated from structured records.

Suggested configuration table:

```text
cv_sections

id
section_type
sort_order
is_visible
configuration_json
```

Supported section types are finite.

Do not allow arbitrary executable templates.

Use public reusable components plus print-specific presentation.

Milestone 10 implements one seeded row per finite section type (`profile`, `education`, `experience`, `projects`, `publications`, and `skills`). Visibility and order are stored in `cv_sections`; selected projects use the normalized `cv_project_selections` relationship and stable project IDs rather than configuration JSON. The admin submits the complete configuration through one authenticated, Zod-validated server action, and the service replaces ordering, visibility, and project selection transactionally. `/cv` is server-rendered from structured public records and uses the shared Markdown renderer for timeline descriptions. CV-specific print selectors remove site chrome and controls, preserve the document content, avoid splitting entries where practical, and rely on browser-native PDF output. No arbitrary templates or server-generated PDF service are introduced.

---

# 35. Styling Architecture

Separate public and admin visual concerns.

Public:

- Custom typography
- Academic layout
- Controlled design tokens
- Minimal decorative UI

Admin:

- shadcn/ui
- Tables
- Dialogs
- Forms
- Navigation
- Toasts
- Command/search UI if needed

Do not let admin design decisions bleed into public presentation.

---

# 36. Design Tokens

Use CSS variables for controlled public customization.

Example:

```css
:root {
  --background: ...;
  --foreground: ...;
  --muted: ...;
  --border: ...;
  --accent: ...;
  --accent-hover: ...;
  --content-width: ...;
  --sidebar-width: ...;
  --font-body: ...;
  --font-heading: ...;
}
```

Appearance settings map to a known safe token set.

---

# 37. Error Architecture

Use:

- Next.js `not-found`
- Route-level error boundaries
- Typed mutation errors
- Form validation errors
- Structured logs

Do not expose stack traces to public users in production.

---

# 38. Observability

V1 requires basic structured logging.

Optional future additions:

- Error reporting provider
- Metrics
- Tracing

Do not introduce observability vendors unless needed for deployment.

---

# 39. Test Architecture

## Unit

- Pure utilities
- Validation
- Markdown
- SEO helpers
- Export helpers
- Slug logic

## Integration

- Database behavior
- Publishing visibility
- Relationship updates
- Reordering
- Authentication guards

## E2E

Use Playwright for complete flows.

Critical E2E:

```text
login
→ create page
→ write Markdown
→ publish
→ add navigation
→ public verification
→ unpublish/archive
→ public removal verification
```

---

# 40. Database Migration Strategy

Schema changes must use migrations.

Do not rely on destructive `db push` behavior for production.

Development tools may support schema synchronization, but checked-in migrations remain the deployment source of truth.

---

# 41. Seed Architecture

Seed script should be idempotent where practical or clearly require a fresh/demo database.

Seed content should demonstrate:

- Profile sidebar
- Dynamic navbar
- Posts
- Projects
- Markdown
- Education
- Experience
- Skills
- Publication

---

# 42. Docker Architecture

Suggested:

```text
docker-compose.yml

services:
  app
  postgres
  storage
```

Application should use environment variables for dependencies.

Do not assume `localhost` from inside the app container refers to PostgreSQL or storage.

Use Compose service names.

Example:

```text
postgres:5432
storage:9000
```

---

# 43. Local Development

Preferred developer workflow may run:

- PostgreSQL in Docker
- Object storage in Docker
- Next.js directly on host

Production/demo workflow can run all components through Docker Compose.

Document both if supported.

---

# 44. Security Boundaries

Primary trust boundaries:

```text
Public browser
   │
   ▼
Next.js application
   │
   ├── PostgreSQL
   └── S3 storage
```

All browser input is untrusted.

S3 credentials stay server-side.

Database credentials stay server-side.

Markdown output must be sanitized.

Admin session must be validated server-side.

---

# 45. File Upload Security

Uploads must be processed server-side.

Check:

- Auth
- Size
- MIME type
- Supported extension
- Generated key

Do not expose S3 credentials to the browser.

Presigned upload URLs may be introduced later if required for performance, but are not necessary for first implementation.

---

# 46. Performance Decisions

Public routes should minimize client JavaScript.

Interactive admin routes can use more client-side code where justified.

Images should use appropriate optimization.

Avoid loading admin dependencies into public bundles.

---

# 47. Accessibility Decisions

Public components should use semantic elements.

Admin components must preserve:

- Labels
- Keyboard interactions
- Focus management
- Accessible dialogs
- Accessible sortable/reorder controls

---

# 48. V1 Deployment Model

Target:

```text
Reverse proxy / HTTPS
        │
        ▼
Next.js app container
        │
        ├── PostgreSQL
        └── S3-compatible storage
```

The application should not require Kubernetes.

---

# 49. Future Scalability

If traffic grows:

1. Move PostgreSQL to managed/external database.
2. Move S3 storage to managed object storage.
3. Run multiple application replicas.
4. Add CDN.
5. Add Redis only if cache/session workload justifies it.
6. Add job worker only if scheduled/heavy asynchronous tasks exist.

Do not build these before they are needed.

---

# 50. Architectural Definition of Done

Architecture is being respected when:

- Public content is data-driven.
- Feature boundaries are clear.
- Business logic is not scattered through route files.
- Authentication is server-enforced.
- Markdown uses one rendering pipeline.
- Storage is provider-abstracted.
- Database changes use migrations.
- Public site stays lightweight.
- Admin complexity does not leak into public bundles.
- No unnecessary infrastructure has been added.
