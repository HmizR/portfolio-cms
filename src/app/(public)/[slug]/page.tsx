import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public/public-shell";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getMediaUrlById } from "@/features/media/queries";
import { PagePresentation } from "@/features/pages/page-presentation";
import { getPublishedPageBySlug } from "@/features/pages/queries";
import { pageSlugSchema } from "@/features/pages/validation";
import { getPublicSiteData } from "@/features/profile/queries";
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
  const ogImageUrl = await getMediaUrlById(page.ogMediaId) ?? page.ogImageUrl;
  return {
    title: page.seoTitle ?? page.title,
    description: (page.seoDescription ?? page.excerpt) || undefined,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    openGraph: ogImageUrl ? { images: [{ url: ogImageUrl }] } : undefined,
  };
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { slug } = await params;
  const parsed = pageSlugSchema.safeParse(slug);
  if (!parsed.success) notFound();
  const [navigation, page, site] = await Promise.all([
    getPublicNavigation(),
    getPublishedPageBySlug(parsed.data),
    getPublicSiteData(),
  ]);
  if (!page) notFound();
  const html = await renderMarkdown(page.contentMarkdown);
  return <PublicShell navigation={navigation} showSidebar={page.showSidebar} site={site}><PagePresentation excerpt={page.excerpt} html={html} publishedAt={page.publishedAt} showTitle={page.showTitle} title={page.title} /></PublicShell>;
}
