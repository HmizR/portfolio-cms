import { describe, expect, it } from "vitest";

import { parseServerEnvironment } from "@/lib/env/schema";

const validEnvironment = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:password@localhost:5432/portfoliocms",
  APP_URL: "http://localhost:3000",
  AUTH_SECRET: "a-development-secret-with-32-characters",
  S3_ENDPOINT: "http://localhost:9000",
  S3_REGION: "us-east-1",
  S3_BUCKET: "portfoliocms",
  S3_ACCESS_KEY_ID: "portfoliocms",
  S3_SECRET_ACCESS_KEY: "storage-secret",
  S3_FORCE_PATH_STYLE: "true",
  MAX_UPLOAD_SIZE_MB: "10",
};

describe("parseServerEnvironment", () => {
  it("coerces documented string values", () => {
    const result = parseServerEnvironment(validEnvironment);

    expect(result.S3_FORCE_PATH_STYLE).toBe(true);
    expect(result.MAX_UPLOAD_SIZE_MB).toBe(10);
  });

  it("rejects short authentication secrets", () => {
    expect(() =>
      parseServerEnvironment({ ...validEnvironment, AUTH_SECRET: "too-short" }),
    ).toThrow();
  });

  it("rejects non-PostgreSQL database URLs", () => {
    expect(() =>
      parseServerEnvironment({ ...validEnvironment, DATABASE_URL: "mysql://localhost/app" }),
    ).toThrow();
  });
});
