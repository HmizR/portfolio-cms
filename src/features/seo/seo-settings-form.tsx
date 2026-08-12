"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaField } from "@/features/media/media-field";
import type { MediaRecord } from "@/features/media/queries";
import { FormField } from "@/features/profile/form-field";
import { updateSeoSettingsAction } from "@/features/seo/actions";
import type { SeoSettingsInput } from "@/features/seo/validation";

export function SeoSettingsForm({ baseUrl, initialData, media }: { baseUrl: string; initialData: SeoSettingsInput; media: MediaRecord[] }) {
  const [state, action, pending] = useActionState(updateSeoSettingsAction, {});
  return <form action={action} className="space-y-6">
    {state.message ? <div aria-live="polite" className={state.status === "success" ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"}>{state.message}</div> : null}
    <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div><h2 className="font-serif text-xl font-semibold">Social previews</h2><p className="mt-1 text-sm text-slate-500">Content-specific images override this site-wide fallback.</p></div>
      <MediaField description="Used by Open Graph and X/Twitter when content has no social image." initialId={initialData.defaultOgMediaId} initialMedia={media} label="Default social image" name="defaultOgMediaId" />
      <FormField errors={state.fieldErrors?.twitterHandle} htmlFor="twitterHandle" label="X/Twitter handle"><Input defaultValue={initialData.twitterHandle ?? ""} id="twitterHandle" maxLength={16} name="twitterHandle" placeholder="@researcher" /></FormField>
    </section>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-xl font-semibold">Canonical base URL</h2><p className="mt-2 text-sm text-slate-600">{baseUrl}</p><p className="mt-2 text-sm text-slate-500">Set with the validated <code>APP_URL</code> deployment variable so generated URLs cannot drift from the running environment.</p></section>
    <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? "Saving…" : "Save SEO defaults"}</Button></div>
  </form>;
}
