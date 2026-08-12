import { z } from "zod";

import { optionalMediaIdSchema } from "@/features/media/validation";

export const seoSettingsSchema = z.object({
  defaultOgMediaId: optionalMediaIdSchema,
  twitterHandle: z.string().trim().max(16, "Handle must be 15 characters or fewer.").refine(
    (value) => value === "" || /^@?[A-Za-z0-9_]{1,15}$/.test(value),
    "Enter a valid X/Twitter handle.",
  ).transform((value) => value ? `@${value.replace(/^@/, "")}` : null),
});

export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;

export interface SeoSettingsActionState {
  status?: "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
