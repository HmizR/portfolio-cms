# REQUIREMENTS.md

# PortfolioCMS — Product Requirements

## 1. Product Summary

PortfolioCMS is a self-hosted academic and professional portfolio website inspired by the layout, information hierarchy, and restrained visual style of Academic Pages.

The public website should feel close to Academic Pages: a simple top navigation bar, profile/sidebar area, content-focused typography, strong readability, and responsive behavior.

The key difference is that PortfolioCMS is managed through a protected web-based admin panel instead of editing source files, YAML configuration, or Markdown files manually.

The system must allow the owner to manage profile information, navigation, pages, posts, projects, publications, education, experience, skills, media, appearance, SEO, and portfolio content from the browser.

The application should be useful both as:

1. A serious software engineering project suitable for academic submission.
2. A real personal portfolio that can continue to be used after the project is submitted.

---

## 2. Product Goals

The application must:

- Preserve the clean academic/professional feel of Academic Pages.
- Allow almost all portfolio content to be managed without editing source code.
- Use Markdown as the primary long-form authoring format.
- Provide a polished, secure admin panel.
- Store structured content in PostgreSQL.
- Store uploaded files in S3-compatible object storage.
- Remain portable through Markdown/data export.
- Be easy to run locally and deploy through Docker.
- Have a maintainable modular architecture.
- Be production-quality enough for long-term personal use.
- Avoid unnecessary complexity.

---

## 3. Non-Goals

Version 1 must NOT attempt to become a general-purpose WordPress replacement.

The following are explicitly out of scope for V1:

- Plugin system
- Theme marketplace
- Multi-tenancy
- Visual drag-and-drop page builder
- User comments
- Newsletter system
- E-commerce
- Social networking
- Complicated role-based access control
- Multiple organizations
- Multiple portfolio owners
- AI-generated content
- Analytics platform
- Elasticsearch
- Microservices
- Redis unless a demonstrated need appears
- Background workers unless a demonstrated need appears

---

## 4. Primary Users

### 4.1 Public Visitor

A public visitor can:

- View the portfolio homepage.
- Browse custom pages.
- Browse posts.
- Browse projects.
- Browse publications.
- View the CV.
- Use navigation links.
- View responsive content on desktop and mobile.
- Access search-engine-friendly URLs.
- View SEO metadata and social previews.

A public visitor cannot:

- Access drafts.
- Access the admin panel.
- Modify content.
- View private system information.

### 4.2 Administrator

V1 supports one logical administrator role.

The administrator can:

- Sign in.
- Sign out.
- Manage profile information.
- Manage social links.
- Manage navigation.
- Create, edit, preview, publish, archive, and delete pages.
- Create, edit, preview, publish, archive, and delete posts.
- Manage tags.
- Create, edit, preview, publish, archive, and delete projects.
- Manage project technologies.
- Create, edit, preview, publish, archive, and delete publications.
- Manage education.
- Manage experience.
- Manage skills.
- Manage homepage sections.
- Manage basic appearance settings.
- Upload and manage media.
- Configure SEO defaults.
- Export content.
- Configure CV sections.

V1 does not require multiple roles.

---

# 5. Public Website Requirements

## 5.1 Global Layout

The public website must use:

- A top header/navigation area.
- A desktop profile/sidebar area.
- A main content column.
- A responsive mobile layout.
- A restrained academic/professional visual style.
- Strong typography and readable content width.

The public frontend must NOT look like a generic SaaS dashboard.

The visual target should be close in spirit to Academic Pages without copying implementation code.

---

## 5.2 Header

The header must:

- Show the site name or owner name.
- Render navigation items dynamically from the database.
- Support internal and external navigation destinations.
- Support open-in-new-tab behavior.
- Hide invisible navigation items.
- Preserve configured order.
- Collapse appropriately on mobile.

Navigation items must not be hardcoded.

---

## 5.3 Profile Sidebar

The profile/sidebar must support:

- Avatar
- Full name
- Headline
- Short biography
- Location
- Email
- Social links

