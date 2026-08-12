# Academic portfolio

Milestone 9 adds browser-managed publications, education, experience, and skills.

## Publications

Use `/admin/publications` to create private drafts, edit metadata and optional Markdown, preview the real public presentation, publish, archive, and delete scholarly work. Published records appear featured-first and then by publication date at `/publications`; details use `/publications/[slug]`. Draft and archived records return 404 publicly.

Publication types are finite: journal, conference, preprint, thesis, book, chapter, report, and other. DOI values are stored in canonical identifier form, while external and author-profile links accept only absolute HTTP(S) URLs. Authors are child rows with explicit zero-based positions and may be moved with keyboard-accessible buttons. Publication updates replace the complete author list in the same database transaction as the parent update.

Optional Markdown uses the shared CodeMirror editor and renderer. Autosave writes only `draft_markdown`; an explicit save or lifecycle action promotes editor content to canonical `content_markdown`. Preview is authenticated and marked no-index.

PDF attachments reference an existing managed `application/pdf` media row. Social images reference an uploaded image. Both are checked again on the server, foreign keys use `ON DELETE SET NULL`, and public downloads continue through the private-bucket `/media/[id]` boundary.

## Education and experience

Use `/admin/education` and `/admin/experience` to manage structured timeline records. Both support optional exact dates, location, safe organization links, Markdown descriptions, current-state flags, deletion, and explicit up/down ordering. Database constraints reject negative order, inverted date ranges, and end dates on current records.

These records are structured sources for controlled consumers. Milestone 10 now renders enabled education and experience sections on `/cv`; there is still no standalone public timeline route.

## Skills

Use `/admin/skills` to manage a skill name, free-text category, visibility, and explicit order. A case-insensitive database constraint prevents duplicate names within one category. V1 intentionally does not store or render arbitrary percentage/proficiency bars.

## Cache and authorization

Every academic mutation independently calls `requireAdmin()`. Public publication reads use the `public-publications` cache tag; publication lifecycle and content changes invalidate the archive, affected detail routes, and `/cv`. Education, experience, and skills are server-rendered into enabled CV sections without adding their data to the public JavaScript bundle, and their mutations revalidate `/cv`.
