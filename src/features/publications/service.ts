import "server-only";

import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { publicationAuthors, publications } from "@/db/schema";
import { assertImageMediaIds, assertPdfMediaId } from "@/features/media/service";
import type { PublicationRecord } from "@/features/publications/queries";
import { publicationStatusSchema, publicationTypeSchema, type PublicationFormInput, type PublicationIntent } from "@/features/publications/validation";

export class PublicationSlugConflictError extends Error { constructor() { super("A publication already uses this slug."); this.name = "PublicationSlugConflictError"; } }
function isUniqueViolation(error: unknown): boolean { let current: unknown = error; for (let depth = 0; depth < 3; depth += 1) { if (!current || typeof current !== "object") return false; if ("code" in current && current.code === "23505") return true; current = "cause" in current ? current.cause : null; } return false; }
async function assertSlugAvailable(slug: string, excludedId?: string) { const condition = excludedId ? and(eq(publications.slug, slug), ne(publications.id, excludedId)) : eq(publications.slug, slug); const [row] = await db.select({ id: publications.id }).from(publications).where(condition).limit(1); if (row) throw new PublicationSlugConflictError(); }

export async function createPublication(input: { title: string; slug: string }): Promise<string> {
  await assertSlugAvailable(input.slug);
  try { const [created] = await db.insert(publications).values(input).returning({ id: publications.id }); if (!created) throw new Error("Publication creation returned no row."); return created.id; } catch (error) { if (isUniqueViolation(error)) throw new PublicationSlugConflictError(); throw error; }
}
export async function updatePublication(input: PublicationFormInput, intent: PublicationIntent): Promise<{ publication: PublicationRecord; previousSlug: string }> {
  await Promise.all([assertPdfMediaId(input.pdfMediaId), assertImageMediaIds([input.ogMediaId]), assertSlugAvailable(input.slug, input.id)]);
  return db.transaction(async (tx) => {
    const [current] = await tx.select().from(publications).where(eq(publications.id, input.id)).limit(1);
    if (!current) throw new Error("Publication not found.");
    const nextStatus = intent === "save" ? publicationStatusSchema.parse(current.status) : intent === "publish" ? "published" : intent === "archive" ? "archived" : intent;
    const publishedAt = nextStatus === "published" ? current.publishedAt ?? new Date() : nextStatus === "draft" ? null : current.publishedAt;
    let updated: typeof publications.$inferSelect | undefined;
    try { [updated] = await tx.update(publications).set({ title: input.title, slug: input.slug, abstract: input.abstract, contentMarkdown: input.contentMarkdown, draftMarkdown: null, publicationType: input.publicationType, venue: input.venue, publisher: input.publisher, publicationDate: input.publicationDate, doi: input.doi, externalUrl: input.externalUrl, pdfMediaId: input.pdfMediaId, isFeatured: input.isFeatured, status: nextStatus, publishedAt, seoTitle: input.seoTitle, seoDescription: input.seoDescription, canonicalUrl: input.canonicalUrl, ogMediaId: input.ogMediaId, ogImageUrl: input.ogImageUrl, updatedAt: new Date() }).where(eq(publications.id, input.id)).returning(); } catch (error) { if (isUniqueViolation(error)) throw new PublicationSlugConflictError(); throw error; }
    if (!updated) throw new Error("Publication update returned no row.");
    await tx.delete(publicationAuthors).where(eq(publicationAuthors.publicationId, input.id));
    if (input.authors.length) await tx.insert(publicationAuthors).values(input.authors.map((author, position) => ({ ...author, publicationId: input.id, position })));
    return { publication: { ...updated, publicationType: publicationTypeSchema.parse(updated.publicationType), status: publicationStatusSchema.parse(updated.status), authors: [] }, previousSlug: current.slug };
  });
}
export async function autosavePublication(id: string, contentMarkdown: string): Promise<Date> { const savedAt = new Date(); const [updated] = await db.update(publications).set({ draftMarkdown: contentMarkdown, updatedAt: savedAt }).where(eq(publications.id, id)).returning({ id: publications.id }); if (!updated) throw new Error("Publication not found."); return savedAt; }
export async function deletePublication(id: string): Promise<string | null> { const [deleted] = await db.delete(publications).where(eq(publications.id, id)).returning({ slug: publications.slug }); return deleted?.slug ?? null; }