Social links must be data-driven.

The sidebar must collapse or reposition appropriately on smaller screens.

---

## 5.4 Homepage

The homepage must support configurable sections.

V1 section types:

- Markdown introduction
- Featured projects
- Recent posts
- Featured publications
- Education
- Experience
- Custom page excerpt

The administrator must be able to:

- Reorder homepage sections.
- Enable or disable sections.
- Configure reasonable options such as item counts where applicable.

Homepage content and configuration must be stored in PostgreSQL and managed through
`/admin/homepage`. The public `/` route must not depend on hardcoded portfolio copy once this
feature is implemented.

Section configuration must use controlled, type-specific validation. References to custom pages
or selected content must use stable database IDs rather than persisted slugs or public URLs.
Sections that derive items from posts, projects, publications, education, or experience must show
only records eligible for public display. Markdown introduction content must use the shared
Markdown rendering pipeline.

Do not implement arbitrary free-form visual composition.

---

## 5.5 Custom Pages

Public route:

`/[slug]`

Custom pages must support:

- Title
- Slug
- Excerpt
- Markdown content
- Draft/published/archived state
- Publish date
- Optional title visibility
- Optional profile sidebar visibility
- SEO title
- SEO description
- Open Graph image
- Canonical URL override

Reserved slugs must not be allowed.

Reserved slugs include at least:

- admin
- api
- login
- setup
- posts
- projects
- publications
- cv

---

## 5.6 Posts

Routes:

- `/posts`
- `/posts/[slug]`

Posts must support:

- Title
- Slug
- Excerpt
- Markdown content
- Cover image
- Tags
- Draft/published/archived state
- Publish date
- SEO fields
- Social image

The post index should use a chronological academic/blog presentation rather than excessive cards.

The post index should group or sort posts chronologically.

---

## 5.7 Projects

Routes:

- `/projects`
- `/projects/[slug]`

Projects must support:

- Title
- Slug
- Summary
- Markdown content
- Cover image
- GitHub URL
- Demo URL
- External URL
- Technologies
- Featured state
- Project lifecycle status
- Start date
- End date
- CMS publication status
- SEO fields

Project lifecycle status:

- planned
- active
- completed
- archived

This is separate from CMS publication status.

---

## 5.8 Publications

Routes:

- `/publications`
- `/publications/[slug]`

Publications must support:

- Title
- Slug
- Abstract
- Optional Markdown body
- Publication type
- Venue
- Publisher
- Authors
- Publication date
- DOI
- External URL
- PDF attachment
- Featured state
- CMS publication status
- SEO fields

Publication types should include:

- journal
- conference
- preprint
- thesis
- book
- chapter
- report
- other

---

## 5.9 CV

Route:

`/cv`

The CV must be generated from structured portfolio data.

Possible sections:

- Profile
- Education
- Experience
- Selected Projects
- Publications
- Skills

The administrator must be able to:

- Enable or disable sections.
- Reorder sections.
- Select which projects appear when appropriate.

The CV must have print styles so browser printing can produce a clean PDF.

Print output must hide:

- Public navigation
- Sidebar UI that does not belong in the CV
- Buttons
- Decorative controls

---

# 6. Admin Panel Requirements

## 6.1 Admin Routes

The admin panel should use routes similar to:

- `/admin`
- `/admin/pages`
- `/admin/posts`
- `/admin/projects`
- `/admin/publications`
- `/admin/education`
- `/admin/experience`
- `/admin/skills`
- `/admin/profile`
- `/admin/navigation`
- `/admin/homepage`
- `/admin/media`
- `/admin/appearance`
- `/admin/seo`
- `/admin/data`
- `/admin/account`

Exact nesting may change if architecture requires it, but responsibilities must remain clear.

---

## 6.2 Dashboard

The dashboard should show:

- Page count
- Post count
- Draft count
- Project count
- Featured project count
- Recent content updates
- Quick actions

Do not build a complicated analytics system.

