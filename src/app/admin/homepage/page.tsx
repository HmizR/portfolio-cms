import type { Metadata } from "next";

import { HomepageManager } from "@/features/homepage/homepage-manager";
import { getHomepageEditorData } from "@/features/homepage/queries";
import { listMedia } from "@/features/media/queries";
import { renderMarkdown } from "@/lib/markdown/render";

export const metadata: Metadata = { title: "Homepage | PortfolioCMS" };
export default async function HomepageAdminPage() {
  const [data, media] = await Promise.all([getHomepageEditorData(), listMedia()]);
  const markdown = data.sections.find((section) => section.sectionType === "markdown");
  const initialPreviewHtml = await renderMarkdown(markdown?.configuration.markdown ?? "");
  return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Website</p><div className="mb-8 mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-serif text-3xl font-semibold tracking-tight">Homepage</h1><p className="mt-2 max-w-2xl text-slate-600">Arrange controlled sections and configure the public portfolio landing page.</p></div><a className="text-sm font-semibold text-teal-800 underline underline-offset-4" href="/" rel="noreferrer" target="_blank">View homepage</a></div><HomepageManager initialPreviewHtml={initialPreviewHtml} initialSections={data.sections} media={media} pages={data.pages} /></div>;
}
