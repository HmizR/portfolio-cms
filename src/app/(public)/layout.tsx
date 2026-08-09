import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PublicShell } from "@/components/public/public-shell";
import { getPublicSiteData } from "@/features/profile/queries";
import { publicNavigationFixture } from "@/features/public-shell/public-shell.fixtures";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteData();
  return { title: site.appearance.siteTitle, description: site.appearance.siteDescription };
}

export default async function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  const site = await getPublicSiteData();
  return <PublicShell navigation={publicNavigationFixture} site={site}>{children}</PublicShell>;
}
