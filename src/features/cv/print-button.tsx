"use client";
import { Printer } from "lucide-react";
export function CvPrintButton() { return <button className="cv-toolbar inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50" onClick={() => window.print()} type="button"><Printer aria-hidden="true" className="size-4" /> Print or save PDF</button>; }
