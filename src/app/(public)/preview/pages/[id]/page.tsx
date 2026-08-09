import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public/public-shell";
import { requireAdmin } from "@/features/auth/session";
import { getPublicNavigation } from "@/features/navigation/queries";
import { PagePresentation } from "@/features/pages/page-presentation";
import { getPageById } from "@/features/pages/queries";
import { pageIdSchema } from "@/features/pages/validation";
import { getPublicSiteData } from "@/features/profile/queries";
import { renderMarkdown } from "@/lib/markdown/render";

export const metadata: Metadata = {
  title: "Page preview | PortfolioCMS",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const parsed = pageIdSchema.safeParse(id);
  if (!parsed.success) notFound();
  const [navigation, page, site] = await Promise.all([getPublicNavigation(), getPageById(parsed.data), getPublicSiteData()]);
  if (!page) notFound();
  const html = await renderMarkdown(page.draftMarkdown ?? page.contentMarkdown);
  return <PublicShell navigation={navigation} showSidebar={page.showSidebar} site={site}><div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">Private preview · {page.status}</div><PagePresentation excerpt={page.excerpt} html={html} publishedAt={page.publishedAt} showTitle={page.showTitle} title={page.title} /></PublicShell>;
}
