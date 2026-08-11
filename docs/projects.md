# Projects and technologies

Milestone 7 adds protected project management at `/admin/projects`, normalized technology management at `/admin/projects/technologies`, a public project index at `/projects`, details at `/projects/[slug]`, and authenticated public-layout previews at `/preview/projects/[id]`.

## Two independent lifecycles

CMS publication status controls visibility: draft and archived projects are private, while published projects appear on public routes. Project lifecycle status describes the work itself and is independently constrained to `planned`, `active`, `completed`, or `archived`. Archiving the work as a project lifecycle choice does not automatically change CMS visibility; the explicit CMS Archive action does.

The first Publish action records a timezone-aware publication timestamp. Optional start/end dates use PostgreSQL dates, and both Zod and the database reject an end date before the start date. Slugs remain stable unless explicitly edited and are uniquely constrained.

## Markdown, preview, and autosave

Projects use the same shared CodeMirror component and sanitized Markdown renderer as pages and posts. Autosave writes only `draft_markdown`; public content remains in canonical `content_markdown`. Save and lifecycle actions promote current editor text. The preview route requires the administrator session, uses the real public shell, and is marked `noindex`.

## Technologies and featured ordering

Technologies are normalized records with case-insensitive unique names and unique slugs. `project_technologies` relates stable UUIDs with a composite primary key, cascading cleanup, and explicit ordering. Project content and its complete technology assignment are updated in one transaction.

Published projects are ordered with featured projects first, then by start/publication recency. The index uses a restrained text-first presentation and exposes project lifecycle, dates, and technologies. The detail page renders Markdown and validated GitHub, demo, and external project links in new tabs with `noopener noreferrer`.

Public reads share `PUBLIC_PROJECTS_CACHE_TAG`. Project and technology mutations invalidate the index and affected details. Cover and social images support managed media IDs through the shared storage abstraction. Existing validated external HTTP(S) URLs remain compatibility fallbacks; managed media takes precedence.
