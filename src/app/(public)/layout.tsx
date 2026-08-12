import type { Metadata } from "next";
import type { ReactNode } from "react";

import { buildMetadata } from "@/features/seo/metadata";
import { getGlobalSeoSettings } from "@/features/seo/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSeoSettings();
  return { ...buildMetadata(settings, { canonicalPath: "/" }), metadataBase: new URL(settings.baseUrl), title: { default: settings.siteTitle, template: `%s | ${settings.siteTitle}` } };
}

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
