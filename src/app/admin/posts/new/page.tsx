import type { Metadata } from "next";

import { CreatePostForm } from "@/features/posts/create-post-form";

export const metadata: Metadata = { title: "New post | PortfolioCMS" };

export default function NewPostPage() {
  return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Posts</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Create a post</h1><p className="mb-8 mt-2 max-w-2xl text-slate-600">Start with a stable title and URL. The post remains private until you publish it.</p><CreatePostForm /></div>;
}
