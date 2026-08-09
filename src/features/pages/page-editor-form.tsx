"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updatePageAction } from "@/features/pages/actions";
import { MarkdownEditor } from "@/features/pages/markdown-editor";
import { FormField } from "@/features/profile/form-field";
import type { PageActionState, PageFormInput, PageStatus } from "@/features/pages/validation";

interface PageEditorFormProps {
  initialPage: PageFormInput;
  initialPreviewHtml: string;
  initialStatus: PageStatus;
}

export function PageEditorForm(props: PageEditorFormProps) {
  const [state, action, pending] = useActionState(updatePageAction, {});
  const displayedPage = state.savedPage ?? props.initialPage;
  const displayedStatus = state.savedStatus ?? props.initialStatus;
  return <PageEditorFields {...props} action={action} key={JSON.stringify({ displayedPage, displayedStatus })} page={displayedPage} pending={pending} state={state} status={displayedStatus} />;
}

function PageEditorFields({ action, initialPreviewHtml, page, pending, state, status }: PageEditorFormProps & {
  action: (payload: FormData) => void;
  page: PageFormInput;
  pending: boolean;
  state: PageActionState;
  status: PageStatus;
}) {
  const [markdown, setMarkdown] = useState(page.contentMarkdown);

  return (
    <form action={action} className="space-y-6">
      <input name="id" type="hidden" value={page.id} />
      <textarea name="contentMarkdown" readOnly hidden value={markdown} />
      {state.message ? <div aria-live="polite" className={state.status === "success" ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"}>{state.message}</div> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</span><p className="mt-1 font-semibold capitalize text-slate-900">{status}</p></div>
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 underline underline-offset-4" href={`/preview/pages/${page.id}`} target="_blank">Preview public layout <ExternalLink className="size-4" /><span className="sr-only"> (opens in a new tab)</span></Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-semibold">Page details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField errors={state.fieldErrors?.title} htmlFor="title" label="Title"><Input defaultValue={page.title} id="title" maxLength={200} name="title" required /></FormField>
          <FormField description="Changing the title does not change this URL." errors={state.fieldErrors?.slug} htmlFor="slug" label="Slug"><Input defaultValue={page.slug} id="slug" maxLength={120} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></FormField>
          <div className="sm:col-span-2"><FormField errors={state.fieldErrors?.excerpt} htmlFor="excerpt" label="Excerpt"><Textarea defaultValue={page.excerpt} id="excerpt" maxLength={500} name="excerpt" rows={3} /></FormField></div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input className="size-4" defaultChecked={page.showTitle} name="showTitle" type="checkbox" /> Show title publicly</label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input className="size-4" defaultChecked={page.showSidebar} name="showSidebar" type="checkbox" /> Show profile sidebar</label>
        </div>
      </section>

      <div>{state.fieldErrors?.contentMarkdown?.map((error) => <p className="mb-2 text-sm text-red-700" key={error}>{error}</p>)}<MarkdownEditor initialPreviewHtml={initialPreviewHtml} onChange={setMarkdown} pageId={page.id} value={markdown} /></div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-semibold">Search and sharing</h2>
        <p className="mt-1 text-sm text-slate-500">Optional page-specific overrides. Global SEO tooling arrives in Milestone 11.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField errors={state.fieldErrors?.seoTitle} htmlFor="seoTitle" label="SEO title"><Input defaultValue={page.seoTitle ?? ""} id="seoTitle" maxLength={100} name="seoTitle" /></FormField>
          <FormField errors={state.fieldErrors?.seoDescription} htmlFor="seoDescription" label="SEO description"><Input defaultValue={page.seoDescription ?? ""} id="seoDescription" maxLength={300} name="seoDescription" /></FormField>
          <FormField errors={state.fieldErrors?.canonicalUrl} htmlFor="canonicalUrl" label="Canonical URL"><Input defaultValue={page.canonicalUrl ?? ""} id="canonicalUrl" name="canonicalUrl" placeholder="https://example.com/original" type="url" /></FormField>
          <FormField description="Use an external image URL until the Media milestone." errors={state.fieldErrors?.ogImageUrl} htmlFor="ogImageUrl" label="Open Graph image URL"><Input defaultValue={page.ogImageUrl ?? ""} id="ogImageUrl" name="ogImageUrl" type="url" /></FormField>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        {status !== "draft" ? <Button className="border border-slate-300 bg-white text-slate-700 shadow-none hover:bg-slate-100" disabled={pending} name="intent" type="submit" value="draft">Move to draft</Button> : null}
        {status !== "archived" ? <Button className="border border-slate-300 bg-white text-slate-700 shadow-none hover:bg-slate-100" disabled={pending} name="intent" type="submit" value="archive">Archive</Button> : null}
        <Button className="border border-slate-300 bg-white text-slate-700 shadow-none hover:bg-slate-100" disabled={pending} name="intent" type="submit" value="save">Save changes</Button>
        {status !== "published" ? <Button disabled={pending} name="intent" type="submit" value="publish">Publish</Button> : null}
      </div>
    </form>
  );
}
