import type { Metadata } from "next";
import { SkillManager } from "@/features/skills/skill-manager";
import { listSkills } from "@/features/skills/queries";
export const metadata: Metadata = { title: "Skills | PortfolioCMS" };
export default async function SkillsPage() { const records = await listSkills(); return <div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Academic portfolio</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Skills</h1><p className="mb-8 mt-2 text-slate-600">Manage categorized skills, visibility, and presentation order. Percentage bars are intentionally excluded.</p><SkillManager records={records} /></div>; }
