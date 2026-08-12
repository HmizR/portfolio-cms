import { describe, expect, it } from "vitest";
import { cvConfigurationSchema, cvSectionTypes } from "@/features/cv/validation";

const valid = { sections: cvSectionTypes.map((sectionType) => ({ sectionType, isVisible: true })), projectIds: ["6d988f35-b3f5-45b5-a2a2-89be25d37b39"] };
describe("CV configuration validation", () => {
  it("accepts a complete finite configuration", () => { expect(cvConfigurationSchema.parse(valid)).toEqual(valid); });
  it("rejects missing, duplicate, and unknown sections or project IDs", () => {
    expect(cvConfigurationSchema.safeParse({ ...valid, sections: valid.sections.slice(1) }).success).toBe(false);
    expect(cvConfigurationSchema.safeParse({ ...valid, sections: valid.sections.map(() => valid.sections[0]) }).success).toBe(false);
    expect(cvConfigurationSchema.safeParse({ ...valid, projectIds: [valid.projectIds[0], valid.projectIds[0]] }).success).toBe(false);
    expect(cvConfigurationSchema.safeParse({ ...valid, sections: valid.sections.map((section, index) => index ? section : { ...section, sectionType: "custom" }) }).success).toBe(false);
  });
});
