import { describe, expect, it } from "vitest";

import { resolveNavigationHref } from "@/features/navigation/destination";

describe("navigation destinations", () => {
  it("maps system and external destinations", () => {
    expect(resolveNavigationHref({ type: "posts", pageSlug: null, pageStatus: null, url: null })).toBe("/posts");
    expect(resolveNavigationHref({ type: "external", pageSlug: null, pageStatus: null, url: "https://example.com" })).toBe("https://example.com");
  });

  it("only resolves page links when their page is published", () => {
    expect(resolveNavigationHref({ type: "page", pageSlug: "hello", pageStatus: "published", url: null })).toBe("/hello");
    expect(resolveNavigationHref({ type: "page", pageSlug: "hello", pageStatus: "draft", url: null })).toBeNull();
  });
});
