import "server-only";

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { posts, postTags, tags } from "@/db/schema";
import { postStatusSchema, type PostStatus } from "@/features/posts/validation";

export const PUBLIC_POSTS_CACHE_TAG = "public-posts";

export interface PostTagRecord {
  id: string;
  name: string;
  slug: string;
}

export interface PostRecord extends Omit<typeof posts.$inferSelect, "status"> {
  status: PostStatus;
  tags: PostTagRecord[];
}

export type TagRecord = typeof tags.$inferSelect & { postCount: number };

type CachedPostRecord = Omit<PostRecord, "createdAt" | "publishedAt" | "updatedAt"> & {
  createdAt: Date | string;
  publishedAt: Date | string | null;
  updatedAt: Date | string;
};

function postFromRow(row: typeof posts.$inferSelect, assignedTags: PostTagRecord[] = []): PostRecord {
  return { ...row, status: postStatusSchema.parse(row.status), tags: assignedTags };
}

async function tagsByPostIds(postIds: string[]): Promise<Map<string, PostTagRecord[]>> {
  if (postIds.length === 0) return new Map();
  const rows = await db
    .select({ postId: postTags.postId, id: tags.id, name: tags.name, slug: tags.slug })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(inArray(postTags.postId, postIds))
    .orderBy(asc(tags.name));
  const result = new Map<string, PostTagRecord[]>();
  for (const row of rows) result.set(row.postId, [...(result.get(row.postId) ?? []), { id: row.id, name: row.name, slug: row.slug }]);
  return result;
}

export async function listPosts(): Promise<PostRecord[]> {
  const rows = await db.select().from(posts).orderBy(desc(posts.updatedAt));
  const assignedTags = await tagsByPostIds(rows.map((row) => row.id));
  return rows.map((row) => postFromRow(row, assignedTags.get(row.id)));
}

export const getPostById = cache(async (id: string): Promise<PostRecord | null> => {
  const [row] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!row) return null;
  const assignedTags = await tagsByPostIds([row.id]);
  return postFromRow(row, assignedTags.get(row.id));
});

export async function listTags(): Promise<TagRecord[]> {
  const rows = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
      createdAt: tags.createdAt,
      updatedAt: tags.updatedAt,
      postCount: sql<number>`count(${postTags.postId})::int`,
    })
    .from(tags)
    .leftJoin(postTags, eq(tags.id, postTags.tagId))
    .groupBy(tags.id)
    .orderBy(asc(tags.name));
  return rows;
}

const getCachedPublishedPosts = unstable_cache(async (): Promise<CachedPostRecord[]> => {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));
  const assignedTags = await tagsByPostIds(rows.map((row) => row.id));
  return rows.map((row) => postFromRow(row, assignedTags.get(row.id)));
}, [PUBLIC_POSTS_CACHE_TAG], { tags: [PUBLIC_POSTS_CACHE_TAG] });

function normalizeCachedPost(post: CachedPostRecord): PostRecord {
  return {
    ...post,
    createdAt: post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt),
    publishedAt: post.publishedAt ? post.publishedAt instanceof Date ? post.publishedAt : new Date(post.publishedAt) : null,
    updatedAt: post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt),
  };
}

export const listPublishedPosts = cache(async (): Promise<PostRecord[]> => {
  await connection();
  return (await getCachedPublishedPosts()).map(normalizeCachedPost);
});

const getCachedPublishedPostBySlug = unstable_cache(async (slug: string): Promise<CachedPostRecord | null> => {
  const [row] = await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.status, "published"))).limit(1);
  if (!row) return null;
  const assignedTags = await tagsByPostIds([row.id]);
  return postFromRow(row, assignedTags.get(row.id));
}, [PUBLIC_POSTS_CACHE_TAG], { tags: [PUBLIC_POSTS_CACHE_TAG] });

export const getPublishedPostBySlug = cache(async (slug: string): Promise<PostRecord | null> => {
  await connection();
  const post = await getCachedPublishedPostBySlug(slug);
  return post ? normalizeCachedPost(post) : null;
});
