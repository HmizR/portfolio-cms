import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeletePostForm } from "@/features/posts/delete-post-form";
import { PostEditorForm } from "@/features/posts/post-editor-form";
import { getPostById, listTags } from "@/features/posts/queries";
import { postIdSchema } from "@/features/posts/validation";
import { renderMarkdown } from "@/lib/markdown/render";

export const metadata: Metadata = { title: "Edit post | PortfolioCMS" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = postIdSchema.safeParse(id);
  if (!parsedId.success) notFound();
  const [post, availableTags] = await Promise.all([getPostById(parsedId.data), listTags()]);
  if (!post) notFound();
  const editableMarkdown = post.draftMarkdown ?? post.contentMarkdown;
  const initialPreviewHtml = await renderMarkdown(editableMarkdown);
  const initialPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    contentMarkdown: editableMarkdown,
    coverImageUrl: post.coverImageUrl,
    tagIds: post.tags.map((tag) => tag.id),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalUrl: post.canonicalUrl,
    ogImageUrl: post.ogImageUrl,
  };
  return <div className="mx-auto max-w-6xl"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Posts</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Edit post</h1></div><DeletePostForm id={post.id} title={post.title} /></div><PostEditorForm availableTags={availableTags} initialPost={initialPost} initialPreviewHtml={initialPreviewHtml} initialStatus={post.status} /></div>;
}
