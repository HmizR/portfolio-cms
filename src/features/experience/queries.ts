import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { experience } from "@/db/schema";
export type ExperienceRecord = typeof experience.$inferSelect;
export async function listExperience(): Promise<ExperienceRecord[]> { return db.select().from(experience).orderBy(asc(experience.sortOrder), asc(experience.createdAt)); }
