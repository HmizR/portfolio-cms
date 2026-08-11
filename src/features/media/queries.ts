import "server-only";

import { count, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/db";
import { media } from "@/db/schema";
import { env } from "@/lib/env/server";

export interface MediaRecord {
  altText: string;
  createdAt: string;
  fileSize: number;
  filename: string;
  height: number | null;
  id: string;
  mimeType: string;
  originalFilename: string;
  storageKey: string;
  url: string;
  width: number | null;
}

function toMediaRecord(row: typeof media.$inferSelect): MediaRecord {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    url: `${env.APP_URL.replace(/\/$/, "")}/media/${row.id}`,
  };
}

export async function listMedia(search = ""): Promise<MediaRecord[]> {
  const pattern = `%${search}%`;
  const rows = await db.select().from(media)
    .where(search ? or(ilike(media.originalFilename, pattern), ilike(media.filename, pattern), ilike(media.altText, pattern)) : undefined)
    .orderBy(desc(media.createdAt));
  return rows.map(toMediaRecord);
}

export async function getMediaById(id: string): Promise<MediaRecord | null> {
  const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return row ? toMediaRecord(row) : null;
}

export async function getMediaUrlById(id: string | null): Promise<string | null> {
  if (!id) return null;
  return (await getMediaById(id))?.url ?? null;
}

export async function countMedia(): Promise<number> {
  const [result] = await db.select({ value: count() }).from(media);
  return result?.value ?? 0;
}
