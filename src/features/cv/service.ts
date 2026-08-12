import "server-only";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { cvProjectSelections, cvSections, projects } from "@/db/schema";
import type { CvConfigurationInput } from "@/features/cv/validation";
export class CvProjectSelectionError extends Error {}
export async function saveCvConfiguration(input: CvConfigurationInput): Promise<void> {
  await db.transaction(async (tx) => {
    if (input.projectIds.length) { const selected = await tx.select({ id: projects.id, status: projects.status }).from(projects).where(inArray(projects.id, input.projectIds)); if (selected.length !== input.projectIds.length) throw new CvProjectSelectionError("One or more selected projects no longer exist."); if (selected.some((project) => project.status !== "published")) throw new CvProjectSelectionError("Only published projects can appear in the public CV."); }
    for (const [sortOrder, section] of input.sections.entries()) await tx.update(cvSections).set({ sortOrder: sortOrder + 100, updatedAt: new Date() }).where(eq(cvSections.sectionType, section.sectionType));
    for (const [sortOrder, section] of input.sections.entries()) await tx.update(cvSections).set({ sortOrder, isVisible: section.isVisible, updatedAt: new Date() }).where(eq(cvSections.sectionType, section.sectionType));
    const [projectSection] = await tx.select({ id: cvSections.id }).from(cvSections).where(eq(cvSections.sectionType, "projects")).limit(1); if (!projectSection) throw new Error("CV project section is missing.");
    await tx.delete(cvProjectSelections).where(eq(cvProjectSelections.cvSectionId, projectSection.id));
    if (input.projectIds.length) await tx.insert(cvProjectSelections).values(input.projectIds.map((projectId, sortOrder) => ({ cvSectionId: projectSection.id, projectId, sortOrder })));
  });
}
