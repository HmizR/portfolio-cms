import { z } from "zod";
export const skillIdSchema = z.uuid("Invalid skill identifier.");
export const skillFormSchema = z.object({ id: skillIdSchema.optional(), name: z.string().trim().min(1, "Enter a skill name.").max(120), category: z.string().trim().min(1, "Enter a category.").max(120), isVisible: z.boolean() });
export const moveSkillSchema = z.object({ id: skillIdSchema, direction: z.enum(["up", "down"]) });
export type SkillInput = z.infer<typeof skillFormSchema>;
export interface SkillActionState { status?: "error" | "success"; message?: string; fieldErrors?: Record<string, string[] | undefined> }
