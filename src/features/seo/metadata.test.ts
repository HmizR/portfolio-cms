import { describe, expect, it } from "vitest";

import { absoluteUrl, buildMetadata, serializeJsonLd } from "@/features/seo/metadata";

const defaults = { baseUrl: "https://portfolio.example", defaultDescription: "Research portfolio", defaultOgImageUrl: "https://portfolio.example/media/default", siteTitle: "Ada Example", twitterHandle: "@ada" };

describe("SEO metadata", () => {
  it("builds absolute canonical and social defaults", () => {
    const metadata = buildMetadata(defaults, { canonicalPath: "/posts/testing", title: "Testing" });
    expect(metadata.alternates).toEqual({ canonical: "https://portfolio.example/posts/testing" });
    expect(metadata.openGraph).toMatchObject({ title: "Testing", siteName: "Ada Example", url: "https://portfolio.example/posts/testing" });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", creator: "@ada" });
  });

  it("honors content overrides", () => {
    const metadata = buildMetadata(defaults, { canonicalPath: "/ignored", canonicalUrl: "https://example.org/paper", description: "Specific", imageUrl: "https://example.org/image.png" });
    expect(metadata.alternates).toEqual({ canonical: "https://example.org/paper" });
    expect(metadata.description).toBe("Specific");
  });

  it("escapes JSON-LD closing-tag input", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
  });

  it("resolves paths without dropping base URL segments", () => {
    expect(absoluteUrl("https://example.com", "/cv")).toBe("https://example.com/cv");
  });
});
