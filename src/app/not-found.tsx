import Link from "next/link";

import { PublicShell } from "@/components/public/public-shell";
import { getPublicSiteData } from "@/features/profile/queries";
import { publicNavigationFixture } from "@/features/public-shell/public-shell.fixtures";

export default async function NotFound() {
  const site = await getPublicSiteData();
  return (
    <PublicShell navigation={publicNavigationFixture} site={site}>
      <div className="border-b border-slate-200 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--public-accent)]">404</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-slate-950">
          Page not found
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
          The page you requested does not exist or may have moved.
        </p>
      </div>
      <Link
        className="mt-8 inline-flex font-semibold text-[var(--public-accent)] underline decoration-current/30 underline-offset-4 hover:decoration-current"
        href="/"
      >
        Return to the homepage
      </Link>
    </PublicShell>
  );
}
