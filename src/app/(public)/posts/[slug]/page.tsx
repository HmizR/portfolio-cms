import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public/public-shell";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getMediaUrlById } from "@/features/media/queries";
import { PostPresentation } from "@/features/posts/post-presentation";
import { getPublishedPostBySlug } from "@/features/posts/queries";
import { postSlugSchema } from "@/features/posts/validation";
import { getPublicSiteData } from "@/features/profile/queries";
import { renderMarkdown } from "@/lib/markdown/render";

interface PostPageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = postSlugSchema.safeParse(slug);
  if (!parsed.success) return {};
  const post = await getPublishedPostBySlug(parsed.data);
  if (!post) return {};
  const ogImageUrl = await getMediaUrlById(post.ogMediaId) ?? post.ogImageUrl;
  return { title: post.seoTitle ?? post.title, description: (post.seoDescription ?? post.excerpt) || undefined, alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined, openGraph: { type: "article", publishedTime: post.publishedAt?.toISOString(), tags: post.tags.map((tag) => tag.name), images: ogImageUrl ? [{ url: ogImageUrl }] : undefined } };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const parsed = postSlugSchema.safeParse(slug);
  if (!parsed.success) notFound();
  const [navigation, post, site] = await Promise.all([getPublicNavigation(), getPublishedPostBySlug(parsed.data), getPublicSiteData()]);
  if (!post) notFound();
  const [html, managedCoverUrl] = await Promise.all([renderMarkdown(post.contentMarkdown), getMediaUrlById(post.coverMediaId)]);
  return <PublicShell navigation={navigation} site={site}><PostPresentation coverImageUrl={managedCoverUrl ?? post.coverImageUrl} excerpt={post.excerpt} html={html} publishedAt={post.publishedAt} tags={post.tags} title={post.title} /></PublicShell>;
}
