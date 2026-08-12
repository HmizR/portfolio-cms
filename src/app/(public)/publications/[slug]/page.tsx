import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/public-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { getMediaUrlById } from "@/features/media/queries";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteData } from "@/features/profile/queries";
import { articleJsonLd, buildMetadata } from "@/features/seo/metadata";
import { getGlobalSeoSettings } from "@/features/seo/queries";
import { PublicationPresentation } from "@/features/publications/publication-presentation";
import { getPublishedPublicationBySlug } from "@/features/publications/queries";
import { publicationSlugSchema } from "@/features/publications/validation";
import { renderMarkdown } from "@/lib/markdown/render";
interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const parsed = publicationSlugSchema.safeParse(slug); if (!parsed.success) return {}; const item = await getPublishedPublicationBySlug(parsed.data); if (!item) return {}; const og = await getMediaUrlById(item.ogMediaId) ?? item.ogImageUrl; return buildMetadata(await getGlobalSeoSettings(), { canonicalPath: `/publications/${item.slug}`, canonicalUrl: item.canonicalUrl, title: item.seoTitle ?? item.title, description: item.seoDescription ?? item.abstract, imageUrl: og, kind: "article", publishedAt: item.publishedAt }); }
export default async function PublicationPage({ params }: Props) { const { slug } = await params; const parsed = publicationSlugSchema.safeParse(slug); if (!parsed.success) notFound(); const [navigation, item, site, seo] = await Promise.all([getPublicNavigation(), getPublishedPublicationBySlug(parsed.data), getPublicSiteData(), getGlobalSeoSettings()]); if (!item) notFound(); const [html, pdfUrl, ogUrl] = await Promise.all([renderMarkdown(item.contentMarkdown), getMediaUrlById(item.pdfMediaId), getMediaUrlById(item.ogMediaId)]); return <PublicShell navigation={navigation} site={site}><JsonLd data={articleJsonLd(seo, { path: `/publications/${item.slug}`, title: item.title, description: item.seoDescription ?? item.abstract, image: ogUrl ?? item.ogImageUrl, publishedAt: item.publishedAt, modifiedAt: item.updatedAt, authorName: item.authors.find((author) => author.isOwner)?.name ?? site.owner.name, scholarly: true })} /><PublicationPresentation abstract={item.abstract} authors={item.authors} doi={item.doi} externalUrl={item.externalUrl} html={html} pdfUrl={pdfUrl} publicationDate={item.publicationDate} publicationType={item.publicationType} publisher={item.publisher} title={item.title} venue={item.venue} /></PublicShell>; }
