import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/login-form";
import { hasAdminUser } from "@/features/auth/queries";
import { getCurrentSession } from "@/features/auth/session";

export const metadata: Metadata = { title: "Sign in | PortfolioCMS" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!(await hasAdminUser())) {
    redirect("/setup");
  }

  if (await getCurrentSession()) {
    redirect("/admin");
  }

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-800">PortfolioCMS</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h1>
      <p className="mb-7 mt-2 text-sm leading-6 text-slate-600">Sign in to manage your portfolio.</p>
      <LoginForm />
    </>
  );
}
