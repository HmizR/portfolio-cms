import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public/public-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getMediaUrlById } from "@/features/media/queries";
import { PostPresentation } from "@/features/posts/post-presentation";
import { getPublishedPostBySlug } from "@/features/posts/queries";
import { postSlugSchema } from "@/features/posts/validation";
import { getPublicSiteData } from "@/features/profile/queries";
import { articleJsonLd, buildMetadata } from "@/features/seo/metadata";
import { getGlobalSeoSettings } from "@/features/seo/queries";
import { renderMarkdown } from "@/lib/markdown/render";

interface PostPageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = postSlugSchema.safeParse(slug);
  if (!parsed.success) return {};
  const post = await getPublishedPostBySlug(parsed.data);
  if (!post) return {};
  const ogImageUrl = await getMediaUrlById(post.ogMediaId) ?? post.ogImageUrl;
  return buildMetadata(await getGlobalSeoSettings(), { canonicalPath: `/posts/${post.slug}`, canonicalUrl: post.canonicalUrl, title: post.seoTitle ?? post.title, description: post.seoDescription ?? post.excerpt, imageUrl: ogImageUrl, kind: "article", publishedAt: post.publishedAt, tags: post.tags.map((tag) => tag.name) });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const parsed = postSlugSchema.safeParse(slug);
  if (!parsed.success) notFound();
  const [navigation, post, site, seo] = await Promise.all([getPublicNavigation(), getPublishedPostBySlug(parsed.data), getPublicSiteData(), getGlobalSeoSettings()]);
  if (!post) notFound();
  const [html, managedCoverUrl, managedOgUrl] = await Promise.all([renderMarkdown(post.contentMarkdown), getMediaUrlById(post.coverMediaId), getMediaUrlById(post.ogMediaId)]);
  return <PublicShell navigation={navigation} site={site}><JsonLd data={articleJsonLd(seo, { path: `/posts/${post.slug}`, title: post.title, description: post.seoDescription ?? post.excerpt, image: managedOgUrl ?? post.ogImageUrl ?? managedCoverUrl ?? post.coverImageUrl, publishedAt: post.publishedAt, modifiedAt: post.updatedAt, authorName: site.owner.name })} /><PostPresentation coverImageUrl={managedCoverUrl ?? post.coverImageUrl} excerpt={post.excerpt} html={html} publishedAt={post.publishedAt} tags={post.tags} title={post.title} /></PublicShell>;
}
