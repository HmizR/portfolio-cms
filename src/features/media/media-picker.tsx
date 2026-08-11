/* eslint-disable @next/next/no-img-element -- The picker previews runtime S3-compatible URLs that are not known at build time. */
"use client";

import { FileText, ImageIcon, Search, Upload, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMediaFile } from "@/features/media/client";
import type { MediaRecord } from "@/features/media/queries";

interface MediaPickerProps {
  acceptedMimeTypes?: readonly string[];
  imagesOnly?: boolean;
  initialMedia: MediaRecord[];
  onSelect: (media: MediaRecord) => void;
  triggerLabel?: string;
}

export function MediaPicker({ acceptedMimeTypes, imagesOnly = false, initialMedia, onSelect, triggerLabel = "Choose media" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialMedia);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const visible = useMemo(() => items.filter((item) => (!imagesOnly || item.mimeType.startsWith("image/")) && (!acceptedMimeTypes || acceptedMimeTypes.includes(item.mimeType)) && `${item.originalFilename} ${item.altText}`.toLowerCase().includes(search.toLowerCase())), [acceptedMimeTypes, imagesOnly, items, search]);

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMessage("Uploading...");
    try {
      const created = await uploadMediaFile(file);
      setItems((current) => [created, ...current]);
      setMessage("Upload complete. Select the new item to insert it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The file could not be uploaded.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return <>
    <Button className="gap-2" onClick={() => setOpen(true)} type="button"><ImageIcon className="size-4" />{triggerLabel}</Button>
    {open ? <div aria-label="Media picker" aria-modal="true" className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4" role="dialog">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="font-serif text-2xl font-semibold">Choose media</h2><p className="text-sm text-slate-500">Upload a file or select an existing item.</p></div><Button aria-label="Close media picker" className="bg-transparent px-2 text-slate-700 shadow-none hover:bg-slate-100" onClick={() => setOpen(false)} type="button"><X className="size-5" /></Button></header>
        <div className="flex flex-wrap gap-3 border-b border-slate-200 p-4"><label className="relative min-w-56 flex-1"><Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" /><span className="sr-only">Search media</span><Input className="pl-9" onChange={(event) => setSearch(event.target.value)} placeholder="Search filename or alt text" value={search} /></label><Button className="gap-2" disabled={uploading} onClick={() => inputRef.current?.click()} type="button"><Upload className="size-4" />Upload</Button><input accept={acceptedMimeTypes?.join(",") ?? (imagesOnly ? "image/jpeg,image/png,image/webp,image/gif" : "image/jpeg,image/png,image/webp,image/gif,application/pdf")} className="sr-only" onChange={(event) => void upload(event.target.files?.[0])} ref={inputRef} type="file" /></div>
        {message ? <p aria-live="polite" className="border-b border-slate-200 px-5 py-3 text-sm text-slate-600">{message}</p> : null}
        <div className="grid flex-1 gap-4 overflow-auto p-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((item) => <button className="overflow-hidden rounded-lg border border-slate-200 text-left transition hover:border-teal-600 hover:ring-2 hover:ring-teal-100" key={item.id} onClick={() => { onSelect(item); setOpen(false); }} type="button">{item.mimeType.startsWith("image/") ? <img alt={item.altText || ""} className="aspect-video w-full bg-slate-100 object-cover" src={item.url} /> : <div className="flex aspect-video items-center justify-center bg-slate-100"><FileText className="size-10 text-slate-500" /></div>}<span className="block truncate px-3 pt-3 text-sm font-semibold text-slate-900">{item.originalFilename}</span><span className="block truncate px-3 pb-3 text-xs text-slate-500">{item.altText || "No alternative text"}</span></button>)}{visible.length === 0 ? <p className="col-span-full rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">No matching media.</p> : null}</div>
      </div>
    </div> : null}
  </>;
}
