import { describe, expect, it } from "vitest";

import { createHealthPayload } from "@/lib/health";

describe("createHealthPayload", () => {
  it("returns a stable healthy response", () => {
    expect(createHealthPayload()).toEqual({ status: "ok" });
  });
});
