"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfileAction } from "@/features/profile/actions";
import { MediaField } from "@/features/media/media-field";
import type { MediaRecord } from "@/features/media/queries";
import { FormField } from "@/features/profile/form-field";
import type { ProfileEditorData } from "@/features/profile/queries";
import type { SocialLinkInput } from "@/features/profile/validation";

export function ProfileForm({ availableMedia, initialData }: { availableMedia: MediaRecord[]; initialData: ProfileEditorData }) {
  const [state, action, pending] = useActionState(updateProfileAction, {});
  const [links, setLinks] = useState<SocialLinkInput[]>(initialData.socialLinks);

  function updateLink(index: number, patch: Partial<SocialLinkInput>) {
    setLinks((current) => current.map((link, linkIndex) => linkIndex === index ? { ...link, ...patch } : link));
  }

  function moveLink(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= links.length) return;
    setLinks((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }

  return (
    <form action={action} className="space-y-8">
      <input name="socialLinks" type="hidden" value={JSON.stringify(links)} />
      {state.message ? (
        <div aria-live="polite" className={state.status === "success" ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"}>
          {state.message}
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-semibold">Profile details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField errors={state.fieldErrors?.fullName} htmlFor="fullName" label="Full name">
            <Input defaultValue={initialData.fullName} id="fullName" maxLength={100} name="fullName" required />
          </FormField>
          <FormField errors={state.fieldErrors?.headline} htmlFor="headline" label="Headline">
            <Input defaultValue={initialData.headline} id="headline" maxLength={160} name="headline" />
          </FormField>
          <FormField errors={state.fieldErrors?.location} htmlFor="location" label="Location">
            <Input defaultValue={initialData.location} id="location" maxLength={160} name="location" />
          </FormField>
          <FormField errors={state.fieldErrors?.publicEmail} htmlFor="publicEmail" label="Public email">
            <Input defaultValue={initialData.publicEmail ?? ""} id="publicEmail" maxLength={254} name="publicEmail" type="email" />
          </FormField>
          <div className="sm:col-span-2">
            <MediaField description="Choose an uploaded image for the public profile." initialId={initialData.avatarMediaId} initialMedia={availableMedia} label="Managed avatar" name="avatarMediaId" />
            <FormField description="Optional fallback for an externally hosted avatar." errors={state.fieldErrors?.avatarUrl} htmlFor="avatarUrl" label="External avatar URL">
              <Input defaultValue={initialData.avatarUrl ?? ""} id="avatarUrl" maxLength={2048} name="avatarUrl" placeholder="https://example.com/profile.jpg" />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField errors={state.fieldErrors?.shortBiography} htmlFor="shortBiography" label="Short biography">
              <Textarea defaultValue={initialData.shortBiography} id="shortBiography" maxLength={500} name="shortBiography" rows={4} />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField description="Stored for later long-form profile use; the public sidebar uses the short biography." errors={state.fieldErrors?.longBiography} htmlFor="longBiography" label="Long biography">
              <Textarea defaultValue={initialData.longBiography} id="longBiography" maxLength={10000} name="longBiography" rows={8} />
            </FormField>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="font-serif text-xl font-semibold">Social links</h2><p className="mt-1 text-sm text-slate-500">Links appear publicly in this order when visible.</p></div>
          <Button className="gap-2" onClick={() => setLinks((current) => [...current, { platform: "", label: "", url: "", iconIdentifier: "link", isVisible: true }])} type="button"><Plus aria-hidden="true" className="size-4" /> Add link</Button>
        </div>
        {state.fieldErrors?.socialLinks?.map((error) => <p className="mt-3 text-sm text-red-700" key={error}>{error}</p>)}
        {links.length === 0 ? <p className="mt-5 rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">No social links yet.</p> : null}
        <div className="mt-5 space-y-4">
          {links.map((link, index) => (
            <fieldset className="rounded-lg border border-slate-200 p-4" key={index}>
              <legend className="px-1 text-sm font-semibold text-slate-700">Link {index + 1}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField htmlFor={`platform-${index}`} label="Platform"><Input id={`platform-${index}`} onChange={(event) => updateLink(index, { platform: event.target.value })} value={link.platform} /></FormField>
                <FormField htmlFor={`label-${index}`} label="Public label"><Input id={`label-${index}`} onChange={(event) => updateLink(index, { label: event.target.value })} value={link.label} /></FormField>
                <div className="sm:col-span-2"><FormField htmlFor={`url-${index}`} label="URL"><Input id={`url-${index}`} onChange={(event) => updateLink(index, { url: event.target.value })} type="url" value={link.url} /></FormField></div>
                <FormField htmlFor={`icon-${index}`} label="Icon identifier"><Input id={`icon-${index}`} onChange={(event) => updateLink(index, { iconIdentifier: event.target.value })} value={link.iconIdentifier} /></FormField>
                <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-slate-700"><input checked={link.isVisible} className="size-4" onChange={(event) => updateLink(index, { isVisible: event.target.checked })} type="checkbox" /> Visible publicly</label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button aria-label={`Move link ${index + 1} up`} className="border border-slate-300 bg-white px-3 text-slate-700 shadow-none hover:bg-slate-100" disabled={index === 0} onClick={() => moveLink(index, -1)} type="button"><ArrowUp aria-hidden="true" className="size-4" /></Button>
                <Button aria-label={`Move link ${index + 1} down`} className="border border-slate-300 bg-white px-3 text-slate-700 shadow-none hover:bg-slate-100" disabled={index === links.length - 1} onClick={() => moveLink(index, 1)} type="button"><ArrowDown aria-hidden="true" className="size-4" /></Button>
                <Button className="gap-2 bg-red-700 hover:bg-red-600" onClick={() => setLinks((current) => current.filter((_, linkIndex) => linkIndex !== index))} type="button"><Trash2 aria-hidden="true" className="size-4" /> Remove</Button>
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? "Saving…" : "Save profile"}</Button></div>
    </form>
  );
}
