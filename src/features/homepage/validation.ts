import { z } from "zod";

export const homepageSectionTypes = ["markdown", "featured_projects", "recent_posts", "featured_publications", "education", "experience", "page_excerpt"] as const;
export const homepageSectionTypeSchema = z.enum(homepageSectionTypes);

const headingSchema = z.string().trim().min(1, "Enter a section heading.").max(100);
const itemCountSchema = z.number().int().min(1).max(12);
export const homepageMarkdownSchema = z.string().max(50_000);
const common = { isVisible: z.boolean() };

export const homepageSectionSchema = z.discriminatedUnion("sectionType", [
  z.object({ ...common, sectionType: z.literal("markdown"), configuration: z.object({ heading: headingSchema, markdown: homepageMarkdownSchema }) }),
  z.object({ ...common, sectionType: z.literal("featured_projects"), configuration: z.object({ heading: headingSchema, itemCount: itemCountSchema }) }),
  z.object({ ...common, sectionType: z.literal("recent_posts"), configuration: z.object({ heading: headingSchema, itemCount: itemCountSchema }) }),
  z.object({ ...common, sectionType: z.literal("featured_publications"), configuration: z.object({ heading: headingSchema, itemCount: itemCountSchema }) }),
  z.object({ ...common, sectionType: z.literal("education"), configuration: z.object({ heading: headingSchema, itemCount: itemCountSchema }) }),
  z.object({ ...common, sectionType: z.literal("experience"), configuration: z.object({ heading: headingSchema, itemCount: itemCountSchema }) }),
  z.object({ ...common, sectionType: z.literal("page_excerpt"), configuration: z.object({ heading: headingSchema, pageId: z.uuid("Choose a valid page.").nullable() }) }),
]);

export const homepageConfigurationSchema = z.object({
  sections: z.array(homepageSectionSchema).length(homepageSectionTypes.length),
}).superRefine((value, context) => {
  const types = value.sections.map((section) => section.sectionType);
  if (new Set(types).size !== homepageSectionTypes.length || homepageSectionTypes.some((type) => !types.includes(type))) {
    context.addIssue({ code: "custom", path: ["sections"], message: "Include every homepage section exactly once." });
  }
  const pageExcerpt = value.sections.find((section) => section.sectionType === "page_excerpt");
  if (pageExcerpt?.isVisible && !pageExcerpt.configuration.pageId) context.addIssue({ code: "custom", path: ["sections"], message: "Choose a published page before showing the page excerpt section." });
});

export type HomepageConfigurationInput = z.infer<typeof homepageConfigurationSchema>;
export type HomepageSectionInput = z.infer<typeof homepageSectionSchema>;
export type HomepageSectionType = z.infer<typeof homepageSectionTypeSchema>;
export interface HomepageActionState { status?: "error" | "success"; message?: string }
