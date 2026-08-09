import { FileText, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Overview | PortfolioCMS" };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Administration</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Your workspace is ready</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">Manage your public identity, appearance, and standalone Markdown pages from this protected workspace.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="rounded-lg bg-teal-50 p-2.5 text-teal-800"><LockKeyhole aria-hidden="true" className="size-5" /></span>
          <div>
            <h2 className="font-semibold text-slate-950">Protected administrator access</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Every admin route validates the server-side session. Sign out when you finish working on a shared device.</p>
          </div>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="rounded-lg bg-teal-50 p-2.5 text-teal-800"><FileText aria-hidden="true" className="size-5" /></span>
          <div>
            <h2 className="font-semibold text-slate-950">Custom pages</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Write portable Markdown, preview the public layout, and explicitly control publication.</p>
            <Link className="mt-3 inline-block text-sm font-semibold text-teal-800 underline underline-offset-4" href="/admin/pages">Manage pages</Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
