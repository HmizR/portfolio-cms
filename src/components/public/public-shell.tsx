import type { ReactNode } from "react";

import { ProfileSidebar } from "@/components/public/profile-sidebar";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import type { PublicShellFixture } from "@/features/public-shell/public-shell.fixtures";

interface PublicShellProps {
  children: ReactNode;
  fixture: PublicShellFixture;
}

export function PublicShell({ children, fixture }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        className="fixed left-4 top-3 z-50 -translate-y-20 rounded-sm bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>

      <SiteHeader navigation={fixture.navigation} siteName={fixture.siteName} />

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-5 py-10 sm:px-8 sm:py-14 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12 lg:grid-cols-[12rem_minmax(0,42rem)] lg:justify-between lg:gap-20 lg:px-10 lg:py-16">
        <ProfileSidebar owner={fixture.owner} socialLinks={fixture.socialLinks} />
        <main id="main-content" className="min-w-0 scroll-mt-24" tabIndex={-1}>
          {children}
        </main>
      </div>

      <SiteFooter ownerName={fixture.owner.name} />
    </div>
  );
}
