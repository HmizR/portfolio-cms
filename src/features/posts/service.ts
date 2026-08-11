import "server-only";

import { and, eq, inArray, ne } from "drizzle-orm";

import { db } from "@/db";
import { posts, postTags, tags } from "@/db/schema";
import type { PostRecord } from "@/features/posts/queries";
import { postStatusSchema, type PostFormInput, type PostIntent } from "@/features/posts/validation";

export class PostSlugConflictError extends Error {
  constructor() {
    super("A post already uses this slug.");
    this.name = "PostSlugConflictError";
  }
}

export class TagConflictError extends Error {
  constructor() {
    super("A tag already uses this name or slug.");
    this.name = "TagConflictError";
  }
}

function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 3; depth += 1) {
    if (!current || typeof current !== "object") return false;
    if ("code" in current && current.code === "23505") return true;
    current = "cause" in current ? current.cause : null;
  }
  return false;
}

async function assertPostSlugAvailable(slug: string, excludedId?: string): Promise<void> {
  const condition = excludedId ? and(eq(posts.slug, slug), ne(posts.id, excludedId)) : eq(posts.slug, slug);
  const [existing] = await db.select({ id: posts.id }).from(posts).where(condition).limit(1);
  if (existing) throw new PostSlugConflictError();
}

export async function createPost(input: { title: string; slug: string }): Promise<string> {
  await assertPostSlugAvailable(input.slug);
  try {
    const [created] = await db.insert(posts).values(input).returning({ id: posts.id });
    if (!created) throw new Error("Post creation did not return a post.");
    return created.id;
  } catch (error) {
    if (isUniqueViolation(error)) throw new PostSlugConflictError();
    throw error;
  }
}

export async function updatePost(input: PostFormInput, intent: PostIntent): Promise<{ post: PostRecord; previousSlug: string }> {
  await assertPostSlugAvailable(input.slug, input.id);
  return db.transaction(async (tx) => {
    const [current] = await tx.select().from(posts).where(eq(posts.id, input.id)).limit(1);
    if (!current) throw new Error("Post not found.");

    if (input.tagIds.length > 0) {
      const existingTags = await tx.select({ id: tags.id }).from(tags).where(inArray(tags.id, input.tagIds));
      if (existingTags.length !== input.tagIds.length) throw new Error("One or more selected tags no longer exist.");
    }

    const nextStatus = intent === "save"
      ? postStatusSchema.parse(current.status)
      : intent === "publish" ? "published" : intent === "archive" ? "archived" : intent;
    const publishedAt = nextStatus === "published" ? current.publishedAt ?? new Date() : nextStatus === "draft" ? null : current.publishedAt;

    let updated: typeof posts.$inferSelect | undefined;
    try {
      [updated] = await tx
        .update(posts)
        .set({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          contentMarkdown: input.contentMarkdown,
          draftMarkdown: null,
          coverImageUrl: input.coverImageUrl,
          status: nextStatus,
          publishedAt,
          seoTitle: input.seoTitle,
          seoDescription: input.seoDescription,
          canonicalUrl: input.canonicalUrl,
          ogImageUrl: input.ogImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning();
    } catch (error) {
      if (isUniqueViolation(error)) throw new PostSlugConflictError();
      throw error;
    }
    if (!updated) throw new Error("Post update did not return a post.");

    await tx.delete(postTags).where(eq(postTags.postId, input.id));
    if (input.tagIds.length > 0) await tx.insert(postTags).values(input.tagIds.map((tagId) => ({ postId: input.id, tagId })));

    return {
      post: {
        ...updated,
        status: postStatusSchema.parse(updated.status),
        tags: [],
      },
      previousSlug: current.slug,
    };
  });
}

export async function autosavePost(id: string, contentMarkdown: string): Promise<Date> {
  const savedAt = new Date();
  const [updated] = await db.update(posts).set({ draftMarkdown: contentMarkdown, updatedAt: savedAt }).where(eq(posts.id, id)).returning({ id: posts.id });
  if (!updated) throw new Error("Post not found.");
  return savedAt;
}

export async function deletePost(id: string): Promise<string | null> {
  const [deleted] = await db.delete(posts).where(eq(posts.id, id)).returning({ slug: posts.slug });
  return deleted?.slug ?? null;
}

export async function createTag(input: { name: string; slug: string }): Promise<void> {
  try {
    await db.insert(tags).values(input);
  } catch (error) {
    if (isUniqueViolation(error)) throw new TagConflictError();
    throw error;
  }
}

export async function updateTagRecord(input: { id: string; name: string; slug: string }): Promise<void> {
  try {
    const [updated] = await db.update(tags).set({ name: input.name, slug: input.slug, updatedAt: new Date() }).where(eq(tags.id, input.id)).returning({ id: tags.id });
    if (!updated) throw new Error("Tag not found.");
  } catch (error) {
    if (isUniqueViolation(error)) throw new TagConflictError();
    throw error;
  }
}

export async function deleteTag(id: string): Promise<void> {
  await db.delete(tags).where(eq(tags.id, id));
}
