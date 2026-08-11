import { describe, expect, it } from "vitest";

import { pageFormSchema } from "@/features/pages/validation";

const validPage = {
  id: "7fe4e8dd-8f22-4b9f-b19a-7cd4529f8d70",
  title: "Research statement",
  slug: "research-statement",
  excerpt: "A short introduction.",
  contentMarkdown: "# Research",
  showTitle: true,
  showSidebar: true,
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  ogMediaId: "",
  ogImageUrl: "",
};

describe("page validation", () => {
  it("normalizes optional metadata fields", () => {
    const result = pageFormSchema.parse(validPage);
    expect(result.seoTitle).toBeNull();
    expect(result.canonicalUrl).toBeNull();
  });

  it("rejects unsafe metadata URLs", () => {
    expect(pageFormSchema.safeParse({ ...validPage, canonicalUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(pageFormSchema.safeParse({ ...validPage, ogImageUrl: "file:///portrait.png" }).success).toBe(false);
  });
});
