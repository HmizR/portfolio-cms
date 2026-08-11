import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public/public-shell";
import { requireAdmin } from "@/features/auth/session";
import { getMediaUrlById } from "@/features/media/queries";
import { getPublicNavigation } from "@/features/navigation/queries";
import { PostPresentation } from "@/features/posts/post-presentation";
import { getPostById } from "@/features/posts/queries";
import { postIdSchema } from "@/features/posts/validation";
import { getPublicSiteData } from "@/features/profile/queries";
import { renderMarkdown } from "@/lib/markdown/render";

export const metadata: Metadata = { title: "Post preview | PortfolioCMS", robots: { index: false, follow: false } };

export default async function PreviewPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const parsed = postIdSchema.safeParse(id);
  if (!parsed.success) notFound();
  const [navigation, post, site] = await Promise.all([getPublicNavigation(), getPostById(parsed.data), getPublicSiteData()]);
  if (!post) notFound();
  const [html, managedCoverUrl] = await Promise.all([renderMarkdown(post.draftMarkdown ?? post.contentMarkdown), getMediaUrlById(post.coverMediaId)]);
  return <PublicShell navigation={navigation} site={site}><div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">Private preview · {post.status}</div><PostPresentation coverImageUrl={managedCoverUrl ?? post.coverImageUrl} excerpt={post.excerpt} html={html} publishedAt={post.publishedAt} tags={post.tags} title={post.title} /></PublicShell>;
}
