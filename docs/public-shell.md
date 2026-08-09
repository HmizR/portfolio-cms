# Public shell

Milestone 1 established the responsive, server-rendered public presentation. Milestones 3 and 5 connect its owner identity, visual presets, and navigation to PostgreSQL while preserving the Server Component boundary.

## Structure

- `src/app/(public)/layout.tsx` applies the public shell only to public routes.
- `src/components/public/` owns the header, profile sidebar, main shell, and footer.
- `src/features/profile/queries.ts` supplies typed public site, profile, appearance, and visible social-link data.
- `src/features/navigation/queries.ts` supplies ordered visible navigation and omits unpublished page targets.
- `src/app/not-found.tsx` provides an intentional public 404 state using the same shell.

Public components receive all data through typed props rather than importing database code directly. Profile/site data and navigation use separate cache tags so mutations invalidate only the relevant public data.

## Responsive behavior

The desktop shell uses a restrained profile sidebar beside a readable content column. On narrow screens the sidebar moves above the main content, navigation uses a native keyboard-operable disclosure, and spacing and type scale down without horizontal overflow.

The shell includes a skip-to-content link, visible focus styles, semantic landmarks, reduced-motion handling, descriptive image alternative text, and protected new-tab links. The mobile menu uses a native disclosure, and an empty navigation set omits both desktop and mobile navigation controls. The shell remains a Server Component tree and adds no client-side JavaScript.

Before first-time setup, the public shell intentionally renders a neutral PortfolioCMS identity and an empty profile rather than inventing owner content. Setup creates the initial profile/settings rows, and every profile or appearance mutation revalidates the public layout.
