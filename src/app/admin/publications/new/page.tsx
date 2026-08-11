import type { Metadata } from "next";
import { CreatePublicationForm } from "@/features/publications/create-publication-form";
export const metadata: Metadata = { title: "New publication | PortfolioCMS" };
export default function NewPublicationPage() { return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Publications</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Create a publication</h1><p className="mb-8 mt-2 text-slate-600">Start with a stable title and URL. It remains private until published.</p><CreatePublicationForm /></div>; }
