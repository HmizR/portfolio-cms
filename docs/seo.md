# SEO

Milestone 11 centralizes public metadata in `src/features/seo`. The shared builder combines the validated deployment base URL, global defaults, and route-specific content without duplicating canonical, Open Graph, or X/Twitter logic in route files.

## Configuration

- Site title and default description remain in `/admin/appearance`.
- `/admin/seo` manages the default social image and optional X/Twitter handle.
- `APP_URL` is the canonical base URL and is validated centrally. Change it in the deployment environment, not in content records.
- Pages, posts, projects, and publications can override title, description, canonical URL, and social image. Managed media is preferred; validated external image URLs remain compatibility fallbacks.

## Public output

- Homepage, archives, detail routes, and CV produce canonical Open Graph and X/Twitter metadata.
- The homepage emits accurate `WebSite` and `Person` JSON-LD.
- Posts emit `BlogPosting`; publications emit `ScholarlyArticle`. JSON-LD is serialized with `<` escaped to prevent script-tag injection.
- `/sitemap.xml` contains the public indexes, CV, and published pages, posts, projects, and publications only.
- `/robots.txt` advertises the sitemap while disallowing admin, authentication, setup, and preview routes.

The default social image relationship uses `ON DELETE SET NULL`, so deleting media safely returns metadata to a no-image fallback. Public metadata changes are revalidated with the existing public settings cache boundary.
