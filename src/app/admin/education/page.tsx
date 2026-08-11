import type { Metadata } from "next";
import { EducationManager } from "@/features/education/education-manager";
import { listEducation } from "@/features/education/queries";
export const metadata: Metadata = { title: "Education | PortfolioCMS" };
export default async function EducationPage() { const records = await listEducation(); return <div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Academic portfolio</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Education</h1><p className="mb-8 mt-2 text-slate-600">Manage structured education history and its presentation order.</p><EducationManager records={records} /></div>; }
