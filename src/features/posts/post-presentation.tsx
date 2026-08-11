import { MarkdownContent } from "@/components/markdown/markdown-content";
import type { PostTagRecord } from "@/features/posts/queries";

/* eslint-disable @next/next/no-img-element -- Milestone 6 accepts arbitrary validated external cover URLs; canonical optimized media arrives in Milestone 8. */

export function PostPresentation({ coverImageUrl, excerpt, html, publishedAt, tags, title }: {
  coverImageUrl: string | null;
  excerpt: string;
  html: string;
  publishedAt: Date | null;
  tags: PostTagRecord[];
  title: string;
}) {
  return <article>
    <header className="mb-8 border-b border-slate-200 pb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--public-accent)]">Post</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
      {excerpt ? <p className="mt-4 text-lg leading-8 text-slate-600">{excerpt}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">{publishedAt ? <time dateTime={publishedAt.toISOString()}>Published {publishedAt.toLocaleDateString(undefined, { dateStyle: "long" })}</time> : null}{tags.length > 0 ? <ul aria-label="Tags" className="flex flex-wrap gap-2">{tags.map((tag) => <li className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700" key={tag.id}>{tag.name}</li>)}</ul> : null}</div>
    </header>
    {coverImageUrl ? <img alt={`Cover for ${title}`} className="mb-8 h-auto w-full rounded-lg border border-slate-200 object-cover" src={coverImageUrl} /> : null}
    <MarkdownContent html={html} />
  </article>;
}
