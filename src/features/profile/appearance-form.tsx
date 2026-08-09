"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateAppearanceAction } from "@/features/profile/actions";
import { FormField } from "@/features/profile/form-field";
import type { AppearanceInput } from "@/features/profile/validation";

export function AppearanceForm({ initialData }: { initialData: AppearanceInput }) {
  const [state, action, pending] = useActionState(updateAppearanceAction, {});
  const displayedValues = state.savedAppearance ?? initialData;

  return (
    <form action={action} className="space-y-6" key={JSON.stringify(displayedValues)}>
      {state.message ? <div aria-live="polite" className={state.status === "success" ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"}>{state.message}</div> : null}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-semibold">Site identity</h2>
        <div className="mt-5 space-y-5">
          <FormField errors={state.fieldErrors?.siteTitle} htmlFor="siteTitle" label="Site title"><Input defaultValue={displayedValues.siteTitle} id="siteTitle" maxLength={100} name="siteTitle" required /></FormField>
          <FormField errors={state.fieldErrors?.siteDescription} htmlFor="siteDescription" label="Site description"><Textarea defaultValue={displayedValues.siteDescription} id="siteDescription" maxLength={300} name="siteDescription" rows={4} /></FormField>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-semibold">Controlled appearance</h2>
        <p className="mt-1 text-sm text-slate-500">Choose from safe design-token presets. Arbitrary CSS is not supported.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField errors={state.fieldErrors?.accentColor} htmlFor="accentColor" label="Accent color"><Select defaultValue={displayedValues.accentColor} id="accentColor" name="accentColor"><option value="teal">Teal</option><option value="blue">Blue</option><option value="burgundy">Burgundy</option><option value="violet">Violet</option></Select></FormField>
          <FormField errors={state.fieldErrors?.contentWidth} htmlFor="contentWidth" label="Content width"><Select defaultValue={displayedValues.contentWidth} id="contentWidth" name="contentWidth"><option value="compact">Compact</option><option value="standard">Standard</option><option value="wide">Wide</option></Select></FormField>
          <FormField errors={state.fieldErrors?.profileImageShape} htmlFor="profileImageShape" label="Profile image shape"><Select defaultValue={displayedValues.profileImageShape} id="profileImageShape" name="profileImageShape"><option value="circle">Circle</option><option value="rounded">Rounded</option><option value="square">Square</option></Select></FormField>
          <FormField errors={state.fieldErrors?.typography} htmlFor="typography" label="Typography"><Select defaultValue={displayedValues.typography} id="typography" name="typography"><option value="classic">Classic academic</option><option value="modern">Modern sans serif</option></Select></FormField>
        </div>
      </section>
      <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? "Saving…" : "Save appearance"}</Button></div>
    </form>
  );
}
