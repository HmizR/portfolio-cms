import type { ReactNode } from "react";

import { ProfileSidebar } from "@/components/public/profile-sidebar";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import type { PublicNavigationItem } from "@/features/navigation/destination";
import type { PublicSiteData } from "@/features/profile/queries";

interface PublicShellProps {
  children: ReactNode;
  navigation: PublicNavigationItem[];
  printLayout?: "cv";
  showSidebar?: boolean;
  site: PublicSiteData;
}

export function PublicShell({ children, navigation, printLayout, showSidebar = true, site }: PublicShellProps) {
  return (
    <div className="public-site flex min-h-screen flex-col" data-accent={site.appearance.accentColor} data-content-width={site.appearance.contentWidth} data-print-layout={printLayout} data-typography={site.appearance.typography}>
      <a
        className="fixed left-4 top-3 z-50 -translate-y-20 rounded-sm bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>

      <SiteHeader navigation={navigation} siteName={site.appearance.siteTitle} />

      <div className={showSidebar ? "mx-auto grid w-full max-w-[var(--public-max-width)] flex-1 gap-10 px-5 py-10 sm:px-8 sm:py-14 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12 lg:grid-cols-[12rem_minmax(0,42rem)] lg:justify-between lg:gap-20 lg:px-10 lg:py-16" : "mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16"}>
        {showSidebar ? <ProfileSidebar imageShape={site.appearance.profileImageShape} owner={site.owner} socialLinks={site.socialLinks} /> : null}
        <main id="main-content" className="min-w-0 scroll-mt-24" tabIndex={-1}>
          {children}
        </main>
      </div>

      <SiteFooter ownerName={site.owner.name} />
    </div>
  );
}
