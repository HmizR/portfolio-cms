"use client";

import { FileText, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { MediaRecord } from "@/features/media/queries";
import { MediaPicker } from "@/features/media/media-picker";

const PDF_TYPES = ["application/pdf"] as const;

export function PdfField({ initialId, media }: { initialId: string | null; media: MediaRecord[] }) {
  const [selected, setSelected] = useState(() => media.find((item) => item.id === initialId && item.mimeType === "application/pdf") ?? null);
  return <fieldset className="rounded-lg border border-slate-200 p-4"><legend className="px-1 text-sm font-semibold">PDF attachment</legend><input name="pdfMediaId" type="hidden" value={selected?.id ?? ""} /><p className="mb-3 text-sm text-slate-500">Choose an uploaded PDF. The public download stays behind the private-bucket media route.</p>{selected ? <div className="mb-3 flex items-center gap-3 rounded-md bg-slate-50 p-3"><FileText className="size-8 text-slate-500" /><p className="min-w-0 flex-1 truncate text-sm font-semibold">{selected.originalFilename}</p><Button aria-label="Clear PDF attachment" className="bg-transparent px-2 text-slate-600 shadow-none hover:bg-slate-200" onClick={() => setSelected(null)} type="button"><X className="size-4" /></Button></div> : null}<MediaPicker acceptedMimeTypes={PDF_TYPES} initialMedia={media} onSelect={setSelected} triggerLabel={selected ? "Replace PDF" : "Choose PDF"} /></fieldset>;
}
