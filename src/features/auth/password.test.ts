import { hashPassword, verifyPassword } from "better-auth/crypto";
import { describe, expect, it } from "vitest";

describe("password storage", () => {
  it("hashes passwords and verifies them without retaining plaintext", async () => {
    const password = "correct horse battery staple";
    const hash = await hashPassword(password);

    expect(hash).not.toContain(password);
    await expect(verifyPassword({ hash, password })).resolves.toBe(true);
    await expect(verifyPassword({ hash, password: "wrong password" })).resolves.toBe(false);
  });
});
