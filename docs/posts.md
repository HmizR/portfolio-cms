# Posts and tags

Milestone 6 adds protected post management at `/admin/posts`, normalized tag management at `/admin/posts/tags`, public chronological writing at `/posts`, post details at `/posts/[slug]`, and RSS at `/feed.xml`.

## Publishing lifecycle

Posts are created as drafts. Only an explicit Publish action makes a post public and sets its timezone-aware first publication timestamp. Move to draft and Archive remove it from the public archive, detail route, caches, and RSS. Delete removes the post and its join rows. Slugs are generated only at creation unless the administrator explicitly edits one, and PostgreSQL enforces uniqueness.

Like pages, posts keep canonical `content_markdown` separate from nullable private `draft_markdown`. CodeMirror autosave changes only the private buffer and never changes publication status or currently public content. Save and lifecycle actions promote the editor value and clear the buffer. `/preview/posts/[id]` requires the administrator session, uses the real public shell and shared presentation, and is marked `noindex`.

## Tags

Tags are normalized rows with case-insensitive unique names and unique URL-safe slugs. `post_tags` relates posts and tags by UUID with a composite primary key and cascading foreign keys. Post updates replace tag assignments in the same transaction as the content update, so partial relationship changes cannot persist. Deleting a tag removes only its assignments, not its posts.

## Public presentation and RSS

`/posts` reads published posts in descending publication order and groups them by year in a restrained text-first archive. `/posts/[slug]` uses the single shared Markdown renderer. Draft and archived slugs return the intentional public 404 response.

`/feed.xml` is a Route Handler that emits RSS 2.0 containing published posts only, with absolute links based on `APP_URL`, escaped XML, publication dates, excerpts, and tag categories. Post lifecycle and tag mutations invalidate the public post cache and revalidate the archive, affected details, and feed.

Cover and social images accept validated external HTTP(S) URLs as a temporary bridge. Milestone 8 must replace these with relationships through the shared media/storage abstraction; it must not embed storage-provider calls into the post feature.
