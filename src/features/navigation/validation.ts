import { z } from "zod";

export const navigationTypeSchema = z.enum([
  "page",
  "posts",
  "projects",
  "publications",
  "cv",
  "external",
]);

export const navigationIdSchema = z.string().uuid("Invalid navigation item identifier.");

export const navigationItemSchema = z
  .object({
    label: z.string().trim().min(1, "Enter a navigation label.").max(80),
    type: navigationTypeSchema,
    pageId: z.string().uuid("Choose a valid page.").nullable(),
    url: z.string().trim().max(2048).nullable(),
    isVisible: z.boolean(),
    openNewTab: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.type === "page") {
      if (!value.pageId) {
        context.addIssue({ code: "custom", path: ["pageId"], message: "Choose a page." });
      }
      if (value.url) {
        context.addIssue({ code: "custom", path: ["url"], message: "Page links cannot also have an external URL." });
      }
      return;
    }

    if (value.type === "external") {
      if (!value.url) {
        context.addIssue({ code: "custom", path: ["url"], message: "Enter an external URL." });
      } else {
        try {
          if (!["http:", "https:"].includes(new URL(value.url).protocol)) {
            throw new Error("Unsupported URL protocol.");
          }
        } catch {
          context.addIssue({ code: "custom", path: ["url"], message: "Enter an absolute HTTP(S) URL." });
        }
      }
      if (value.pageId) {
        context.addIssue({ code: "custom", path: ["pageId"], message: "External links cannot also target a page." });
      }
      return;
    }

    if (value.pageId || value.url) {
      context.addIssue({ code: "custom", path: ["type"], message: "System links use their built-in destination." });
    }
  });

export const updateNavigationItemSchema = navigationItemSchema.and(
  z.object({ id: navigationIdSchema }),
);

export const reorderNavigationSchema = z
  .array(navigationIdSchema)
  .max(200, "Navigation supports at most 200 items.")
  .refine((ids) => new Set(ids).size === ids.length, "Navigation order contains duplicate items.");

export type NavigationItemInput = z.infer<typeof navigationItemSchema>;
export type NavigationType = z.infer<typeof navigationTypeSchema>;

export interface NavigationActionState {
  status?: "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
