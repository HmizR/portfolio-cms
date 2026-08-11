/* eslint-disable @next/next/no-img-element -- Media URLs come from the runtime storage provider and retain their recorded dimensions. */
"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/features/media/media-picker";
import type { MediaRecord } from "@/features/media/queries";

export function MediaField({ description, initialId, initialMedia, label, name }: { description: string; initialId: string | null; initialMedia: MediaRecord[]; label: string; name: string }) {
  const [selected, setSelected] = useState(() => initialMedia.find((item) => item.id === initialId) ?? null);
  return <fieldset className="rounded-lg border border-slate-200 p-4"><legend className="px-1 text-sm font-semibold text-slate-800">{label}</legend><input name={name} type="hidden" value={selected?.id ?? ""} /><p className="mb-3 text-sm text-slate-500">{description}</p>{selected ? <div className="mb-3 flex items-center gap-3 rounded-md bg-slate-50 p-3"><img alt={selected.altText || ""} className="size-16 rounded object-cover" src={selected.url} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{selected.originalFilename}</p><p className="truncate text-xs text-slate-500">{selected.altText || "No alternative text"}</p></div><Button aria-label={`Clear ${label}`} className="bg-transparent px-2 text-slate-600 shadow-none hover:bg-slate-200" onClick={() => setSelected(null)} type="button"><X className="size-4" /></Button></div> : null}<MediaPicker imagesOnly initialMedia={initialMedia} onSelect={setSelected} triggerLabel={selected ? "Replace image" : "Choose image"} /></fieldset>;
}
