"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import type { MediaRecord } from "@/features/media/queries";
import { MediaField } from "@/features/media/media-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { autosavePostAction, renderPostMarkdownPreviewAction, updatePostAction } from "@/features/posts/actions";
import type { PostTagRecord } from "@/features/posts/queries";
import type { PostActionState, PostFormInput, PostStatus } from "@/features/posts/validation";
import { FormField } from "@/features/profile/form-field";

interface PostEditorFormProps {
  availableMedia: MediaRecord[];
  availableTags: PostTagRecord[];
  initialPost: PostFormInput;
  initialPreviewHtml: string;
  initialStatus: PostStatus;
}

export function PostEditorForm(props: PostEditorFormProps) {
  const [state, action, pending] = useActionState(updatePostAction, {});
  const displayedPost = state.savedPost ?? props.initialPost;
  const displayedStatus = state.savedStatus ?? props.initialStatus;
  return <PostEditorFields {...props} action={action} key={JSON.stringify({ displayedPost, displayedStatus })} pending={pending} post={displayedPost} state={state} status={displayedStatus} />;
}

function PostEditorFields({ action, availableMedia, availableTags, initialPreviewHtml, pending, post, state, status }: Omit<PostEditorFormProps, "initialPost" | "initialStatus"> & {
  action: (payload: FormData) => void;
  pending: boolean;
  post: PostFormInput;
  state: PostActionState;
  status: PostStatus;
}) {
  const [markdown, setMarkdown] = useState(post.contentMarkdown);
  const selectedTags = new Set(post.tagIds);

  return (
    <form action={action} className="space-y-6">
      <input name="id" type="hidden" value={post.id} />
      <textarea hidden name="contentMarkdown" readOnly value={markdown} />
      {state.message ? <div aria-live="polite" className={state.status === "success" ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"}>{state.message}</div> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</span><p className="mt-1 font-semibold capitalize text-slate-900">{status}</p></div>
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 underline underline-offset-4" href={`/preview/posts/${post.id}`} target="_blank">Preview public layout <ExternalLink className="size-4" /><span className="sr-only"> (opens in a new tab)</span></Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-semibold">Post details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField errors={state.fieldErrors?.title} htmlFor="title" label="Title"><Input defaultValue={post.title} id="title" maxLength={200} name="title" required /></FormField>
          <FormField description="Changing the title does not change this URL." errors={state.fieldErrors?.slug} htmlFor="slug" label="Slug"><Input defaultValue={post.slug} id="slug" maxLength={120} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></FormField>
          <div className="sm:col-span-2"><FormField errors={state.fieldErrors?.excerpt} htmlFor="excerpt" label="Excerpt"><Textarea defaultValue={post.excerpt} id="excerpt" maxLength={500} name="excerpt" rows={3} /></FormField></div>
          <div className="sm:col-span-2"><MediaField description="Choose an uploaded image for the post cover." initialId={post.coverMediaId} initialMedia={availableMedia} label="Managed cover image" name="coverMediaId" /></div>
          <div className="sm:col-span-2"><FormField description="Optional fallback for an externally hosted cover." errors={state.fieldErrors?.coverImageUrl} htmlFor="coverImageUrl" label="External cover image URL"><Input defaultValue={post.coverImageUrl ?? ""} id="coverImageUrl" name="coverImageUrl" type="url" /></FormField></div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3"><div><h2 className="font-serif text-xl font-semibold">Tags</h2><p className="mt-1 text-sm text-slate-500">Choose normalized tags for this post.</p></div><Link className="text-sm font-semibold text-teal-800 underline underline-offset-4" href="/admin/posts/tags">Manage tags</Link></div>
        {availableTags.length === 0 ? <p className="mt-5 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">No tags yet. Create one from Manage tags.</p> : <div className="mt-5 flex flex-wrap gap-3">{availableTags.map((tag) => <label className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700" key={tag.id}><input className="size-4" defaultChecked={selectedTags.has(tag.id)} name="tagIds" type="checkbox" value={tag.id} />{tag.name}</label>)}</div>}
        {state.fieldErrors?.tagIds?.map((error) => <p className="mt-2 text-sm text-red-700" key={error}>{error}</p>)}
      </section>

      <div>{state.fieldErrors?.contentMarkdown?.map((error) => <p className="mb-2 text-sm text-red-700" key={error}>{error}</p>)}<MarkdownEditor autosaveAction={autosavePostAction} contentId={post.id} initialPreviewHtml={initialPreviewHtml} media={availableMedia} onChange={setMarkdown} previewAction={renderPostMarkdownPreviewAction} value={markdown} /></div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-semibold">Search and sharing</h2>
        <p className="mt-1 text-sm text-slate-500">Optional post-specific overrides. Shared SEO tooling arrives in Milestone 11.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField errors={state.fieldErrors?.seoTitle} htmlFor="seoTitle" label="SEO title"><Input defaultValue={post.seoTitle ?? ""} id="seoTitle" maxLength={100} name="seoTitle" /></FormField>
          <FormField errors={state.fieldErrors?.seoDescription} htmlFor="seoDescription" label="SEO description"><Input defaultValue={post.seoDescription ?? ""} id="seoDescription" maxLength={300} name="seoDescription" /></FormField>
          <FormField errors={state.fieldErrors?.canonicalUrl} htmlFor="canonicalUrl" label="Canonical URL"><Input defaultValue={post.canonicalUrl ?? ""} id="canonicalUrl" name="canonicalUrl" placeholder="https://example.com/original" type="url" /></FormField>
          <MediaField description="Choose an uploaded image for social previews." initialId={post.ogMediaId} initialMedia={availableMedia} label="Managed social image" name="ogMediaId" />
          <FormField description="Optional fallback for an externally hosted social image." errors={state.fieldErrors?.ogImageUrl} htmlFor="ogImageUrl" label="External social image URL"><Input defaultValue={post.ogImageUrl ?? ""} id="ogImageUrl" name="ogImageUrl" type="url" /></FormField>
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
