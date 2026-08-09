import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/session";
import { ProfileForm } from "@/features/profile/profile-form";
import { getProfileEditorData } from "@/features/profile/queries";

export const metadata: Metadata = { title: "Profile | PortfolioCMS" };

export default async function ProfilePage() {
  const session = await requireAdmin();
  const profile = await getProfileEditorData(session.user);
  return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Website</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Profile</h1><p className="mb-8 mt-2 max-w-2xl text-slate-600">Manage the owner information and social profiles shown in the public sidebar.</p><ProfileForm initialData={profile} /></div>;
}
