import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { skills } from "@/db/schema";
export type SkillRecord = typeof skills.$inferSelect;
export async function listSkills(): Promise<SkillRecord[]> { return db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.name)); }