---

## 6.3 Admin Navigation

The admin panel should use a clear sidebar.

Suggested groups:

### Content
- Pages
- Posts
- Projects
- Publications

### Portfolio
- Education
- Experience
- Skills

### Website
- Profile
- Navigation
- Homepage
- Media
- Appearance

### System
- SEO
- Data
- Account

---

# 7. Authentication Requirements

## 7.1 First-Time Setup

A fresh installation must not ship with a default password.

Behavior:

- If no administrator exists, `/setup` is available.
- `/setup` allows creation of the first administrator.
- After an administrator exists, `/setup` must become inaccessible.

Setup fields:

- Name
- Email
- Password
- Confirm password

---

## 7.2 Login

Route:

`/login`

Requirements:

- Email/password authentication.
- Secure password hashing.
- Server-side authorization.
- Secure session cookies.
- Logout support.
- Rate limiting for authentication attempts where practical.

Passwords must never be logged.

Sessions must not be stored in localStorage.

---

## 7.3 Admin Route Protection

All `/admin/**` routes must require authentication.

Authorization must be enforced on the server.

Hiding UI elements is not an authorization mechanism.

All write operations must independently verify authorization.

---

# 8. Content Status

Publishable content uses:

- draft
- published
- archived

Behavior:

### Draft
- Visible in admin.
- Not publicly accessible.
- Can be previewed by authorized administrator.

### Published
- Publicly accessible.
- Included in sitemap where appropriate.

### Archived
- Preserved in admin.
- Removed from normal public access.

Scheduled publishing is not required for V1.

---

# 9. Markdown Requirements

Markdown is the primary long-form content format.

Supported syntax must include:

- Headings
- Bold
- Italic
- Blockquotes
- Ordered lists
- Unordered lists
- Task lists
- Links
- Images
- Tables
- Horizontal rules
- Inline code
- Fenced code blocks
- Syntax highlighting
- Footnotes
- Heading anchors
- GitHub-flavored Markdown
- Mathematical notation
- Mermaid diagrams

The same rendering implementation must be used for:

- Admin preview
- Public pages
- Posts
- Projects
- Publications

Avoid separate renderers that can produce inconsistent output.

---

# 10. Markdown Editor Requirements

Use CodeMirror 6 unless a strong technical reason requires a change.

Editor modes:

- Markdown
- Preview
- Split

Editor features:

- Markdown syntax highlighting
- Toolbar for common syntax
- Keyboard-friendly editing
- Live preview
- Fullscreen or expanded writing mode
- Image insertion
- Drag-and-drop image upload
- Clipboard image paste
- Autosave indicator
- Explicit publish action

Autosave must save changes without automatically publishing.

---

# 11. Slug Requirements

Slugs:

- Use lowercase.
- Use letters, digits, and hyphens.
- Must be validated server-side.
- Must be unique within the relevant content type.
- May be generated automatically for new content.
- Must remain stable after creation unless explicitly changed by the administrator.

Changing a title must not automatically change an existing slug.

---

# 12. Navigation Management

Navigation items must support:

- Label
- Type
- Internal destination
- External URL
- Display order
- Visibility
- Open in new tab

Suggested navigation types:

- page
- posts
- projects
- publications
- cv
- external

Navigation must support drag-and-drop ordering in admin.

A keyboard-accessible alternative must exist.

---

# 13. Profile Requirements

Profile fields:

- Full name
- Headline
- Short biography
- Long biography where useful
- Location
- Email
- Avatar

Social links must support:

- Platform
- Label
- URL
- Icon identifier
- Sort order
- Visibility

Do not hardcode a fixed list of social networks into the database schema.

---

# 14. Education Requirements

Education records:

- Institution
- Institution URL
- Degree
- Field
- Location
- Start date
- End date
- Currently studying
- Markdown description
- Sort order

---

# 15. Experience Requirements

Experience records:

- Organization
- Organization URL
- Position
- Location
- Start date
- End date
- Currently working
- Markdown description
- Sort order

