import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/20 disabled:cursor-not-allowed disabled:bg-slate-100 sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}
