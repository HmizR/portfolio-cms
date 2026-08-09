import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeletePageForm } from "@/features/pages/delete-page-form";
import { PageEditorForm } from "@/features/pages/page-editor-form";
import { getPageById } from "@/features/pages/queries";
import { pageIdSchema } from "@/features/pages/validation";
import { renderMarkdown } from "@/lib/markdown/render";

export const metadata: Metadata = { title: "Edit page | PortfolioCMS" };

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = pageIdSchema.safeParse(id);
  if (!parsedId.success) notFound();
  const page = await getPageById(parsedId.data);
  if (!page) notFound();
  const editableMarkdown = page.draftMarkdown ?? page.contentMarkdown;
  const initialPreviewHtml = await renderMarkdown(editableMarkdown);
  const formPage = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    excerpt: page.excerpt,
    contentMarkdown: editableMarkdown,
    showTitle: page.showTitle,
    showSidebar: page.showSidebar,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    ogImageUrl: page.ogImageUrl,
  };
  return <div className="mx-auto max-w-6xl"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Pages</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Edit page</h1></div><DeletePageForm id={page.id} title={page.title} /></div><PageEditorForm initialPage={formPage} initialPreviewHtml={initialPreviewHtml} initialStatus={page.status} /></div>;
}
