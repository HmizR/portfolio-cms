import "server-only";
import { asc, eq, max } from "drizzle-orm";
import { db } from "@/db";
import { skills } from "@/db/schema";
import type { SkillInput } from "@/features/skills/validation";
export class SkillConflictError extends Error { constructor() { super("This category already contains that skill."); this.name = "SkillConflictError"; } }
function unique(error: unknown) { let current: unknown = error; for (let depth = 0; depth < 3; depth += 1) { if (!current || typeof current !== "object") return false; if ("code" in current && current.code === "23505") return true; current = "cause" in current ? current.cause : null; } return false; }
export async function saveSkill(input: SkillInput) { const { id, ...values } = input; try { if (id) { const [row] = await db.update(skills).set({ ...values, updatedAt: new Date() }).where(eq(skills.id, id)).returning({ id: skills.id }); if (!row) throw new Error("Skill not found."); return; } const [maximum] = await db.select({ value: max(skills.sortOrder) }).from(skills); await db.insert(skills).values({ ...values, sortOrder: (maximum?.value ?? -1) + 1 }); } catch (error) { if (unique(error)) throw new SkillConflictError(); throw error; } }
export async function deleteSkill(id: string) { await db.delete(skills).where(eq(skills.id, id)); }
export async function moveSkill(id: string, direction: "up" | "down") { await db.transaction(async (tx) => { const rows = await tx.select({ id: skills.id }).from(skills).orderBy(asc(skills.sortOrder)); const index = rows.findIndex((row) => row.id === id); const target = direction === "up" ? index - 1 : index + 1; if (index < 0 || target < 0 || target >= rows.length) return; for (const [sortOrder, row] of rows.entries()) { const next = sortOrder === index ? target : sortOrder === target ? index : sortOrder; if (next !== sortOrder) await tx.update(skills).set({ sortOrder: next, updatedAt: new Date() }).where(eq(skills.id, row.id)); } }); }
