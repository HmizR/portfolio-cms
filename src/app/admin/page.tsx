import { FilePlus2, FileText, FolderKanban, LockKeyhole, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { listPages } from "@/features/pages/queries";
import { listPosts } from "@/features/posts/queries";
import { listProjects } from "@/features/projects/queries";

export const metadata: Metadata = { title: "Overview | PortfolioCMS" };

export default async function AdminPage() {
  const [pages, posts, projects] = await Promise.all([listPages(), listPosts(), listProjects()]);
  const draftCount = [...pages, ...posts, ...projects].filter((item) => item.status === "draft").length;
  const recent = [
    ...pages.map((page) => ({ href: `/admin/pages/${page.id}`, id: page.id, kind: "Page", title: page.title, updatedAt: page.updatedAt })),
    ...posts.map((post) => ({ href: `/admin/posts/${post.id}`, id: post.id, kind: "Post", title: post.title, updatedAt: post.updatedAt })),
    ...projects.map((project) => ({ href: `/admin/projects/${project.id}`, id: project.id, kind: "Project", title: project.title, updatedAt: project.updatedAt })),
  ].sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime()).slice(0, 5);

  return <div className="mx-auto max-w-6xl">
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Administration</p>
    <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Your workspace is ready</h1>
    <p className="mt-3 max-w-2xl leading-7 text-slate-600">Manage public identity, pages, posts, and portfolio projects from this protected workspace.</p>

    <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {[{ label: "Pages", value: pages.length }, { label: "Posts", value: posts.length }, { label: "Projects", value: projects.length }, { label: "Featured projects", value: projects.filter((project) => project.isFeatured).length }, { label: "Draft content", value: draftCount }].map((item) => <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={item.label}><dt className="text-sm font-semibold text-slate-500">{item.label}</dt><dd className="mt-2 font-serif text-3xl font-semibold text-slate-950">{item.value}</dd></div>)}
    </dl>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-4"><span className="rounded-lg bg-teal-50 p-2.5 text-teal-800"><LockKeyhole aria-hidden="true" className="size-5" /></span><div><h2 className="font-semibold text-slate-950">Protected administrator access</h2><p className="mt-1 text-sm leading-6 text-slate-600">Every admin route and mutation validates the server-side session.</p></div></div></section>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-serif text-xl font-semibold">Quick actions</h2><div className="mt-4 flex flex-wrap gap-3"><Link className="inline-flex min-h-11 items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" href="/admin/pages/new"><FilePlus2 className="size-4" /> New page</Link><Link className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100" href="/admin/posts/new"><Newspaper className="size-4" /> New post</Link><Link className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100" href="/admin/projects/new"><FolderKanban className="size-4" /> New project</Link></div></section>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><FileText aria-hidden="true" className="size-5 text-teal-800" /><h2 className="font-serif text-xl font-semibold">Recent content</h2></div>{recent.length === 0 ? <p className="mt-5 text-sm text-slate-600">Create a page, post, or project to begin publishing.</p> : <ol className="mt-4 divide-y divide-slate-200">{recent.map((item) => <li className="flex items-center justify-between gap-4 py-3" key={`${item.kind}-${item.id}`}><div><p className="font-semibold text-slate-950">{item.title}</p><p className="mt-0.5 text-xs text-slate-500">{item.kind} · updated {item.updatedAt.toLocaleDateString()}</p></div><Link className="text-sm font-semibold text-teal-800 underline underline-offset-4" href={item.href}>Edit</Link></li>)}</ol>}</section>
    </div>
  </div>;
}
