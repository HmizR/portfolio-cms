import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/public-shell";
import { requireAdmin } from "@/features/auth/session";
import { getMediaUrlById } from "@/features/media/queries";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteData } from "@/features/profile/queries";
import { PublicationPresentation } from "@/features/publications/publication-presentation";
import { getPublicationById } from "@/features/publications/queries";
import { publicationIdSchema } from "@/features/publications/validation";
import { renderMarkdown } from "@/lib/markdown/render";
export const metadata: Metadata = { title: "Publication preview | PortfolioCMS", robots: { index: false, follow: false } };
export default async function PreviewPublication({ params }: { params: Promise<{ id: string }> }) { await requireAdmin(); const { id } = await params; const parsed = publicationIdSchema.safeParse(id); if (!parsed.success) notFound(); const [navigation, item, site] = await Promise.all([getPublicNavigation(), getPublicationById(parsed.data), getPublicSiteData()]); if (!item) notFound(); const [html, pdfUrl] = await Promise.all([renderMarkdown(item.draftMarkdown ?? item.contentMarkdown), getMediaUrlById(item.pdfMediaId)]); return <PublicShell navigation={navigation} site={site}><div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">Private preview · {item.status}</div><PublicationPresentation abstract={item.abstract} authors={item.authors} doi={item.doi} externalUrl={item.externalUrl} html={html} pdfUrl={pdfUrl} publicationDate={item.publicationDate} publicationType={item.publicationType} publisher={item.publisher} title={item.title} venue={item.venue} /></PublicShell>; }
