import { z } from "zod";

const optionalText = (maximum: number) => z.string().trim().max(maximum).transform((value) => value || null);
const optionalDate = z.string().trim().refine((value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Use a valid date.").transform((value) => value || null);
const optionalHttpUrl = (label: string) => z.string().trim().max(2048).refine((value) => {
  if (!value) return true;
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}, `${label} must be an absolute HTTP(S) URL.`).transform((value) => value || null);

export const projectIdSchema = z.string().uuid("Invalid project identifier.");
export const technologyIdSchema = z.string().uuid("Invalid technology identifier.");
export const projectSlugSchema = z.string().trim().min(1, "Enter a slug.").max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.");
export const technologySlugSchema = z.string().trim().min(1, "Enter a technology slug.").max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.");
export const projectStatusSchema = z.enum(["planned", "active", "completed", "archived"]);
export const projectPublicationStatusSchema = z.enum(["draft", "published", "archived"]);
export const projectIntentSchema = z.enum(["save", "draft", "publish", "archive"]);

export const createProjectSchema = z.object({ title: z.string().trim().min(1, "Enter a project title.").max(200), slug: z.string().trim().max(120) });

export const projectFormSchema = z.object({
  id: projectIdSchema,
  title: z.string().trim().min(1, "Enter a project title.").max(200),
  slug: projectSlugSchema,
  summary: z.string().trim().max(700, "Summary must be 700 characters or fewer."),
  contentMarkdown: z.string().max(200_000, "Markdown must be 200,000 characters or fewer."),
  coverImageUrl: optionalHttpUrl("Cover image URL"),
  githubUrl: optionalHttpUrl("GitHub URL"),
  demoUrl: optionalHttpUrl("Demo URL"),
  externalUrl: optionalHttpUrl("External URL"),
  technologyIds: z.array(technologyIdSchema).max(50).refine((ids) => new Set(ids).size === ids.length, "Choose each technology only once."),
  isFeatured: z.boolean(),
  projectStatus: projectStatusSchema,
  startedOn: optionalDate,
  endedOn: optionalDate,
  seoTitle: optionalText(100),
  seoDescription: optionalText(300),
  canonicalUrl: optionalHttpUrl("Canonical URL"),
  ogImageUrl: optionalHttpUrl("Open Graph image URL"),
}).superRefine((value, context) => {
  if (value.startedOn && value.endedOn && value.endedOn < value.startedOn) context.addIssue({ code: "custom", path: ["endedOn"], message: "End date must be on or after the start date." });
});

export const autosaveProjectSchema = z.object({ id: projectIdSchema, contentMarkdown: z.string().max(200_000) });
export const technologyFormSchema = z.object({ id: technologyIdSchema.optional(), name: z.string().trim().min(1, "Enter a technology name.").max(80), slug: z.string().trim().max(80) });

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
export type ProjectIntent = z.infer<typeof projectIntentSchema>;
export type ProjectLifecycleStatus = z.infer<typeof projectStatusSchema>;
export type ProjectPublicationStatus = z.infer<typeof projectPublicationStatusSchema>;

export interface ProjectActionState { status?: "error" | "success"; message?: string; fieldErrors?: Record<string, string[] | undefined>; savedProject?: ProjectFormInput; savedStatus?: ProjectPublicationStatus }
export interface CreateProjectActionState { message?: string; fieldErrors?: Record<string, string[] | undefined>; values?: { title: string; slug: string } }
export interface TechnologyActionState { status?: "error" | "success"; message?: string; fieldErrors?: Record<string, string[] | undefined>; values?: { name: string; slug: string } }
