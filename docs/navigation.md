# Navigation

Milestone 5 replaces the temporary public fixture with ordered navigation stored in PostgreSQL and managed at `/admin/navigation`.

## Destinations

Each item has one validated destination shape:

- `page` stores a stable page ID. The public href is resolved from the page's current slug, and the item is omitted unless that page is published.
- `posts`, `projects`, `publications`, and `cv` resolve to their finite built-in routes without storing a redundant URL.
- `external` stores an absolute HTTP(S) URL.

Database checks reject mixed shapes such as an external URL with a page ID. Deleting a page cascades to its page navigation items so broken relationships are not retained. Built-in destinations may be configured before their owning content milestone, but naturally return the application's not-found page until that route exists.

## Visibility and links

Only visible items are returned to the public shell. New-tab behavior is supported for every destination; rendered links include `noopener noreferrer`. Page lifecycle changes invalidate navigation, so draft and archived page targets disappear from the navbar without deleting their page content.

## Ordering

The admin list supports native drag-and-drop and explicit Move up/Move down buttons as the keyboard-accessible alternative. Both paths submit the complete ordered ID list. The server verifies that it exactly matches the current navigation set and writes contiguous sort positions inside one transaction. Deletion also compacts positions transactionally.

Public navigation is cached behind one shared tag and ordered by `sort_order`, with creation time as a deterministic tie-breaker. Navigation mutations invalidate the public layout and admin route immediately.
