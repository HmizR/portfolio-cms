import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public/public-shell";
import { PagePresentation } from "@/features/pages/page-presentation";
import { getPublishedPageBySlug } from "@/features/pages/queries";
import { pageSlugSchema } from "@/features/pages/validation";
import { getPublicSiteData } from "@/features/profile/queries";
import { publicNavigationFixture } from "@/features/public-shell/public-shell.fixtures";
import { renderMarkdown } from "@/lib/markdown/render";

interface PublicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = pageSlugSchema.safeParse(slug);
  if (!parsed.success) return {};
  const page = await getPublishedPageBySlug(parsed.data);
  if (!page) return {};
  return {
    title: page.seoTitle ?? page.title,
    description: (page.seoDescription ?? page.excerpt) || undefined,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    openGraph: page.ogImageUrl ? { images: [{ url: page.ogImageUrl }] } : undefined,
  };
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { slug } = await params;
  const parsed = pageSlugSchema.safeParse(slug);
  if (!parsed.success) notFound();
  const [page, site] = await Promise.all([
    getPublishedPageBySlug(parsed.data),
    getPublicSiteData(),
  ]);
  if (!page) notFound();
  const html = await renderMarkdown(page.contentMarkdown);
  return <PublicShell navigation={publicNavigationFixture} showSidebar={page.showSidebar} site={site}><PagePresentation excerpt={page.excerpt} html={html} publishedAt={page.publishedAt} showTitle={page.showTitle} title={page.title} /></PublicShell>;
}
