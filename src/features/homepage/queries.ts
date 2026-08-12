import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { homepageSections, pages } from "@/db/schema";
import { listEducation, type EducationRecord } from "@/features/education/queries";
import { listExperience, type ExperienceRecord } from "@/features/experience/queries";
import { homepageSectionSchema, type HomepageSectionInput } from "@/features/homepage/validation";
import { pageStatusSchema } from "@/features/pages/validation";
import type { PageRecord } from "@/features/pages/queries";
import { listPublishedPosts, type PostRecord } from "@/features/posts/queries";
import { listPublishedProjects, type ProjectRecord } from "@/features/projects/queries";
import { listPublishedPublications, type PublicationRecord } from "@/features/publications/queries";

export const PUBLIC_HOMEPAGE_CACHE_TAG = "public-homepage";
export interface HomepagePageOption { id: string; title: string; excerpt: string }
export interface PublicHomepageData {
  education: EducationRecord[];
  experience: ExperienceRecord[];
  pages: Map<string, PageRecord>;
  posts: PostRecord[];
  projects: ProjectRecord[];
  publications: PublicationRecord[];
  sections: HomepageSectionInput[];
}

function sectionFromRow(row: typeof homepageSections.$inferSelect): HomepageSectionInput {
  const configuration = row.sectionType === "page_excerpt"
    ? { ...(typeof row.configurationJson === "object" && row.configurationJson ? row.configurationJson : {}), pageId: row.pageId }
    : row.configurationJson;
  return homepageSectionSchema.parse({ sectionType: row.sectionType, isVisible: row.isVisible, configuration });
}

export async function getHomepageEditorData(): Promise<{ sections: HomepageSectionInput[]; pages: HomepagePageOption[] }> {
  const [rows, pageRows] = await Promise.all([
    db.select().from(homepageSections).orderBy(asc(homepageSections.sortOrder)),
    db.select({ id: pages.id, title: pages.title, excerpt: pages.excerpt }).from(pages).where(eq(pages.status, "published")).orderBy(asc(pages.title)),
  ]);
  return { sections: rows.map(sectionFromRow), pages: pageRows };
}

const getCachedPublicSections = unstable_cache(async () => {
  const rows = await db.select().from(homepageSections).where(eq(homepageSections.isVisible, true)).orderBy(asc(homepageSections.sortOrder));
  return rows.map(sectionFromRow);
}, [PUBLIC_HOMEPAGE_CACHE_TAG], { tags: [PUBLIC_HOMEPAGE_CACHE_TAG] });

export const getPublicHomepageData = cache(async (): Promise<PublicHomepageData> => {
  await connection();
  const sections = await getCachedPublicSections();
  const pageIds = sections.flatMap((section) => section.sectionType === "page_excerpt" && section.configuration.pageId ? [section.configuration.pageId] : []);
  const [education, experience, pageRows, posts, projects, publications] = await Promise.all([
    listEducation(),
    listExperience(),
    pageIds.length ? db.select().from(pages).where(and(inArray(pages.id, pageIds), eq(pages.status, "published"))) : Promise.resolve([]),
    listPublishedPosts(),
    listPublishedProjects(),
    listPublishedPublications(),
  ]);
  return {
    education,
    experience,
    pages: new Map(pageRows.map((row) => [row.id, { ...row, status: pageStatusSchema.parse(row.status) } satisfies PageRecord])),
    posts,
    projects,
    publications,
    sections,
  };
});
