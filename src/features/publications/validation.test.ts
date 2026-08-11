import { describe, expect, it } from "vitest";

import { publicationFormSchema } from "@/features/publications/validation";

const base = { id: "6d988f35-b3f5-45b5-a2a2-89be25d37b39", title: "A Study", slug: "a-study", abstract: "", contentMarkdown: "", publicationType: "journal", venue: "", publisher: "", publicationDate: "2026-08-11", doi: "https://doi.org/10.1000/example", externalUrl: "", pdfMediaId: "", authors: [{ name: "Ada Lovelace", profileUrl: "", isOwner: true }, { name: "Grace Hopper", profileUrl: null, isOwner: false }], isFeatured: false, seoTitle: "", seoDescription: "", canonicalUrl: "", ogMediaId: "", ogImageUrl: "" };

describe("publication validation", () => {
  it("normalizes optional fields and DOI URLs", () => {
    const parsed = publicationFormSchema.parse(base);
    expect(parsed.doi).toBe("10.1000/example");
    expect(parsed.venue).toBeNull();
    expect(parsed.pdfMediaId).toBeNull();
    expect(parsed.authors[1]?.profileUrl).toBeNull();
  });

  it("rejects unsafe URLs, invalid dates, duplicate-hyphen slugs, and malformed DOIs", () => {
    expect(publicationFormSchema.safeParse({ ...base, externalUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(publicationFormSchema.safeParse({ ...base, publicationDate: "2026-02-30" }).success).toBe(false);
    expect(publicationFormSchema.safeParse({ ...base, slug: "a--study" }).success).toBe(false);
    expect(publicationFormSchema.safeParse({ ...base, doi: "not-a-doi" }).success).toBe(false);
  });
});
