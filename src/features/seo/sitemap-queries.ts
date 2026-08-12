import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { pages } from "@/db/schema";

export async function listPublishedPages(): Promise<Array<{ slug: string; updatedAt: Date }>> {
  return db.select({ slug: pages.slug, updatedAt: pages.updatedAt }).from(pages).where(eq(pages.status, "published"));
}
