# Media library and storage

Milestone 8 adds database-backed media management at `/admin/media` and keeps uploaded objects in the configured S3-compatible provider.

## Storage boundary

Feature code depends on the shared `StorageProvider` interface rather than MinIO-specific calls. The S3 adapter owns upload, read, and delete operations. Database records store generated storage keys such as `uploads/2026/08/<uuid>.png`; raw user filenames are retained only as metadata and never determine object identity.

The bucket remains private. Public media is served through `/media/[id]`, which validates the media UUID, resolves the database row, reads the object with server-side credentials, and returns the database-validated MIME type with `X-Content-Type-Options: nosniff`. `APP_URL` is used when a usable absolute URL is inserted into Markdown or copied from the library.

Compose's idempotent `storage-init` service creates the configured bucket. External S3-compatible deployments must create the bucket before starting the application; no anonymous bucket policy is required.

## Upload security

Every upload request independently validates the administrator session. The upload flow checks:

- the configured maximum request and file size;
- the allowlisted JPEG, PNG, WebP, GIF, or PDF MIME type;
- consistency between the declared MIME type and extension;
- the file signature rather than trusting browser metadata alone;
- decodable, bounded image dimensions;
- a server-generated UUID filename and year/month storage key.

SVG is intentionally rejected. S3 credentials never reach client code. If object upload succeeds but database persistence fails, the service attempts to remove the orphaned object and logs cleanup failure without exposing credentials.

## Library and editor behavior

The library supports upload, searchable grid selection, dimensions and size display, alt-text editing, usable URL copying, and confirmed deletion. Deleting a media row sets managed avatar, cover, and social-image foreign keys to null. Markdown links are intentionally portable URL text and cannot be rewritten automatically, so deletion warns that existing content links may stop working.

The shared CodeMirror editor opens the same image picker from its toolbar. Selecting or uploading an image inserts standard Markdown using the recorded alt text, with the original filename as a fallback. CodeMirror-native paste and drop handlers upload image files through the same authenticated endpoint; ordinary text paste and non-image drops continue through the editor normally. Uploading never changes publication state.

Profiles, pages, posts, and projects store nullable media IDs for managed images. Their former external URL fields remain compatibility fallbacks for existing installations, while managed media IDs take precedence in public rendering and metadata.
