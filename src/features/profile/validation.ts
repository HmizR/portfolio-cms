import { z } from "zod";

import { optionalMediaIdSchema } from "@/features/media/validation";

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).transform((value) => value || null);

function isHttpUrl(value: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

const avatarUrlSchema = z
  .string()
  .trim()
  .max(2048, "Avatar URL must be 2,048 characters or fewer.")
  .refine(
    (value) =>
      value === "" ||
      (/^\/(?!\/)/.test(value)) ||
      isHttpUrl(value),
    "Enter an HTTP(S) URL or a site-relative path beginning with one /.",
  )
  .transform((value) => value || null);

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Enter a platform.").max(50),
  label: z.string().trim().min(1, "Enter a label.").max(80),
  url: z
    .string()
    .trim()
    .max(2048)
    .refine(isHttpUrl, "Enter a valid HTTP(S) social profile URL."),
  iconIdentifier: z.string().trim().min(1).max(50).default("link"),
  isVisible: z.boolean().default(true),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  headline: z.string().trim().max(160, "Headline must be 160 characters or fewer."),
  shortBiography: z
    .string()
    .trim()
    .max(500, "Short biography must be 500 characters or fewer."),
  longBiography: z
    .string()
    .trim()
    .max(10_000, "Long biography must be 10,000 characters or fewer."),
  location: z.string().trim().max(160, "Location must be 160 characters or fewer."),
  publicEmail: optionalText(254).pipe(z.string().email("Enter a valid email address.").nullable()),
  avatarMediaId: optionalMediaIdSchema,
  avatarUrl: avatarUrlSchema,
  socialLinks: z.array(socialLinkSchema).max(20, "Add no more than 20 social links."),
});

export const appearanceSchema = z.object({
  siteTitle: z.string().trim().min(1, "Enter a site title.").max(100),
  siteDescription: z
    .string()
    .trim()
    .max(300, "Site description must be 300 characters or fewer."),
  accentColor: z.enum(["teal", "blue", "burgundy", "violet"]),
  contentWidth: z.enum(["compact", "standard", "wide"]),
  profileImageShape: z.enum(["circle", "rounded", "square"]),
  typography: z.enum(["classic", "modern"]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type AppearanceInput = z.infer<typeof appearanceSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export interface SettingsActionState {
  status?: "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  savedAppearance?: AppearanceInput;
}
