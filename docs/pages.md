# Pages and Markdown

Milestone 4 adds database-backed custom pages at `/[slug]` and the protected page workspace at `/admin/pages`.

## Lifecycle

Pages are created as drafts and can be explicitly published, moved back to draft, archived, or deleted. Only rows with `status = published` resolve on the public route. Slugs are normalized when a page is created, remain independent from later title changes, reject reserved application paths, and are uniquely constrained by PostgreSQL.

The editor autosaves Markdown to `draft_markdown`. This is intentionally separate from canonical `content_markdown`: autosave can update the protected preview, but it cannot change an already-published page. Save, Publish, Move to draft, and Archive are explicit form actions that promote the current editor text to canonical content and clear the autosave draft.

The protected `/preview/pages/[id]` route requires an administrator session, uses the real public shell and page presentation, and sends `noindex` metadata. Anonymous requests are redirected to login.

## Markdown rendering

`src/lib/markdown/render.ts` is the single server-side rendering pipeline used by public pages, protected previews, and the editor preview. It supports:

- GitHub Flavored Markdown, tables, task lists, and footnotes
- Stable heading anchors
- Server-side Shiki highlighting for common code languages, with a plain-text fallback
- KaTeX math
- Mermaid code fences rendered by the browser only when a diagram exists

Raw HTML is disabled. The generated syntax tree is sanitized before trusted KaTeX, Mermaid, and Shiki transformations add their controlled output. Mermaid runs with strict security settings. Do not create a second Markdown pipeline for later content types.

## Editor

The CodeMirror 6 editor provides Markdown, preview, and split modes, an expanded view, and Markdown insertion controls. The image control inserts a normal Markdown URL reference. Uploads, drag-and-drop uploads, clipboard image uploads, and the media picker remain owned by Milestone 8.

Page-specific title, description, canonical URL, and Open Graph image URL overrides are available. The external Open Graph URL is an interim bridge until media storage exists; shared cross-content SEO helpers remain Milestone 11 work.

Navigation still uses the temporary public fixture. Adding pages to the public navbar is Milestone 5.
