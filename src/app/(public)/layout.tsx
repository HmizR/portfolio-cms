import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getPublicSiteData } from "@/features/profile/queries";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteData();
  return { title: site.appearance.siteTitle, description: site.appearance.siteDescription };
}

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
