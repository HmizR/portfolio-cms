import { LockKeyhole } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview | PortfolioCMS" };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Administration</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Your workspace is ready</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">Authentication and the protected administration shell are configured. Portfolio editing tools arrive in their owning milestones.</p>
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="rounded-lg bg-teal-50 p-2.5 text-teal-800"><LockKeyhole aria-hidden="true" className="size-5" /></span>
          <div>
            <h2 className="font-semibold text-slate-950">Protected administrator access</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Every admin route validates the server-side session. Sign out when you finish working on a shared device.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
