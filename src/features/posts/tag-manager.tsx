"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTagAction, deleteTagAction, updateTagAction } from "@/features/posts/actions";
import type { TagRecord } from "@/features/posts/queries";
import { FormField } from "@/features/profile/form-field";

export function CreateTagForm() {
  const [state, action, pending] = useActionState(createTagAction, {});
  return <form action={action} aria-label="Create tag" className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    {state.message ? <p aria-live="polite" className={state.status === "success" ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{state.message}</p> : null}
    <div className="grid gap-5 sm:grid-cols-2"><FormField errors={state.fieldErrors?.name} htmlFor="new-tag-name" label="Name"><Input defaultValue={state.values?.name} id="new-tag-name" maxLength={80} name="name" required /></FormField><FormField description="Leave blank to generate it from the name." errors={state.fieldErrors?.slug} htmlFor="new-tag-slug" label="Slug"><Input defaultValue={state.values?.slug} id="new-tag-slug" maxLength={80} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></FormField></div>
    <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? "Creating..." : "Create tag"}</Button></div>
  </form>;
}

export function TagEditor({ tag }: { tag: TagRecord }) {
  const [state, action, pending] = useActionState(updateTagAction, {});
  const deleteAction = deleteTagAction.bind(null, tag.id);
  return <form action={action} aria-label={`Edit ${tag.name}`} className="grid gap-4 border-b border-slate-200 p-5 last:border-b-0 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
    <input name="id" type="hidden" value={tag.id} />
    <FormField errors={state.fieldErrors?.name} htmlFor={`tag-name-${tag.id}`} label="Name"><Input defaultValue={tag.name} id={`tag-name-${tag.id}`} maxLength={80} name="name" required /></FormField>
    <FormField errors={state.fieldErrors?.slug} htmlFor={`tag-slug-${tag.id}`} label="Slug"><Input defaultValue={tag.slug} id={`tag-slug-${tag.id}`} maxLength={80} name="slug" required /></FormField>
    <div className="flex gap-2"><Button disabled={pending} type="submit">Save</Button><Button className="bg-red-700 hover:bg-red-600" formAction={deleteAction} onClick={(event) => { if (!window.confirm(`Delete tag "${tag.name}"? It will be removed from ${tag.postCount} post(s).`)) event.preventDefault(); }} type="submit">Delete</Button></div>
    {state.message ? <p aria-live="polite" className={state.status === "success" ? "text-sm text-emerald-700 sm:col-span-3" : "text-sm text-red-700 sm:col-span-3"}>{state.message}</p> : null}
    <p className="text-xs text-slate-500 sm:col-span-3">Used by {tag.postCount} {tag.postCount === 1 ? "post" : "posts"}.</p>
  </form>;
}
