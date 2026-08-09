import { describe, expect, it } from "vitest";

import { generateSlug } from "@/features/pages/slug";
import { pageSlugSchema } from "@/features/pages/validation";

describe("page slugs", () => {
  it("normalizes titles into stable URL slugs", () => {
    expect(generateSlug("  Résumé & Research — 2026  ")).toBe("resume-research-2026");
    expect(generateSlug("Many---spaces___here")).toBe("many-spaces-here");
  });

  it("rejects reserved and non-canonical slugs", () => {
    expect(pageSlugSchema.safeParse("admin").success).toBe(false);
    expect(pageSlugSchema.safeParse("Hello World").success).toBe(false);
    expect(pageSlugSchema.safeParse("hello--world").success).toBe(false);
    expect(pageSlugSchema.safeParse("hello-world").success).toBe(true);
  });
});
