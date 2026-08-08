import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, type AuthSession } from "@/features/auth/auth";

export async function getCurrentSession(): Promise<AuthSession | null> {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireAdmin(): Promise<AuthSession> {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
