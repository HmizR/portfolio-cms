import { ExternalLink, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";
import { requireAdmin } from "@/features/auth/session";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-slate-200 bg-slate-950 text-slate-100 lg:min-h-screen lg:border-b-0 lg:border-r lg:border-slate-800">
        <div className="flex min-h-16 items-center justify-between px-5 lg:block lg:px-6 lg:py-6">
          <Link className="font-serif text-xl font-semibold" href="/admin">PortfolioCMS</Link>
          <Link className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white lg:mt-2" href="/" target="_blank">
            View site <ExternalLink aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
        <nav aria-label="Admin navigation" className="border-t border-slate-800 px-3 py-3 lg:mt-2">
          <Link className="flex items-center gap-3 rounded-md bg-slate-800 px-3 py-2.5 text-sm font-semibold" href="/admin">
            <LayoutDashboard aria-hidden="true" className="size-4" /> Overview
          </Link>
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{session.user.name}</p>
            <p className="truncate text-xs text-slate-500">{session.user.email}</p>
          </div>
          <form action={logoutAction}>
            <Button className="border border-slate-300 bg-white text-slate-800 shadow-none hover:bg-slate-100" type="submit">Sign out</Button>
          </form>
        </header>
        <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
