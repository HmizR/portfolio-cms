import { describe, expect, it } from "vitest";

import { loginSchema, setupSchema } from "@/features/auth/validation";

describe("authentication input validation", () => {
  it("normalizes valid administrator input", () => {
    const result = setupSchema.parse({
      name: "  Dr. Maya Chen  ",
      email: "  MAYA@EXAMPLE.COM ",
      password: "correct horse battery staple",
      confirmPassword: "correct horse battery staple",
    });

    expect(result.name).toBe("Dr. Maya Chen");
    expect(result.email).toBe("maya@example.com");
  });

  it("rejects short and mismatched setup passwords", () => {
    const result = setupSchema.safeParse({
      name: "Maya Chen",
      email: "maya@example.com",
      password: "too-short",
      confirmPassword: "different-password",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it("does not enforce setup password length during login", () => {
    expect(
      loginSchema.safeParse({ email: "maya@example.com", password: "x" }).success,
    ).toBe(true);
  });
});
