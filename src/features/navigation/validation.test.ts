import { describe, expect, it } from "vitest";

import { navigationItemSchema, reorderNavigationSchema } from "@/features/navigation/validation";

const common = { label: "Research", isVisible: true, openNewTab: false };

describe("navigation validation", () => {
  it("accepts each destination shape", () => {
    expect(navigationItemSchema.safeParse({ ...common, type: "page", pageId: "7fe4e8dd-8f22-4b9f-b19a-7cd4529f8d70", url: null }).success).toBe(true);
    expect(navigationItemSchema.safeParse({ ...common, type: "posts", pageId: null, url: null }).success).toBe(true);
    expect(navigationItemSchema.safeParse({ ...common, type: "external", pageId: null, url: "https://example.com/research" }).success).toBe(true);
  });

  it("rejects mixed destinations and unsafe external URLs", () => {
    expect(navigationItemSchema.safeParse({ ...common, type: "page", pageId: null, url: "https://example.com" }).success).toBe(false);
    expect(navigationItemSchema.safeParse({ ...common, type: "external", pageId: null, url: "javascript:alert(1)" }).success).toBe(false);
    expect(navigationItemSchema.safeParse({ ...common, type: "cv", pageId: null, url: "/custom-cv" }).success).toBe(false);
  });

  it("rejects duplicate identifiers in a reorder request", () => {
    const id = "7fe4e8dd-8f22-4b9f-b19a-7cd4529f8d70";
    expect(reorderNavigationSchema.safeParse([id, id]).success).toBe(false);
  });
});
