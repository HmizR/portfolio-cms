import { MarkdownContent } from "@/components/markdown/markdown-content";

export function PagePresentation({
  excerpt,
  html,
  publishedAt,
  showTitle,
  title,
}: {
  excerpt: string;
  html: string;
  publishedAt: Date | null;
  showTitle: boolean;
  title: string;
}) {
  return <article>{showTitle ? <header className="mb-8 border-b border-slate-200 pb-7"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--public-accent)]">Page</p><h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>{excerpt ? <p className="mt-4 text-lg leading-8 text-slate-600">{excerpt}</p> : null}{publishedAt ? <p className="mt-4 text-sm text-slate-500">Published {publishedAt.toLocaleDateString(undefined, { dateStyle: "long" })}</p> : null}</header> : null}<MarkdownContent html={html} /></article>;
}
