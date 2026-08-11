import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaLibrary } from "@/features/media/media-library";
import { listMedia } from "@/features/media/queries";
import { mediaSearchSchema } from "@/features/media/validation";
import { env } from "@/lib/env/server";

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const rawSearch = (await searchParams).search ?? "";
  const parsed = mediaSearchSchema.safeParse(rawSearch);
  const search = parsed.success ? parsed.data : "";
  const items = await listMedia(search);
  return <div className="mx-auto max-w-7xl"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Website</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Media library</h1><p className="mt-2 max-w-2xl text-slate-600">Upload and manage files stored through the configured S3-compatible provider.</p></div><form className="mb-6 flex max-w-xl gap-2" method="get"><label className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" /><span className="sr-only">Search media</span><Input className="pl-9" defaultValue={search} maxLength={100} name="search" placeholder="Search filename or alternative text" /></label><Button type="submit">Search</Button></form><MediaLibrary initialMedia={items} key={search} maximumUploadMegabytes={env.MAX_UPLOAD_SIZE_MB} /></div>;
}
