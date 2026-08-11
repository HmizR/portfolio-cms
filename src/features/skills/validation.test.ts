import { describe, expect, it } from "vitest";
import { skillFormSchema } from "@/features/skills/validation";
describe("skill validation", () => { it("trims categorized visible skills", () => expect(skillFormSchema.parse({ name: " TypeScript ", category: " Languages ", isVisible: true })).toEqual({ name: "TypeScript", category: "Languages", isVisible: true })); it("requires both name and category", () => expect(skillFormSchema.safeParse({ name: "", category: "", isVisible: true }).success).toBe(false)); });
