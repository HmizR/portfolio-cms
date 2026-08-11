/* eslint-disable @next/next/no-img-element -- The media library previews runtime S3-compatible URLs that are not known at build time. */
"use client";

import { Check, Copy, FileText, Trash2, Upload } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { deleteMediaAction, updateMediaAltTextAction } from "@/features/media/actions";
import { uploadMediaFile } from "@/features/media/client";
import type { MediaRecord } from "@/features/media/queries";

export function MediaLibrary({ initialMedia, maximumUploadMegabytes }: { initialMedia: MediaRecord[]; maximumUploadMegabytes: number }) {
  const [items, setItems] = useState(initialMedia);
  const [selectedId, setSelectedId] = useState<string | null>(initialMedia[0]?.id ?? null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const selected = items.find((item) => item.id === selectedId) ?? null;

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadMessage("Uploading...");
    try {
      const created = await uploadMediaFile(file);
      setItems((current) => [created, ...current]);
      setSelectedId(created.id);
      setUploadMessage("Upload complete.");
      router.refresh();
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "The file could not be uploaded.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
    <section><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-600">JPEG, PNG, WebP, GIF, or PDF up to {maximumUploadMegabytes} MB.</p><Button className="gap-2" disabled={uploading} onClick={() => inputRef.current?.click()} type="button"><Upload className="size-4" />Upload media</Button><input accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" className="sr-only" data-testid="media-file-input" onChange={(event) => void upload(event.target.files?.[0])} ref={inputRef} type="file" /></div>{uploadMessage ? <p aria-live="polite" className="mb-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">{uploadMessage}</p> : null}
      {items.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <button aria-pressed={selectedId === item.id} className={`overflow-hidden rounded-lg border bg-white text-left shadow-sm ${selectedId === item.id ? "border-teal-700 ring-2 ring-teal-100" : "border-slate-200"}`} key={item.id} onClick={() => setSelectedId(item.id)} type="button">{item.mimeType.startsWith("image/") ? <img alt={item.altText || ""} className="aspect-video w-full bg-slate-100 object-cover" src={item.url} /> : <div className="flex aspect-video items-center justify-center bg-slate-100"><FileText className="size-10 text-slate-500" /></div>}<span className="block truncate px-3 pt-3 text-sm font-semibold">{item.originalFilename}</span><span className="block px-3 pb-3 text-xs text-slate-500">{formatBytes(item.fileSize)}{item.width && item.height ? ` · ${item.width}×${item.height}` : ""}</span></button>)}</div> : <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No media found. Upload the first file to build your library.</p>}
    </section>
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">{selected ? <MediaDetails key={selected.id} media={selected} onDeleted={() => { setItems((current) => current.filter((item) => item.id !== selected.id)); setSelectedId(null); router.refresh(); }} /> : <p className="text-sm text-slate-500">Select an item to edit its details or copy its usable URL.</p>}</aside>
  </div>;
}

function MediaDetails({ media, onDeleted }: { media: MediaRecord; onDeleted: () => void }) {
  const [updateState, updateAction, updating] = useActionState(updateMediaAltTextAction, {});
  const [deleteState, deleteAction, deleting] = useActionState(deleteMediaAction, {});
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (deleteState.status === "success") onDeleted(); }, [deleteState.status, onDeleted]);
  async function copyUrl() { await navigator.clipboard.writeText(media.url); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }
  return <div className="space-y-5"><div><p className="break-words font-semibold text-slate-900">{media.originalFilename}</p><p className="mt-1 break-all text-xs text-slate-500">{media.storageKey}</p></div><Button className="w-full gap-2 border border-slate-300 bg-white text-slate-800 shadow-none hover:bg-slate-100" onClick={() => void copyUrl()} type="button">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? "Copied" : "Copy usable URL"}</Button><form action={updateAction}><input name="id" type="hidden" value={media.id} /><label className="text-sm font-semibold text-slate-800" htmlFor={`alt-${media.id}`}>Alternative text</label><Textarea className="mt-2" defaultValue={media.altText} id={`alt-${media.id}`} maxLength={500} name="altText" rows={4} /><Button className="mt-3" disabled={updating} type="submit">Save alternative text</Button>{updateState.message ? <p aria-live="polite" className={`mt-2 text-sm ${updateState.status === "error" ? "text-red-700" : "text-emerald-700"}`}>{updateState.message}</p> : null}</form><form action={deleteAction} onSubmit={(event) => { if (!window.confirm("Delete this media object? Existing content links may stop working.")) event.preventDefault(); }}><input name="id" type="hidden" value={media.id} /><Button className="w-full gap-2 bg-red-700 hover:bg-red-800" disabled={deleting} type="submit"><Trash2 className="size-4" />Delete media</Button>{deleteState.message && deleteState.status === "error" ? <p aria-live="polite" className="mt-2 text-sm text-red-700">{deleteState.message}</p> : null}</form></div>;
}

function formatBytes(bytes: number): string { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; return `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
