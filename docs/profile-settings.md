# Profile and settings

Milestone 3 makes the public owner identity and basic presentation settings database-driven.

## Administrator routes

- `/admin/profile` manages full name, headline, biographies, location, public email, avatar URL, and social links.
- `/admin/appearance` manages site title, site description, and controlled appearance presets.

Both pages are protected by the admin layout. Their server actions independently call the authentication guard and validate all submitted values with Zod. Public database reads are deferred until request time, cached with a dedicated tag, and invalidated together with the public layout after successful mutations. This keeps image builds independent of a live database without discarding public-data caching.

Social links accept arbitrary platform names instead of a fixed network enum. Each link stores a display label, absolute HTTP(S) URL, optional icon identifier, visibility, and persistent sort order. The editor supports adding, removing, and keyboard-operable up/down reordering.

## Appearance boundary

Appearance is intentionally constrained to safe presets:

- accent: teal, blue, burgundy, or violet
- content width: compact, standard, or wide
- profile image: circle, rounded, or square
- typography: classic or modern

The public shell exposes those choices as scoped CSS variables/data attributes. Arbitrary CSS and a generic theme builder are out of scope.

The avatar supports a managed media relationship selected from the storage-backed library. Root-relative paths and absolute HTTP(S) URLs remain accepted as compatibility fallbacks; managed media takes precedence publicly.

## Initialization and fallback

First-time administrator setup creates profile and site-settings rows in the same setup workflow. Migration `0001_public_chameleon.sql` backfills them for an existing administrator. Before setup, public queries return an intentional neutral empty state so the public route can render without seeded owner content.
