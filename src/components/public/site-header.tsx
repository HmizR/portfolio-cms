import { ChevronDown } from "lucide-react";
import Link from "next/link";

import type { PublicNavigationItem } from "@/features/navigation/destination";

interface SiteHeaderProps {
  navigation: PublicNavigationItem[];
  siteName: string;
}

function NavigationLinks({ navigation }: Pick<SiteHeaderProps, "navigation">) {
  return (
    <ul className="flex items-center gap-7">
      {navigation.map((item) => (
        <li key={item.id}>
          <Link
            className="text-sm font-medium text-slate-600 underline-offset-8 transition-colors hover:text-[var(--public-accent)] hover:underline focus-visible:text-[var(--public-accent)]"
            href={item.href}
            rel={item.openNewTab ? "noopener noreferrer" : undefined}
            target={item.openNewTab ? "_blank" : undefined}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader({ navigation, siteName }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-stone-50/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-[var(--public-max-width)] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link
          className="font-serif text-lg font-semibold tracking-tight text-slate-900 underline-offset-8 hover:text-[var(--public-accent)] focus-visible:text-[var(--public-accent)]"
          href="/"
        >
          {siteName}
        </Link>

        {navigation.length > 0 ? <nav aria-label="Primary navigation" className="hidden md:block">
          <NavigationLinks navigation={navigation} />
        </nav> : null}

        {navigation.length > 0 ? <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-sm px-2 py-2 text-sm font-semibold text-slate-700 hover:text-[var(--public-accent)] focus-visible:text-[var(--public-accent)] [&::-webkit-details-marker]:hidden">
            Menu
            <ChevronDown
              aria-hidden="true"
              className="size-4 transition-transform group-open:rotate-180"
              strokeWidth={1.8}
            />
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-[calc(100%+0.5rem)] w-52 rounded-sm border border-slate-200 bg-white p-2 shadow-lg shadow-slate-950/5"
          >
            <ul>
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    className="block rounded-sm px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-stone-100 hover:text-[var(--public-accent)] focus-visible:bg-stone-100 focus-visible:text-[var(--public-accent)]"
                    href={item.href}
                    rel={item.openNewTab ? "noopener noreferrer" : undefined}
                    target={item.openNewTab ? "_blank" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details> : null}
      </div>
    </header>
  );
}
