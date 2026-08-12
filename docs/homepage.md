# Configurable homepage

Milestone 11.1 replaces the hardcoded root-page copy with controlled, database-backed sections. The administrator manages the complete homepage configuration at `/admin/homepage`; it is not a visual page builder.

## Sections

The finite section set is:

- Markdown introduction
- Featured projects
- Recent posts
- Featured publications
- Education
- Experience
- Custom page excerpt

Every section has persistent visibility, ordering, and a validated heading. Derived sections have an item count from 1 through 12. The page excerpt stores a stable `page_id` foreign key and can be shown only after selecting a published page. Internal slugs and URLs are resolved when rendering.

Markdown uses the shared CodeMirror editor and the one shared Markdown renderer. Homepage changes are saved explicitly as one complete configuration; there is no independent autosave or publication state.

## Persistence and security

`homepage_sections` contains one constrained row per type. Type and ordering uniqueness are enforced in PostgreSQL, while a Zod discriminated union validates each JSON configuration shape. Complete-list ordering is written transactionally. Every mutation independently requires the administrator session.

The initial migration seeds useful restrained defaults. Sections without eligible content render nothing rather than placeholder cards. Deleting a selected page sets its homepage relationship to null.

## Public filtering and caching

The public `/` route is server-rendered and reads visible sections in persisted order. Post, project, publication, and custom-page sections use published records only; project and publication sections additionally require their featured flag. Education and experience reuse their structured ordered records.

Homepage configuration uses a dedicated public cache tag. Saving homepage configuration expires that tag and revalidates `/`. Mutations to posts, projects, publications, pages, education, experience, profile, and appearance also revalidate the root route when their data can affect it.
