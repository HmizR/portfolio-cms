# Public shell

Milestone 1 establishes the responsive, server-rendered public presentation without introducing database models owned by later milestones.

## Structure

- `src/app/(public)/layout.tsx` applies the public shell only to public routes.
- `src/components/public/` owns the header, profile sidebar, main shell, and footer.
- `src/features/public-shell/public-shell.fixtures.ts` is the single temporary source for site, navigation, profile, and social-link fixtures.
- `src/app/not-found.tsx` provides an intentional public 404 state using the same shell.

The fixture boundary is temporary. Milestone 3 replaces profile and site fixtures with database data; Milestone 5 replaces fixture navigation. Public components should receive that data through typed props rather than importing database code directly.

## Responsive behavior

The desktop shell uses a restrained profile sidebar beside a readable content column. On narrow screens the sidebar moves above the main content, navigation uses a native keyboard-operable disclosure, and spacing and type scale down without horizontal overflow.

The shell includes a skip-to-content link, visible focus styles, semantic landmarks, reduced-motion handling, descriptive image alternative text, and new-tab notices for external profile links. It remains a Server Component tree and adds no client-side JavaScript.
