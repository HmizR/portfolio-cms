import type { Metadata } from "next";
import { ExperienceManager } from "@/features/experience/experience-manager";
import { listExperience } from "@/features/experience/queries";
export const metadata: Metadata = { title: "Experience | PortfolioCMS" };
export default async function ExperiencePage() { const records = await listExperience(); return <div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Academic portfolio</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Experience</h1><p className="mb-8 mt-2 text-slate-600">Manage professional history and its presentation order.</p><ExperienceManager records={records} /></div>; }
