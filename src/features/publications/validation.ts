import { z } from "zod";

import { optionalMediaIdSchema } from "@/features/media/validation";

const optionalText = (maximum: number) => z.string().trim().max(maximum).transform((value) => value || null);
const optionalDate = z.string().trim().refine((value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "Use a valid date.").transform((value) => value || null);
const optionalHttpUrl = (label: string) => z.preprocess(
  (value) => value === null || value === undefined ? "" : value,
  z.string().trim().max(2048).refine((value) => {
    if (!value) return true;
    try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
  }, `${label} must be an absolute HTTP(S) URL.`).transform((value) => value || null),
);

export const publicationIdSchema = z.uuid("Invalid publication identifier.");
export const publicationSlugSchema = z.string().trim().min(1, "Enter a slug.").max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.");
export const publicationTypeSchema = z.enum(["journal", "conference", "preprint", "thesis", "book", "chapter", "report", "other"]);
export const publicationStatusSchema = z.enum(["draft", "published", "archived"]);
export const publicationIntentSchema = z.enum(["save", "draft", "publish", "archive"]);
export const publicationAuthorSchema = z.object({
  name: z.string().trim().min(1, "Enter an author name.").max(160),
  profileUrl: optionalHttpUrl("Author profile URL"),
  isOwner: z.boolean(),
});
export const publicationAuthorsSchema = z.array(publicationAuthorSchema).max(100, "Use 100 authors or fewer.");
export const createPublicationSchema = z.object({ title: z.string().trim().min(1, "Enter a publication title.").max(300), slug: z.string().trim().max(120) });
export const publicationFormSchema = z.object({
  id: publicationIdSchema,
  title: z.string().trim().min(1, "Enter a publication title.").max(300),
  slug: publicationSlugSchema,
  abstract: z.string().trim().max(10_000),
  contentMarkdown: z.string().max(200_000),
  publicationType: publicationTypeSchema,
  venue: optionalText(300),
  publisher: optionalText(300),
  publicationDate: optionalDate,
  doi: z.string().trim().max(255).refine((value) => !value || /^10\.\d{4,9}\/\S+$/i.test(value.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")), "Enter a valid DOI such as 10.1000/example.").transform((value) => value ? value.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "") : null),
  externalUrl: optionalHttpUrl("External URL"),
  pdfMediaId: optionalMediaIdSchema,
  authors: publicationAuthorsSchema,
  isFeatured: z.boolean(),
  seoTitle: optionalText(100),
  seoDescription: optionalText(300),
  canonicalUrl: optionalHttpUrl("Canonical URL"),
  ogMediaId: optionalMediaIdSchema,
  ogImageUrl: optionalHttpUrl("Open Graph image URL"),
});
export const autosavePublicationSchema = z.object({ id: publicationIdSchema, contentMarkdown: z.string().max(200_000) });

export type PublicationFormInput = z.infer<typeof publicationFormSchema>;
export type PublicationIntent = z.infer<typeof publicationIntentSchema>;
export type PublicationStatus = z.infer<typeof publicationStatusSchema>;
export type PublicationType = z.infer<typeof publicationTypeSchema>;
export type PublicationAuthorInput = z.infer<typeof publicationAuthorSchema>;
export interface PublicationActionState { status?: "error" | "success"; message?: string; fieldErrors?: Record<string, string[] | undefined>; savedPublication?: PublicationFormInput; savedStatus?: PublicationStatus }
export interface CreatePublicationActionState { message?: string; fieldErrors?: Record<string, string[] | undefined>; values?: { title: string; slug: string } }
