import "server-only";

import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { navigationItems, pages } from "@/db/schema";
import {
  resolveNavigationHref,
  type PublicNavigationItem,
} from "@/features/navigation/destination";
import {
  navigationTypeSchema,
  type NavigationType,
} from "@/features/navigation/validation";
import { pageStatusSchema, type PageStatus } from "@/features/pages/validation";

export const PUBLIC_NAVIGATION_CACHE_TAG = "public-navigation";

export interface NavigationEditorItem {
  id: string;
  isVisible: boolean;
  label: string;
  openNewTab: boolean;
  pageId: string | null;
  pageStatus: PageStatus | null;
  pageTitle: string | null;
  sortOrder: number;
  type: NavigationType;
  url: string | null;
}

export interface NavigationPageOption {
  id: string;
  slug: string;
  status: PageStatus;
  title: string;
}

const navigationSelection = {
  id: navigationItems.id,
  label: navigationItems.label,
  type: navigationItems.type,
  pageId: navigationItems.pageId,
  url: navigationItems.url,
  sortOrder: navigationItems.sortOrder,
  isVisible: navigationItems.isVisible,
  openNewTab: navigationItems.openNewTab,
  pageTitle: pages.title,
  pageSlug: pages.slug,
  pageStatus: pages.status,
};

function navigationType(value: string): NavigationType {
  return navigationTypeSchema.parse(value);
}

export async function listNavigationEditorItems(): Promise<NavigationEditorItem[]> {
  const rows = await db
    .select(navigationSelection)
    .from(navigationItems)
    .leftJoin(pages, eq(navigationItems.pageId, pages.id))
    .orderBy(asc(navigationItems.sortOrder), asc(navigationItems.createdAt));

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    type: navigationType(row.type),
    pageId: row.pageId,
    url: row.url,
    sortOrder: row.sortOrder,
    isVisible: row.isVisible,
    openNewTab: row.openNewTab,
    pageTitle: row.pageTitle,
    pageStatus: row.pageStatus ? pageStatusSchema.parse(row.pageStatus) : null,
  }));
}

export async function listNavigationPageOptions(): Promise<NavigationPageOption[]> {
  const rows = await db
    .select({ id: pages.id, slug: pages.slug, status: pages.status, title: pages.title })
    .from(pages)
    .orderBy(asc(pages.title));
  return rows.map((row) => ({ ...row, status: pageStatusSchema.parse(row.status) }));
}

const getCachedPublicNavigation = unstable_cache(async (): Promise<PublicNavigationItem[]> => {
  const rows = await db
    .select(navigationSelection)
    .from(navigationItems)
    .leftJoin(pages, eq(navigationItems.pageId, pages.id))
    .where(eq(navigationItems.isVisible, true))
    .orderBy(asc(navigationItems.sortOrder), asc(navigationItems.createdAt));

  return rows.flatMap((row) => {
    const href = resolveNavigationHref({
      type: navigationType(row.type),
      pageSlug: row.pageSlug,
      pageStatus: row.pageStatus,
      url: row.url,
    });
    return href
      ? [{ id: row.id, label: row.label, href, openNewTab: row.openNewTab }]
      : [];
  });
}, [PUBLIC_NAVIGATION_CACHE_TAG], { tags: [PUBLIC_NAVIGATION_CACHE_TAG] });

export const getPublicNavigation = cache(async (): Promise<PublicNavigationItem[]> => {
  await connection();
  return getCachedPublicNavigation();
});
