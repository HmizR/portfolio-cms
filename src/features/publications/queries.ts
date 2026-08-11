import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { publicationAuthors, publications } from "@/db/schema";
import { publicationStatusSchema, publicationTypeSchema, type PublicationStatus, type PublicationType } from "@/features/publications/validation";

export const PUBLIC_PUBLICATIONS_CACHE_TAG = "public-publications";
export interface PublicationAuthorRecord { id: string; name: string; profileUrl: string | null; position: number; isOwner: boolean }
export interface PublicationRecord extends Omit<typeof publications.$inferSelect, "publicationType" | "status"> { publicationType: PublicationType; status: PublicationStatus; authors: PublicationAuthorRecord[] }
type CachedPublication = Omit<PublicationRecord, "createdAt" | "publishedAt" | "updatedAt"> & { createdAt: Date | string; publishedAt: Date | string | null; updatedAt: Date | string };

function fromRow(row: typeof publications.$inferSelect, authors: PublicationAuthorRecord[] = []): PublicationRecord {
  return { ...row, publicationType: publicationTypeSchema.parse(row.publicationType), status: publicationStatusSchema.parse(row.status), authors };
}
async function authorsByPublication(ids: string[]): Promise<Map<string, PublicationAuthorRecord[]>> {
  if (!ids.length) return new Map();
  const rows = await db.select().from(publicationAuthors).where(inArray(publicationAuthors.publicationId, ids)).orderBy(asc(publicationAuthors.position));
  const result = new Map<string, PublicationAuthorRecord[]>();
  for (const row of rows) result.set(row.publicationId, [...(result.get(row.publicationId) ?? []), { id: row.id, name: row.name, profileUrl: row.profileUrl, position: row.position, isOwner: row.isOwner }]);
  return result;
}
export async function listPublications(): Promise<PublicationRecord[]> {
  const rows = await db.select().from(publications).orderBy(desc(publications.updatedAt));
  const authors = await authorsByPublication(rows.map((row) => row.id));
  return rows.map((row) => fromRow(row, authors.get(row.id)));
}
export const getPublicationById = cache(async (id: string): Promise<PublicationRecord | null> => {
  const [row] = await db.select().from(publications).where(eq(publications.id, id)).limit(1);
  if (!row) return null;
  const authors = await authorsByPublication([id]);
  return fromRow(row, authors.get(id));
});
const getCachedPublished = unstable_cache(async (): Promise<CachedPublication[]> => {
  const rows = await db.select().from(publications).where(eq(publications.status, "published")).orderBy(desc(publications.isFeatured), desc(publications.publicationDate), desc(publications.publishedAt));
  const authors = await authorsByPublication(rows.map((row) => row.id));
  return rows.map((row) => fromRow(row, authors.get(row.id)));
}, [PUBLIC_PUBLICATIONS_CACHE_TAG], { tags: [PUBLIC_PUBLICATIONS_CACHE_TAG] });
function normalize(row: CachedPublication): PublicationRecord { return { ...row, createdAt: row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt), updatedAt: row.updatedAt instanceof Date ? row.updatedAt : new Date(row.updatedAt), publishedAt: row.publishedAt ? row.publishedAt instanceof Date ? row.publishedAt : new Date(row.publishedAt) : null }; }
export const listPublishedPublications = cache(async () => { await connection(); return (await getCachedPublished()).map(normalize); });
const getCachedBySlug = unstable_cache(async (slug: string): Promise<CachedPublication | null> => {
  const [row] = await db.select().from(publications).where(and(eq(publications.slug, slug), eq(publications.status, "published"))).limit(1);
  if (!row) return null;
  const authors = await authorsByPublication([row.id]);
  return fromRow(row, authors.get(row.id));
}, [PUBLIC_PUBLICATIONS_CACHE_TAG], { tags: [PUBLIC_PUBLICATIONS_CACHE_TAG] });
export const getPublishedPublicationBySlug = cache(async (slug: string) => { await connection(); const row = await getCachedBySlug(slug); return row ? normalize(row) : null; });
