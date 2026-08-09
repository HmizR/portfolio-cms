# Public shell

Milestone 1 established the responsive, server-rendered public presentation. Milestone 3 connects its owner identity and visual presets to PostgreSQL while preserving the Server Component boundary.

## Structure

- `src/app/(public)/layout.tsx` applies the public shell only to public routes.
- `src/components/public/` owns the header, profile sidebar, main shell, and footer.
- `src/features/profile/queries.ts` supplies typed public site, profile, appearance, and visible social-link data.
- `src/features/public-shell/public-shell.fixtures.ts` remains the temporary source for navigation only.
- `src/app/not-found.tsx` provides an intentional public 404 state using the same shell.

Milestone 5 will replace fixture navigation. Public components receive all data through typed props rather than importing database code directly.

## Responsive behavior

The desktop shell uses a restrained profile sidebar beside a readable content column. On narrow screens the sidebar moves above the main content, navigation uses a native keyboard-operable disclosure, and spacing and type scale down without horizontal overflow.

The shell includes a skip-to-content link, visible focus styles, semantic landmarks, reduced-motion handling, descriptive image alternative text, and new-tab notices for external profile links. It remains a Server Component tree and adds no client-side JavaScript.

Before first-time setup, the public shell intentionally renders a neutral PortfolioCMS identity and an empty profile rather than inventing owner content. Setup creates the initial profile/settings rows, and every profile or appearance mutation revalidates the public layout.
