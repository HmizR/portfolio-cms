import { z } from "zod";

export const cvSectionTypes = ["profile", "education", "experience", "projects", "publications", "skills"] as const;
export const cvSectionTypeSchema = z.enum(cvSectionTypes);
export const cvSectionInputSchema = z.object({ sectionType: cvSectionTypeSchema, isVisible: z.boolean() });
export const cvConfigurationSchema = z.object({
  sections: z.array(cvSectionInputSchema).length(cvSectionTypes.length),
  projectIds: z.array(z.uuid("Invalid project identifier.")).max(50),
}).superRefine((value, context) => {
  const types = value.sections.map((section) => section.sectionType);
  if (new Set(types).size !== cvSectionTypes.length || cvSectionTypes.some((type) => !types.includes(type))) context.addIssue({ code: "custom", path: ["sections"], message: "Include every CV section exactly once." });
  if (new Set(value.projectIds).size !== value.projectIds.length) context.addIssue({ code: "custom", path: ["projectIds"], message: "Choose each project only once." });
});
export type CvConfigurationInput = z.infer<typeof cvConfigurationSchema>;
export type CvSectionType = z.infer<typeof cvSectionTypeSchema>;
export interface CvActionState { status?: "error" | "success"; message?: string }
