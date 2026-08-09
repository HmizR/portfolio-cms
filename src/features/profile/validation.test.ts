import { describe, expect, it } from "vitest";

import { appearanceSchema, profileSchema } from "@/features/profile/validation";

describe("profile and appearance validation", () => {
  it("accepts a flexible visible social link and normalizes empty optional fields", () => {
    const result = profileSchema.parse({
      fullName: "Dr. Maya Chen",
      headline: "Researcher",
      shortBiography: "Human-centered AI researcher.",
      longBiography: "",
      location: "Bangkok, Thailand",
      publicEmail: "",
      avatarUrl: "",
      socialLinks: [{ platform: "Custom network", label: "Research profile", url: "https://example.com/maya", iconIdentifier: "link", isVisible: true }],
    });

    expect(result.publicEmail).toBeNull();
    expect(result.avatarUrl).toBeNull();
    expect(result.socialLinks[0]?.platform).toBe("Custom network");
  });

  it("rejects unsafe appearance options and malformed social URLs", () => {
    expect(appearanceSchema.safeParse({ siteTitle: "Site", siteDescription: "", accentColor: "rainbow", contentWidth: "standard", profileImageShape: "circle", typography: "classic" }).success).toBe(false);
    expect(profileSchema.safeParse({ fullName: "Maya Chen", headline: "", shortBiography: "", longBiography: "", location: "", publicEmail: "", avatarUrl: "", socialLinks: [{ platform: "GitHub", label: "GitHub", url: "not-a-url", iconIdentifier: "github", isVisible: true }] }).success).toBe(false);
    expect(profileSchema.safeParse({ fullName: "Maya Chen", headline: "", shortBiography: "", longBiography: "", location: "", publicEmail: "", avatarUrl: "//example.com/avatar.jpg", socialLinks: [] }).success).toBe(false);
    expect(profileSchema.safeParse({ fullName: "Maya Chen", headline: "", shortBiography: "", longBiography: "", location: "", publicEmail: "", avatarUrl: "", socialLinks: [{ platform: "Unsafe", label: "Unsafe", url: "javascript:alert(1)", iconIdentifier: "link", isVisible: true }] }).success).toBe(false);
  });
});
