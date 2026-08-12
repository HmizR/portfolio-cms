import "server-only";
import { asc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { cache } from "react";
import { db } from "@/db";
import { cvProjectSelections, cvSections, projects } from "@/db/schema";
import { cvSectionTypeSchema, type CvSectionType } from "@/features/cv/validation";

export interface CvSectionRecord { id: string; sectionType: CvSectionType; sortOrder: number; isVisible: boolean }
export interface CvProjectOption { id: string; title: string; summary: string }
function sectionFromRow(row: typeof cvSections.$inferSelect): CvSectionRecord { return { id: row.id, sectionType: cvSectionTypeSchema.parse(row.sectionType), sortOrder: row.sortOrder, isVisible: row.isVisible }; }
export async function getCvEditorData(): Promise<{ sections: CvSectionRecord[]; projectIds: string[]; projects: CvProjectOption[] }> {
  const [sectionRows, projectRows] = await Promise.all([db.select().from(cvSections).orderBy(asc(cvSections.sortOrder)), db.select({ id: projects.id, title: projects.title, summary: projects.summary }).from(projects).where(eq(projects.status, "published")).orderBy(asc(projects.title))]);
  const sections = sectionRows.map(sectionFromRow); const projectSection = sections.find((section) => section.sectionType === "projects");
  const selections = projectSection ? await db.select({ projectId: cvProjectSelections.projectId }).from(cvProjectSelections).where(eq(cvProjectSelections.cvSectionId, projectSection.id)).orderBy(asc(cvProjectSelections.sortOrder)) : [];
  const available = new Set(projectRows.map((project) => project.id));
  return { sections, projectIds: selections.map((selection) => selection.projectId).filter((id) => available.has(id)), projects: projectRows };
}
export const getPublicCvConfiguration = cache(async (): Promise<{ sections: CvSectionRecord[]; projectIds: string[] }> => {
  await connection(); const rows = await db.select().from(cvSections).where(eq(cvSections.isVisible, true)).orderBy(asc(cvSections.sortOrder)); const sections = rows.map(sectionFromRow); const projectSection = sections.find((section) => section.sectionType === "projects");
  if (!projectSection) return { sections, projectIds: [] };
  const selections = await db.select({ projectId: cvProjectSelections.projectId }).from(cvProjectSelections).where(eq(cvProjectSelections.cvSectionId, projectSection.id)).orderBy(asc(cvProjectSelections.sortOrder));
  return { sections, projectIds: selections.map((selection) => selection.projectId) };
});
