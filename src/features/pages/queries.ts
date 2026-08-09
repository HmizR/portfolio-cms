import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { pages } from "@/db/schema";
import { pageStatusSchema, type PageStatus } from "@/features/pages/validation";

export const PUBLIC_PAGES_CACHE_TAG = "public-pages";

export interface PageRecord extends Omit<typeof pages.$inferSelect, "status"> {
  status: PageStatus;
}

type CachedPageRecord = Omit<PageRecord, "createdAt" | "publishedAt" | "updatedAt"> & {
  createdAt: Date | string;
  publishedAt: Date | string | null;
  updatedAt: Date | string;
};

function pageFromRow(row: typeof pages.$inferSelect): PageRecord {
  return { ...row, status: pageStatusSchema.parse(row.status) };
}

export async function listPages(): Promise<PageRecord[]> {
  const rows = await db.select().from(pages).orderBy(desc(pages.updatedAt));
  return rows.map(pageFromRow);
}

export const getPageById = cache(async (id: string): Promise<PageRecord | null> => {
  const [row] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  return row ? pageFromRow(row) : null;
});

const getCachedPublishedPageBySlug = unstable_cache(
  async (slug: string): Promise<CachedPageRecord | null> => {
    const [row] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.slug, slug), eq(pages.status, "published")))
      .limit(1);
    return row ? pageFromRow(row) : null;
  },
  [PUBLIC_PAGES_CACHE_TAG],
  { tags: [PUBLIC_PAGES_CACHE_TAG] },
);

export const getPublishedPageBySlug = cache(async (slug: string) => {
  await connection();
  const page = await getCachedPublishedPageBySlug(slug);
  if (!page) return null;
  return {
    ...page,
    createdAt: page.createdAt instanceof Date ? page.createdAt : new Date(page.createdAt),
    publishedAt: page.publishedAt
      ? page.publishedAt instanceof Date ? page.publishedAt : new Date(page.publishedAt)
      : null,
    updatedAt: page.updatedAt instanceof Date ? page.updatedAt : new Date(page.updatedAt),
  } satisfies PageRecord;
});