---

# 16. Skills Requirements

Skills:

- Name
- Category
- Sort order
- Visibility

Do not use arbitrary skill percentage bars in V1.

---

# 17. Tags and Technologies

Posts can have tags.

Projects can have technologies.

Tags and technologies must be normalized instead of stored as comma-separated strings.

---

# 18. Media Requirements

Use S3-compatible object storage.

Media records must store:

- ID
- Storage key
- Filename
- Original filename
- MIME type
- File size
- Width when relevant
- Height when relevant
- Alt text
- Created date

The canonical database value must be the storage key rather than a permanently hardcoded public URL.

---

## 18.1 Media Library

Admin media library must support:

- Upload
- List/grid view
- Search
- Select
- Delete
- Edit alt text
- Copy usable URL or insert into content

---

## 18.2 Upload Validation

At minimum allow:

- image/jpeg
- image/png
- image/webp
- image/gif
- application/pdf

Validate:

- MIME type
- Maximum size
- File extension consistency where practical
- Generated server-side filename/storage key

Do not trust the user-supplied filename.

SVG is out of scope for initial V1 unless secure sanitization is added.

---

# 19. Preview Requirements

Draft content must support preview.

Preview should use the real public presentation rather than a visually unrelated admin approximation.

Preview access must require administrator authorization and must not make drafts publicly discoverable.

Implementation may use secure preview sessions or equivalent server-side mechanisms.

---

# 20. SEO Requirements

Global SEO settings:

- Site title
- Default description
- Default Open Graph image
- Base URL
- Social metadata defaults

Content-specific SEO:

- SEO title
- SEO description
- Open Graph image
- Canonical URL override

Generate appropriate metadata for:

- Homepage
- Pages
- Posts
- Projects
- Publications
- CV

---

# 21. Structured Data

Use JSON-LD where appropriate.

Possible schemas:

- Person
- WebSite
- BlogPosting
- ScholarlyArticle
- BreadcrumbList

Only emit structured data that accurately represents the page.

---

# 22. Sitemap and Robots

Provide:

- `/sitemap.xml`
- `/robots.txt`

Sitemap should include published public content only.

---

# 23. RSS

Provide:

`/feed.xml`

RSS should contain published posts.

---

# 24. Appearance Requirements

V1 appearance customization should remain controlled.

Possible settings:

- Light/dark/system theme
- Accent color
- Content width
- Profile image shape
- Typography option

Do not allow arbitrary custom CSS through the admin panel in V1.

Use design tokens/CSS variables.

---

# 25. Data Portability

Markdown portability is a core product requirement.

The system must support export of individual Markdown content where practical.

Exported Markdown should use frontmatter.

Example:

```markdown
---
title: "Understanding RAG"
slug: "understanding-rag"
status: published
date: 2026-08-08
tags:
  - AI
  - RAG
---

# Understanding RAG

Content...
```

---

## 25.1 Full Export

Provide a full portfolio export.

Suggested structure:

```text
portfolio-export.zip
├── manifest.json
├── pages/
├── posts/
├── projects/
├── publications/
├── media/
└── settings.json
```

Exact format may evolve but must be documented and versioned.

Import may be implemented after export if schedule requires prioritization, but export is required for V1.

---

# 26. Docker Requirements

The project must be deployable with Docker.

Expected services:

- Application
- PostgreSQL
- S3-compatible object storage for local/self-hosted deployments

Suggested local object storage:

- RustFS or another S3-compatible implementation

A production deployment may use external S3-compatible storage.

Provide:

- `Dockerfile`
- `docker-compose.yml`
- `.env.example`

---

# 27. Environment Configuration

Environment variables should include at least:

```env
DATABASE_URL=

APP_URL=
AUTH_SECRET=

S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_FORCE_PATH_STYLE=true

MAX_UPLOAD_SIZE_MB=10
```

All required environment variables must be documented.

Secrets must not be committed.

---

# 28. Validation Requirements

All writes must be validated server-side.

