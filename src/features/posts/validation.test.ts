import { describe, expect, it } from "vitest";

import { postFormSchema, postSlugSchema, tagSlugSchema } from "@/features/posts/validation";

const validPost = {
  id: "7fe4e8dd-8f22-4b9f-b19a-7cd4529f8d70",
  title: "Research note",
  slug: "research-note",
  excerpt: "A short note.",
  contentMarkdown: "# Note",
  coverImageUrl: "",
  tagIds: ["a2d29907-b2d3-4c10-b534-530ee6cd71fb"],
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  ogImageUrl: "",
};

describe("post validation", () => {
  it("normalizes optional fields and accepts canonical slugs", () => {
    const parsed = postFormSchema.parse(validPost);
    expect(parsed.coverImageUrl).toBeNull();
    expect(parsed.seoTitle).toBeNull();
    expect(postSlugSchema.safeParse("research-note").success).toBe(true);
    expect(tagSlugSchema.safeParse("human-ai").success).toBe(true);
  });

  it("rejects unsafe URLs, duplicate tags, and malformed slugs", () => {
    expect(postFormSchema.safeParse({ ...validPost, coverImageUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(postFormSchema.safeParse({ ...validPost, tagIds: [validPost.tagIds[0], validPost.tagIds[0]] }).success).toBe(false);
    expect(postSlugSchema.safeParse("Research Note").success).toBe(false);
    expect(tagSlugSchema.safeParse("human--ai").success).toBe(false);
  });
});
