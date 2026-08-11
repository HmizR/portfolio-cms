import { describe, expect, it } from "vitest";

import type { PostRecord } from "@/features/posts/queries";
import { generateRssFeed } from "@/features/posts/rss";

const publishedAt = new Date("2026-08-10T04:00:00.000Z");
const post: PostRecord = {
  id: "7fe4e8dd-8f22-4b9f-b19a-7cd4529f8d70",
  title: "People & <AI>",
  slug: "people-ai",
  excerpt: "Research & practice",
  contentMarkdown: "# Post",
  draftMarkdown: null,
  coverMediaId: null,
  coverImageUrl: null,
  status: "published",
  publishedAt,
  seoTitle: null,
  seoDescription: null,
  canonicalUrl: null,
  ogMediaId: null,
  ogImageUrl: null,
  createdAt: publishedAt,
  updatedAt: publishedAt,
  tags: [{ id: "a2d29907-b2d3-4c10-b534-530ee6cd71fb", name: "HCI & AI", slug: "hci-ai" }],
};

describe("RSS generation", () => {
  it("emits published post metadata with escaped XML and absolute URLs", () => {
    const xml = generateRssFeed({ baseUrl: "https://portfolio.example/", description: "Notes & essays", posts: [post], title: "Maya <Research>" });
    expect(xml).toContain("<title>Maya &lt;Research&gt;</title>");
    expect(xml).toContain("https://portfolio.example/posts/people-ai");
    expect(xml).toContain("People &amp; &lt;AI&gt;");
    expect(xml).toContain("<category>HCI &amp; AI</category>");
    expect(xml).toContain(publishedAt.toUTCString());
  });
});
