import type { Metadata } from "next";

import { AppearanceForm } from "@/features/profile/appearance-form";
import { getAppearanceEditorData } from "@/features/profile/queries";

export const metadata: Metadata = { title: "Appearance | PortfolioCMS" };

export default async function AppearancePage() {
  const appearance = await getAppearanceEditorData();
  return <div className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Website</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Appearance</h1><p className="mb-8 mt-2 max-w-2xl text-slate-600">Set the public site identity and choose restrained visual presets.</p><AppearanceForm initialData={appearance} /></div>;
}
