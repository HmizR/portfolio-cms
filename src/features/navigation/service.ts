import "server-only";

import { asc, eq, max } from "drizzle-orm";

import { db } from "@/db";
import { navigationItems, pages } from "@/db/schema";
import type { NavigationItemInput } from "@/features/navigation/validation";

export class NavigationPageNotFoundError extends Error {
  constructor() {
    super("The selected page no longer exists.");
    this.name = "NavigationPageNotFoundError";
  }
}

export class NavigationOrderConflictError extends Error {
  constructor() {
    super("Navigation changed while it was being reordered. Refresh and try again.");
    this.name = "NavigationOrderConflictError";
  }
}

async function assertPageExists(pageId: string | null): Promise<void> {
  if (!pageId) return;
  const [page] = await db.select({ id: pages.id }).from(pages).where(eq(pages.id, pageId)).limit(1);
  if (!page) throw new NavigationPageNotFoundError();
}

export async function createNavigationItem(input: NavigationItemInput): Promise<void> {
  await assertPageExists(input.pageId);
  await db.transaction(async (transaction) => {
    const [last] = await transaction
      .select({ sortOrder: max(navigationItems.sortOrder) })
      .from(navigationItems);
    await transaction.insert(navigationItems).values({
      ...input,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    });
  });
}

export async function updateNavigationItem(
  id: string,
  input: NavigationItemInput,
): Promise<boolean> {
  await assertPageExists(input.pageId);
  const [updated] = await db
    .update(navigationItems)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(navigationItems.id, id))
    .returning({ id: navigationItems.id });
  return Boolean(updated);
}

export async function deleteNavigationItem(id: string): Promise<boolean> {
  return db.transaction(async (transaction) => {
    const [deleted] = await transaction
      .delete(navigationItems)
      .where(eq(navigationItems.id, id))
      .returning({ id: navigationItems.id });
    if (!deleted) return false;

    const remaining = await transaction
      .select({ id: navigationItems.id })
      .from(navigationItems)
      .orderBy(asc(navigationItems.sortOrder), asc(navigationItems.createdAt));
    for (const [sortOrder, item] of remaining.entries()) {
      await transaction
        .update(navigationItems)
        .set({ sortOrder, updatedAt: new Date() })
        .where(eq(navigationItems.id, item.id));
    }
    return true;
  });
}

export async function reorderNavigationItems(ids: string[]): Promise<void> {
  await db.transaction(async (transaction) => {
    const current = await transaction.select({ id: navigationItems.id }).from(navigationItems);
    const expected = new Set(current.map((item) => item.id));
    if (ids.length !== expected.size || ids.some((id) => !expected.has(id))) {
      throw new NavigationOrderConflictError();
    }

    for (const [sortOrder, id] of ids.entries()) {
      await transaction
        .update(navigationItems)
        .set({ sortOrder, updatedAt: new Date() })
        .where(eq(navigationItems.id, id));
    }
  });
}
