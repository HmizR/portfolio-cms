import "server-only";

import { count } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function hasAdminUser(): Promise<boolean> {
  const [result] = await db.select({ count: count() }).from(users);
  return (result?.count ?? 0) > 0;
}
