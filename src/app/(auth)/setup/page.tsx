import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { hasAdminUser } from "@/features/auth/queries";
import { getCurrentSession } from "@/features/auth/session";
import { SetupForm } from "@/features/auth/setup-form";

export const metadata: Metadata = { title: "Set up PortfolioCMS" };
export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (await hasAdminUser()) {
    redirect((await getCurrentSession()) ? "/admin" : "/login");
  }

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-800">First-time setup</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-950">Create your administrator</h1>
      <p className="mb-7 mt-2 text-sm leading-6 text-slate-600">This account is the only administrator for this PortfolioCMS installation.</p>
      <SetupForm />
    </>
  );
}
