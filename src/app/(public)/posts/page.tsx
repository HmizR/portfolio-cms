import type { Metadata } from "next";
import Link from "next/link";

import { PublicShell } from "@/components/public/public-shell";
import { getPublicNavigation } from "@/features/navigation/queries";
import { listPublishedPosts } from "@/features/posts/queries";
import { getPublicSiteData } from "@/features/profile/queries";

import { buildMetadata } from "@/features/seo/metadata";
import { getGlobalSeoSettings } from "@/features/seo/queries";
export async function generateMetadata(): Promise<Metadata> { return buildMetadata(await getGlobalSeoSettings(), { canonicalPath: "/posts", title: "Posts", description: "Writing and updates." }); }

function groupPostsByYear(posts: Awaited<ReturnType<typeof listPublishedPosts>>) {
  const groups = new Map<string, typeof posts>();
  for (const post of posts) {
    const year = String(post.publishedAt?.getFullYear() ?? post.createdAt.getFullYear());
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return groups;
}

export default async function PostsPage() {
  const [navigation, posts, site] = await Promise.all([getPublicNavigation(), listPublishedPosts(), getPublicSiteData()]);
  const groups = groupPostsByYear(posts);
  return <PublicShell navigation={navigation} site={site}><section><header className="border-b border-slate-200 pb-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--public-accent)]">Writing</p><h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Posts</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Essays, notes, and updates presented chronologically.</p></header>{posts.length === 0 ? <div className="py-12"><h2 className="font-serif text-2xl font-semibold">No published posts yet</h2><p className="mt-3 text-slate-600">Published writing will appear here.</p></div> : <div>{Array.from(groups, ([year, entries]) => <section className="grid gap-5 border-b border-slate-200 py-9 last:border-b-0 sm:grid-cols-[5rem_1fr]" key={year}><h2 className="font-serif text-xl font-semibold text-slate-500">{year}</h2><ol className="divide-y divide-slate-200">{entries.map((post) => <li className="py-5 first:pt-0 last:pb-0" key={post.id}><article><time className="text-sm text-slate-500" dateTime={post.publishedAt?.toISOString()}>{post.publishedAt?.toLocaleDateString(undefined, { month: "long", day: "numeric" })}</time><h3 className="mt-1 font-serif text-2xl font-semibold tracking-tight"><Link className="text-slate-950 hover:text-[var(--public-accent)]" href={`/posts/${post.slug}`}>{post.title}</Link></h3>{post.excerpt ? <p className="mt-2 leading-7 text-slate-600">{post.excerpt}</p> : null}{post.tags.length > 0 ? <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{post.tags.map((tag) => tag.name).join(" · ")}</p> : null}</article></li>)}</ol></section>)}</div>}</section></PublicShell>;
}
