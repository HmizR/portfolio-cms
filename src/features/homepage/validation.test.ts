import { describe, expect, it } from "vitest";

import { homepageConfigurationSchema, homepageSectionTypes } from "@/features/homepage/validation";

const sections = homepageSectionTypes.map((sectionType) => sectionType === "markdown"
  ? { sectionType, isVisible: true, configuration: { heading: "About", markdown: "Hello" } }
  : sectionType === "page_excerpt"
    ? { sectionType, isVisible: false, configuration: { heading: "Read more", pageId: null } }
    : { sectionType, isVisible: true, configuration: { heading: sectionType, itemCount: 3 } });

describe("homepage configuration", () => {
  it("accepts one strictly typed entry for every section", () => expect(homepageConfigurationSchema.safeParse({ sections }).success).toBe(true));
  it("rejects missing or duplicate section types", () => expect(homepageConfigurationSchema.safeParse({ sections: [...sections.slice(0, -1), sections[0]] }).success).toBe(false));
  it("bounds derived item counts", () => expect(homepageConfigurationSchema.safeParse({ sections: sections.map((section) => section.sectionType === "recent_posts" ? { ...section, configuration: { heading: "Posts", itemCount: 99 } } : section) }).success).toBe(false));
});
