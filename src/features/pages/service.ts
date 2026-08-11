import "server-only";

import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { pages } from "@/db/schema";
import { type PageRecord } from "@/features/pages/queries";
import { assertImageMediaIds } from "@/features/media/service";
import {
  pageStatusSchema,
  type PageFormInput,
  type PageIntent,
} from "@/features/pages/validation";

export class PageSlugConflictError extends Error {
  constructor() {
    super("A page already uses this slug.");
    this.name = "PageSlugConflictError";
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

async function assertSlugAvailable(slug: string, excludedId?: string): Promise<void> {
  const condition = excludedId
    ? and(eq(pages.slug, slug), ne(pages.id, excludedId))
    : eq(pages.slug, slug);
  const [existing] = await db.select({ id: pages.id }).from(pages).where(condition).limit(1);
  if (existing) throw new PageSlugConflictError();
}

export async function createPage(input: { title: string; slug: string }): Promise<string> {
  await assertSlugAvailable(input.slug);
  try {
    const [created] = await db.insert(pages).values(input).returning({ id: pages.id });
    if (!created) throw new Error("Page creation did not return a page.");
    return created.id;
  } catch (error) {
    if (isUniqueViolation(error)) throw new PageSlugConflictError();
    throw error;
  }
}

export async function updatePage(
  input: PageFormInput,
  intent: PageIntent,
): Promise<{ page: PageRecord; previousSlug: string }> {
  await assertImageMediaIds([input.ogMediaId]);
  await assertSlugAvailable(input.slug, input.id);
  const [current] = await db.select().from(pages).where(eq(pages.id, input.id)).limit(1);
  if (!current) throw new Error("Page not found.");

  const nextStatus = intent === "save"
    ? pageStatusSchema.parse(current.status)
    : intent === "publish" ? "published" : intent === "archive" ? "archived" : intent;
  const publishedAt = nextStatus === "published"
    ? current.publishedAt ?? new Date()
    : nextStatus === "draft" ? null : current.publishedAt;

  try {
    const [updated] = await db
      .update(pages)
      .set({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        contentMarkdown: input.contentMarkdown,
        draftMarkdown: null,
        status: nextStatus,
        publishedAt,
        showTitle: input.showTitle,
        showSidebar: input.showSidebar,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        canonicalUrl: input.canonicalUrl,
        ogMediaId: input.ogMediaId,
        ogImageUrl: input.ogImageUrl,
        updatedAt: new Date(),
      })
      .where(eq(pages.id, input.id))
      .returning();
    if (!updated) throw new Error("Page update did not return a page.");
    return {
      page: { ...updated, status: pageStatusSchema.parse(updated.status) },
      previousSlug: current.slug,
    };
  } catch (error) {
    if (isUniqueViolation(error)) throw new PageSlugConflictError();
    throw error;
  }
}

export async function autosavePage(id: string, contentMarkdown: string): Promise<Date> {
  const savedAt = new Date();
  const [updated] = await db
    .update(pages)
    .set({ draftMarkdown: contentMarkdown, updatedAt: savedAt })
    .where(eq(pages.id, id))
    .returning({ id: pages.id });
  if (!updated) throw new Error("Page not found.");
  return savedAt;
}

export async function deletePage(id: string): Promise<string | null> {
  const [deleted] = await db
    .delete(pages)
    .where(eq(pages.id, id))
    .returning({ slug: pages.slug });
  return deleted?.slug ?? null;
}
