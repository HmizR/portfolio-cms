import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/features/seo/metadata";
import { getGlobalSeoSettings } from "@/features/seo/queries";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getGlobalSeoSettings();
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/login", "/setup", "/preview/"] }, sitemap: absoluteUrl(seo.baseUrl, "/sitemap.xml"), host: seo.baseUrl };
}
