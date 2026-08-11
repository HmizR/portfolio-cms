"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPostAction } from "@/features/posts/actions";
import { FormField } from "@/features/profile/form-field";

export function CreatePostForm() {
  const [state, action, pending] = useActionState(createPostAction, {});
  return (
    <form action={action} className="max-w-2xl space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {state.message ? <div aria-live="polite" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{state.message}</div> : null}
      <FormField errors={state.fieldErrors?.title} htmlFor="title" label="Title"><Input defaultValue={state.values?.title} id="title" maxLength={200} name="title" required /></FormField>
      <FormField description="Leave blank to generate it from the title. It stays stable when the title changes." errors={state.fieldErrors?.slug} htmlFor="slug" label="Slug"><Input defaultValue={state.values?.slug} id="slug" maxLength={120} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></FormField>
      <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? "Creating..." : "Create draft"}</Button></div>
    </form>
  );
}
