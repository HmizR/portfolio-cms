import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { education } from "@/db/schema";
export type EducationRecord = typeof education.$inferSelect;
export async function listEducation(): Promise<EducationRecord[]> { return db.select().from(education).orderBy(asc(education.sortOrder), asc(education.createdAt)); }
