import type { Metadata } from "next";

import { listTags } from "@/features/posts/queries";
import { CreateTagForm, TagEditor } from "@/features/posts/tag-manager";

export const metadata: Metadata = { title: "Tags | PortfolioCMS" };

export default async function AdminTagsPage() {
  const tags = await listTags();
  return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Posts</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Tags</h1><p className="mb-8 mt-2 text-slate-600">Keep post topics normalized and reusable.</p><CreateTagForm />{tags.length === 0 ? <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"><h2 className="font-serif text-xl font-semibold">No tags yet</h2></div> : <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{tags.map((tag) => <TagEditor key={tag.id} tag={tag} />)}</div>}</div>;
}
