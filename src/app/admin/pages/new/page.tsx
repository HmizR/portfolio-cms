import type { Metadata } from "next";

import { CreatePageForm } from "@/features/pages/create-page-form";

export const metadata: Metadata = { title: "New page | PortfolioCMS" };

export default function NewPagePage() {
  return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Pages</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Create a page</h1><p className="mb-8 mt-2 max-w-2xl text-slate-600">Start with a stable title and URL. The page remains a private draft until you publish it.</p><CreatePageForm /></div>;
}
