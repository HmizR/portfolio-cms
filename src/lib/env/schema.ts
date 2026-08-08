import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export const serverEnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  TEST_DATABASE_URL: z.string().url().startsWith("postgresql://").optional(),
  APP_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(3),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(8),
  S3_FORCE_PATH_STYLE: booleanFromString.default(true),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().max(100).default(10),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function parseServerEnvironment(
  values: Record<string, string | undefined>,
): ServerEnvironment {
  return serverEnvironmentSchema.parse(values);
}
