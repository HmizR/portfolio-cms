import { z } from "zod";

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

export const postIdSchema = z.string().uuid("Invalid post identifier.");
export const tagIdSchema = z.string().uuid("Invalid tag identifier.");

export const postSlugSchema = z
  .string()
  .trim()
  .min(1, "Enter a slug.")
  .max(120, "Slug must be 120 characters or fewer.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.");

export const tagSlugSchema = z
  .string()
  .trim()
  .min(1, "Enter a tag slug.")
  .max(80, "Tag slug must be 80 characters or fewer.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.");

export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Enter a post title.").max(200),
  slug: z.string().trim().max(120),
});

export const postFormSchema = z.object({
  id: postIdSchema,
  title: z.string().trim().min(1, "Enter a post title.").max(200),
  slug: postSlugSchema,
  excerpt: z.string().trim().max(500, "Excerpt must be 500 characters or fewer."),
  contentMarkdown: z.string().max(200_000, "Markdown must be 200,000 characters or fewer."),
  coverImageUrl: optionalHttpUrl("Cover image URL"),
  tagIds: z.array(tagIdSchema).max(50).refine((ids) => new Set(ids).size === ids.length, "Choose each tag only once."),
  seoTitle: optionalText(100),
  seoDescription: optionalText(300),
  canonicalUrl: optionalHttpUrl("Canonical URL"),
  ogImageUrl: optionalHttpUrl("Open Graph image URL"),
});

export const postIntentSchema = z.enum(["save", "draft", "publish", "archive"]);
export const postStatusSchema = z.enum(["draft", "published", "archived"]);

export const autosavePostSchema = z.object({
  id: postIdSchema,
  contentMarkdown: z.string().max(200_000),
});

export const tagFormSchema = z.object({
  id: tagIdSchema.optional(),
  name: z.string().trim().min(1, "Enter a tag name.").max(80),
  slug: z.string().trim().max(80),
});

export type PostFormInput = z.infer<typeof postFormSchema>;
export type PostIntent = z.infer<typeof postIntentSchema>;
export type PostStatus = z.infer<typeof postStatusSchema>;

export interface PostActionState {
  status?: "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  savedPost?: PostFormInput;
  savedStatus?: PostStatus;
}

export interface CreatePostActionState {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: { title: string; slug: string };
}

export interface TagActionState {
  status?: "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: { name: string; slug: string };
}
