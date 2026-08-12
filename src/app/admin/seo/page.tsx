import type { Metadata } from "next";

import { listMedia } from "@/features/media/queries";
import { getGlobalSeoSettings, getSeoEditorData } from "@/features/seo/queries";
import { SeoSettingsForm } from "@/features/seo/seo-settings-form";

export const metadata: Metadata = { title: "SEO | PortfolioCMS" };

export default async function SeoPage() {
  const [initialData, media, settings] = await Promise.all([getSeoEditorData(), listMedia(), getGlobalSeoSettings()]);
  return <div className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">System</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">SEO</h1><p className="mb-8 mt-2 max-w-2xl text-slate-600">Configure default search and social metadata. Site title and description remain under Appearance.</p><SeoSettingsForm baseUrl={settings.baseUrl} initialData={initialData} media={media} /></div>;
}
