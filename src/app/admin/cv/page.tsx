import type { Metadata } from "next";
import { CvManager } from "@/features/cv/cv-manager";
import { getCvEditorData } from "@/features/cv/queries";
export const metadata: Metadata = { title: "CV | PortfolioCMS" };
export default async function CvAdminPage() { const data = await getCvEditorData(); return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Public portfolio</p><div className="mb-8 mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-serif text-3xl font-semibold tracking-tight">Curriculum vitae</h1><p className="mt-2 max-w-2xl text-slate-600">Configure a structured CV from your profile and academic portfolio records.</p></div><a className="text-sm font-semibold text-teal-800 underline underline-offset-4" href="/cv" rel="noreferrer" target="_blank">View public CV</a></div><CvManager initialProjectIds={data.projectIds} initialSections={data.sections} projects={data.projects} /></div>; }
