import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-md">
        <Link className="mb-6 inline-block text-sm font-semibold text-slate-600 hover:text-teal-800" href="/">
          ← Back to portfolio
        </Link>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
