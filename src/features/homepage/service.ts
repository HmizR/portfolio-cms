import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { homepageSections, pages } from "@/db/schema";
import type { HomepageConfigurationInput } from "@/features/homepage/validation";

export class HomepagePageSelectionError extends Error {}

export async function saveHomepageConfiguration(input: HomepageConfigurationInput): Promise<void> {
  const pageSection = input.sections.find((section) => section.sectionType === "page_excerpt");
  const pageId = pageSection?.configuration.pageId ?? null;
  await db.transaction(async (transaction) => {
    if (pageId) {
      const [page] = await transaction.select({ status: pages.status }).from(pages).where(eq(pages.id, pageId)).limit(1);
      if (!page) throw new HomepagePageSelectionError("The selected page no longer exists.");
      if (page.status !== "published") throw new HomepagePageSelectionError("Only a published page can appear on the homepage.");
    }
    for (const [sortOrder, section] of input.sections.entries()) {
      await transaction.update(homepageSections).set({ sortOrder: sortOrder + 100, updatedAt: new Date() }).where(eq(homepageSections.sectionType, section.sectionType));
    }
    for (const [sortOrder, section] of input.sections.entries()) {
      const configuration = section.sectionType === "page_excerpt"
        ? { heading: section.configuration.heading }
        : section.configuration;
      await transaction.update(homepageSections).set({ configurationJson: configuration, isVisible: section.isVisible, pageId: section.sectionType === "page_excerpt" ? section.configuration.pageId : null, sortOrder, updatedAt: new Date() }).where(eq(homepageSections.sectionType, section.sectionType));
    }
  });
}
