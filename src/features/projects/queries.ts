import "server-only";

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { projects, projectTechnologies, technologies } from "@/db/schema";
import { projectPublicationStatusSchema, projectStatusSchema, type ProjectLifecycleStatus, type ProjectPublicationStatus } from "@/features/projects/validation";

export const PUBLIC_PROJECTS_CACHE_TAG = "public-projects";
export interface ProjectTechnologyRecord { id: string; name: string; slug: string; sortOrder: number }
export interface ProjectRecord extends Omit<typeof projects.$inferSelect, "projectStatus" | "status"> { projectStatus: ProjectLifecycleStatus; status: ProjectPublicationStatus; technologies: ProjectTechnologyRecord[] }
export type TechnologyRecord = typeof technologies.$inferSelect & { projectCount: number };
type CachedProjectRecord = Omit<ProjectRecord, "createdAt" | "publishedAt" | "updatedAt"> & { createdAt: Date | string; publishedAt: Date | string | null; updatedAt: Date | string };

function projectFromRow(row: typeof projects.$inferSelect, assigned: ProjectTechnologyRecord[] = []): ProjectRecord {
  return { ...row, projectStatus: projectStatusSchema.parse(row.projectStatus), status: projectPublicationStatusSchema.parse(row.status), technologies: assigned };
}

async function technologiesByProjectIds(ids: string[]): Promise<Map<string, ProjectTechnologyRecord[]>> {
  if (!ids.length) return new Map();
  const rows = await db.select({ projectId: projectTechnologies.projectId, id: technologies.id, name: technologies.name, slug: technologies.slug, sortOrder: projectTechnologies.sortOrder }).from(projectTechnologies).innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id)).where(inArray(projectTechnologies.projectId, ids)).orderBy(asc(projectTechnologies.sortOrder), asc(technologies.name));
  const result = new Map<string, ProjectTechnologyRecord[]>();
  for (const row of rows) result.set(row.projectId, [...(result.get(row.projectId) ?? []), { id: row.id, name: row.name, slug: row.slug, sortOrder: row.sortOrder }]);
  return result;
}

export async function listProjects(): Promise<ProjectRecord[]> {
  const rows = await db.select().from(projects).orderBy(desc(projects.updatedAt));
  const assigned = await technologiesByProjectIds(rows.map((row) => row.id));
  return rows.map((row) => projectFromRow(row, assigned.get(row.id)));
}

export const getProjectById = cache(async (id: string): Promise<ProjectRecord | null> => {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!row) return null;
  const assigned = await technologiesByProjectIds([id]);
  return projectFromRow(row, assigned.get(id));
});

export async function listTechnologies(): Promise<TechnologyRecord[]> {
  return db.select({ id: technologies.id, name: technologies.name, slug: technologies.slug, createdAt: technologies.createdAt, updatedAt: technologies.updatedAt, projectCount: sql<number>`count(${projectTechnologies.projectId})::int` }).from(technologies).leftJoin(projectTechnologies, eq(technologies.id, projectTechnologies.technologyId)).groupBy(technologies.id).orderBy(asc(technologies.name));
}

const getCachedPublishedProjects = unstable_cache(async (): Promise<CachedProjectRecord[]> => {
  const rows = await db.select().from(projects).where(eq(projects.status, "published")).orderBy(desc(projects.isFeatured), desc(projects.startedOn), desc(projects.publishedAt), desc(projects.createdAt));
  const assigned = await technologiesByProjectIds(rows.map((row) => row.id));
  return rows.map((row) => projectFromRow(row, assigned.get(row.id)));
}, [PUBLIC_PROJECTS_CACHE_TAG], { tags: [PUBLIC_PROJECTS_CACHE_TAG] });

function normalizeCachedProject(project: CachedProjectRecord): ProjectRecord {
  return { ...project, createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt), publishedAt: project.publishedAt ? project.publishedAt instanceof Date ? project.publishedAt : new Date(project.publishedAt) : null, updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt) };
}

export const listPublishedProjects = cache(async (): Promise<ProjectRecord[]> => { await connection(); return (await getCachedPublishedProjects()).map(normalizeCachedProject); });
const getCachedPublishedProjectBySlug = unstable_cache(async (slug: string): Promise<CachedProjectRecord | null> => {
  const [row] = await db.select().from(projects).where(and(eq(projects.slug, slug), eq(projects.status, "published"))).limit(1);
  if (!row) return null;
  const assigned = await technologiesByProjectIds([row.id]);
  return projectFromRow(row, assigned.get(row.id));
}, [PUBLIC_PROJECTS_CACHE_TAG], { tags: [PUBLIC_PROJECTS_CACHE_TAG] });
export const getPublishedProjectBySlug = cache(async (slug: string): Promise<ProjectRecord | null> => { await connection(); const project = await getCachedPublishedProjectBySlug(slug); return project ? normalizeCachedProject(project) : null; });
