import "server-only";

import { and, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { projects, projectTechnologies, technologies } from "@/db/schema";
import type { ProjectRecord } from "@/features/projects/queries";
import { projectPublicationStatusSchema, projectStatusSchema, type ProjectFormInput, type ProjectIntent } from "@/features/projects/validation";

export class ProjectSlugConflictError extends Error { constructor() { super("A project already uses this slug."); this.name = "ProjectSlugConflictError"; } }
export class TechnologyConflictError extends Error { constructor() { super("A technology already uses this name or slug."); this.name = "TechnologyConflictError"; } }
function isUniqueViolation(error: unknown): boolean { let current: unknown = error; for (let depth = 0; depth < 3; depth += 1) { if (!current || typeof current !== "object") return false; if ("code" in current && current.code === "23505") return true; current = "cause" in current ? current.cause : null; } return false; }
async function assertSlugAvailable(slug: string, excludedId?: string) { const condition = excludedId ? and(eq(projects.slug, slug), ne(projects.id, excludedId)) : eq(projects.slug, slug); const [row] = await db.select({ id: projects.id }).from(projects).where(condition).limit(1); if (row) throw new ProjectSlugConflictError(); }

export async function createProject(input: { title: string; slug: string }): Promise<string> {
  await assertSlugAvailable(input.slug);
  try { const [created] = await db.insert(projects).values(input).returning({ id: projects.id }); if (!created) throw new Error("Project creation did not return a project."); return created.id; } catch (error) { if (isUniqueViolation(error)) throw new ProjectSlugConflictError(); throw error; }
}

export async function updateProject(input: ProjectFormInput, intent: ProjectIntent): Promise<{ project: ProjectRecord; previousSlug: string }> {
  await assertSlugAvailable(input.slug, input.id);
  return db.transaction(async (tx) => {
    const [current] = await tx.select().from(projects).where(eq(projects.id, input.id)).limit(1);
    if (!current) throw new Error("Project not found.");
    if (input.technologyIds.length) { const existing = await tx.select({ id: technologies.id }).from(technologies).where(inArray(technologies.id, input.technologyIds)); if (existing.length !== input.technologyIds.length) throw new Error("One or more selected technologies no longer exist."); }
    const nextStatus = intent === "save" ? projectPublicationStatusSchema.parse(current.status) : intent === "publish" ? "published" : intent === "archive" ? "archived" : intent;
    const publishedAt = nextStatus === "published" ? current.publishedAt ?? new Date() : nextStatus === "draft" ? null : current.publishedAt;
    let updated: typeof projects.$inferSelect | undefined;
    try { [updated] = await tx.update(projects).set({ title: input.title, slug: input.slug, summary: input.summary, contentMarkdown: input.contentMarkdown, draftMarkdown: null, coverImageUrl: input.coverImageUrl, githubUrl: input.githubUrl, demoUrl: input.demoUrl, externalUrl: input.externalUrl, isFeatured: input.isFeatured, projectStatus: input.projectStatus, startedOn: input.startedOn, endedOn: input.endedOn, status: nextStatus, publishedAt, seoTitle: input.seoTitle, seoDescription: input.seoDescription, canonicalUrl: input.canonicalUrl, ogImageUrl: input.ogImageUrl, updatedAt: new Date() }).where(eq(projects.id, input.id)).returning(); } catch (error) { if (isUniqueViolation(error)) throw new ProjectSlugConflictError(); throw error; }
    if (!updated) throw new Error("Project update did not return a project.");
    await tx.delete(projectTechnologies).where(eq(projectTechnologies.projectId, input.id));
    if (input.technologyIds.length) await tx.insert(projectTechnologies).values(input.technologyIds.map((technologyId, sortOrder) => ({ projectId: input.id, technologyId, sortOrder })));
    return { project: { ...updated, projectStatus: projectStatusSchema.parse(updated.projectStatus), status: projectPublicationStatusSchema.parse(updated.status), technologies: [] }, previousSlug: current.slug };
  });
}

export async function autosaveProject(id: string, contentMarkdown: string): Promise<Date> { const savedAt = new Date(); const [updated] = await db.update(projects).set({ draftMarkdown: contentMarkdown, updatedAt: savedAt }).where(eq(projects.id, id)).returning({ id: projects.id }); if (!updated) throw new Error("Project not found."); return savedAt; }
export async function deleteProject(id: string): Promise<string | null> { const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning({ slug: projects.slug }); return deleted?.slug ?? null; }
export async function createTechnology(input: { name: string; slug: string }) { try { await db.insert(technologies).values(input); } catch (error) { if (isUniqueViolation(error)) throw new TechnologyConflictError(); throw error; } }
export async function updateTechnology(input: { id: string; name: string; slug: string }) { try { const [updated] = await db.update(technologies).set({ name: input.name, slug: input.slug, updatedAt: new Date() }).where(eq(technologies.id, input.id)).returning({ id: technologies.id }); if (!updated) throw new Error("Technology not found."); } catch (error) { if (isUniqueViolation(error)) throw new TechnologyConflictError(); throw error; } }
export async function deleteTechnology(id: string) { await db.delete(technologies).where(eq(technologies.id, id)); }
