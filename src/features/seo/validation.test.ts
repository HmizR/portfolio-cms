import { describe, expect, it } from "vitest";

import { seoSettingsSchema } from "@/features/seo/validation";

describe("SEO settings validation", () => {
  it("normalizes handles and empty media", () => expect(seoSettingsSchema.parse({ defaultOgMediaId: "", twitterHandle: "researcher" })).toEqual({ defaultOgMediaId: null, twitterHandle: "@researcher" }));
  it("rejects invalid handles", () => expect(seoSettingsSchema.safeParse({ defaultOgMediaId: "", twitterHandle: "not valid" }).success).toBe(false));
});
