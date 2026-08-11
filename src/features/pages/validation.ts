import { z } from "zod";

import { isReservedPageSlug } from "@/features/pages/slug";
import { optionalMediaIdSchema } from "@/features/media/validation";

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).transform((value) => value || null);

const optionalHttpUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(2048)
    .refine((value) => {
      if (value === "") return true;
      try {
        return ["http:", "https:"].includes(new URL(value).protocol);
      } catch {
        return false;
      }
    }, `${label} must be an absolute HTTP(S) URL.`)
    .transform((value) => value || null);

export const pageIdSchema = z.string().uuid("Invalid page identifier.");

export const pageSlugSchema = z
  .string()
  .trim()
  .min(1, "Enter a slug.")
  .max(120, "Slug must be 120 characters or fewer.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.")
  .refine((slug) => !isReservedPageSlug(slug), "This slug is reserved by PortfolioCMS.");

export const createPageSchema = z.object({
  title: z.string().trim().min(1, "Enter a page title.").max(200),
  slug: z.string().trim().max(120),
});

export const pageFormSchema = z.object({
  id: pageIdSchema,
  title: z.string().trim().min(1, "Enter a page title.").max(200),
  slug: pageSlugSchema,
  excerpt: z.string().trim().max(500, "Excerpt must be 500 characters or fewer."),
  contentMarkdown: z.string().max(200_000, "Markdown must be 200,000 characters or fewer."),
  showTitle: z.boolean(),
  showSidebar: z.boolean(),
  seoTitle: optionalText(100),
  seoDescription: optionalText(300),
  canonicalUrl: optionalHttpUrl("Canonical URL"),
  ogMediaId: optionalMediaIdSchema,
  ogImageUrl: optionalHttpUrl("Open Graph image URL"),
});

export const pageIntentSchema = z.enum(["save", "draft", "publish", "archive"]);
export const pageStatusSchema = z.enum(["draft", "published", "archived"]);

export const autosavePageSchema = z.object({
  id: pageIdSchema,
  contentMarkdown: z.string().max(200_000),
});

export type PageFormInput = z.infer<typeof pageFormSchema>;
export type PageIntent = z.infer<typeof pageIntentSchema>;
export type PageStatus = z.infer<typeof pageStatusSchema>;

export interface PageActionState {
  status?: "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  savedPage?: PageFormInput;
  savedStatus?: PageStatus;
}

export interface CreatePageActionState {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: { title: string; slug: string };
}
