import { FilePlus2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { listPages } from "@/features/pages/queries";

export const metadata: Metadata = { title: "Pages | PortfolioCMS" };

export default async function AdminPagesPage() {
  const pages = await listPages();
  return <div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Content</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Pages</h1><p className="mt-2 text-slate-600">Create standalone Markdown pages and control their public lifecycle.</p></div><Link className="inline-flex min-h-11 items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" href="/admin/pages/new"><FilePlus2 className="size-4" /> New page</Link></div>
    {pages.length === 0 ? <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><h2 className="font-serif text-xl font-semibold">No pages yet</h2><p className="mt-2 text-sm text-slate-600">Create a draft to begin writing.</p></div> : <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Page</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Updated</th><th className="px-5 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-slate-200">{pages.map((page) => <tr key={page.id}><td className="px-5 py-4"><p className="font-semibold text-slate-950">{page.title}</p><p className="mt-1 text-xs text-slate-500">/{page.slug}</p></td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">{page.status}</span></td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{page.updatedAt.toLocaleDateString()}</td><td className="px-5 py-4 text-right"><Link className="font-semibold text-teal-800 underline underline-offset-4" href={`/admin/pages/${page.id}`}>Edit</Link></td></tr>)}</tbody></table></div></div>}
  </div>;
}
