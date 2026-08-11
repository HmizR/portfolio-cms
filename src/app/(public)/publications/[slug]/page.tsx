import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/public-shell";
import { getMediaUrlById } from "@/features/media/queries";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteData } from "@/features/profile/queries";
import { PublicationPresentation } from "@/features/publications/publication-presentation";
import { getPublishedPublicationBySlug } from "@/features/publications/queries";
import { publicationSlugSchema } from "@/features/publications/validation";
import { renderMarkdown } from "@/lib/markdown/render";
interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const parsed = publicationSlugSchema.safeParse(slug); if (!parsed.success) return {}; const item = await getPublishedPublicationBySlug(parsed.data); if (!item) return {}; const og = await getMediaUrlById(item.ogMediaId) ?? item.ogImageUrl; return { title: item.seoTitle ?? item.title, description: (item.seoDescription ?? item.abstract) || undefined, alternates: item.canonicalUrl ? { canonical: item.canonicalUrl } : undefined, openGraph: og ? { images: [{ url: og }] } : undefined }; }
export default async function PublicationPage({ params }: Props) { const { slug } = await params; const parsed = publicationSlugSchema.safeParse(slug); if (!parsed.success) notFound(); const [navigation, item, site] = await Promise.all([getPublicNavigation(), getPublishedPublicationBySlug(parsed.data), getPublicSiteData()]); if (!item) notFound(); const [html, pdfUrl] = await Promise.all([renderMarkdown(item.contentMarkdown), getMediaUrlById(item.pdfMediaId)]); return <PublicShell navigation={navigation} site={site}><PublicationPresentation abstract={item.abstract} authors={item.authors} doi={item.doi} externalUrl={item.externalUrl} html={html} pdfUrl={pdfUrl} publicationDate={item.publicationDate} publicationType={item.publicationType} publisher={item.publisher} title={item.title} venue={item.venue} /></PublicShell>; }
