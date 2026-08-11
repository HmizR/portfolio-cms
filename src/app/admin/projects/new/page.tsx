import type { Metadata } from "next";
import { CreateProjectForm } from "@/features/projects/create-project-form";
export const metadata: Metadata = { title: "New project | PortfolioCMS" };
export default function NewProjectPage() { return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Projects</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Create a project</h1><p className="mb-8 mt-2 max-w-2xl text-slate-600">Start with a stable title and URL. The project remains private until you publish it.</p><CreateProjectForm /></div>; }