Use:

- Zod validation
- Database constraints
- Client validation for user experience

Client validation does not replace server validation.

---

# 29. Security Requirements

At minimum:

- Secure password hashing
- Server-side authorization
- Secure cookies
- CSRF-aware mutation design
- Login rate limiting where practical
- Input validation
- Safe Markdown rendering
- Safe upload handling
- No secret logging
- No password logging
- No session token logging
- No arbitrary executable uploads
- No direct trust in client-side authorization state

---

# 30. Accessibility Requirements

Target strong baseline accessibility.

Requirements:

- Semantic HTML
- Logical heading hierarchy
- Keyboard navigation
- Visible focus states
- Form labels
- Alternative text support
- Sufficient contrast
- Skip-to-content link
- Accessible admin interactions
- Drag-and-drop alternatives

---

# 31. Performance Requirements

Public website should aim for:

- Lighthouse Performance > 90
- Accessibility > 90
- Best Practices > 90
- SEO > 90

These are targets, not reasons to introduce unsafe hacks or unnecessary complexity.

Public content should use Next.js caching/revalidation where appropriate.

---

# 32. Error Handling

Implement intentional:

- 404 pages
- Error boundaries
- Empty states
- Loading states
- Form validation messages
- Upload error messages
- Database error handling
- Authentication errors

Avoid silent failures.

---

# 33. Logging

Use structured server logging where practical.

Never log:

- Passwords
- Password hashes
- Session tokens
- Authentication secrets
- S3 secrets

---

# 34. Testing Requirements

Use:

- Vitest for unit/integration tests where appropriate.
- Playwright for critical end-to-end behavior.

Critical unit areas:

- Slug generation
- Markdown processing
- Validation
- SEO metadata generation
- Export formatting

Critical integration areas:

- Database queries
- Publishing rules
- Navigation ordering
- Authentication guards

Critical E2E flow:

1. Login.
2. Create a page named "Hello".
3. Add Markdown.
4. Publish the page.
5. Add the page to navigation.
6. Open the public website.
7. Verify "Hello" appears in navigation.
8. Open `/hello`.
9. Verify Markdown is rendered.
10. Unpublish/archive the page.
11. Verify public access is removed.

---

# 35. Demo Data

Provide a database seed command.

Suggested command:

```bash
npm run db:seed
```

Seed data should create:

- Sample profile
- Navigation
- Several posts
- Several projects
- Education
- Experience
- Skills
- Optional sample publication

The seeded public site should immediately look complete enough for demonstration.

---

# 36. Documentation Requirements

Repository should include:

- `README.md`
- `REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `AGENTS.md`
- `PROGRESS.md`
- `.env.example`
- Deployment documentation
- Database documentation
- Architecture diagrams where useful

Suggested docs directory:

```text
docs/
├── architecture.md
├── database.md
├── deployment.md
├── screenshots/
└── diagrams/
```

---

# 37. V1 Definition of Done

V1 is complete only when all required items below work together:

- Academic Pages-inspired public design
- Responsive layout
- First-time administrator setup
- Secure login/logout
- Protected admin panel
- Profile management
- Social links
- Dynamic navigation
- Homepage configuration
- Custom pages
- Markdown editor
- Live preview
- Draft/published/archived workflow
- Posts
- Tags
- Projects
- Technologies
- Publications
- Education
- Experience
- Skills
- Media library
- S3-compatible storage
- CV generation
- Print-friendly CV
- SEO metadata
- Sitemap
- Robots
- RSS
- Docker
- Database migrations
- Seed data
- Markdown/data export
- Critical automated tests
- Production-quality error states
- Documentation

---

# 38. Future Features

Only consider after V1 is stable:

- Revision history
- Scheduled publishing
- PostgreSQL full-text search
- Analytics
- Multiple administrators
- Additional themes
- Public API
- Import from Academic Pages
- Import full portfolio export
- Additional CV templates
- Server-generated PDF
- Content scheduling
- Advanced search
