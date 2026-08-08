import "server-only";

import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import { authSchema } from "@/db/schema";
import { env } from "@/lib/env/server";

export const auth = betterAuth({
  appName: "PortfolioCMS",
  baseURL: env.APP_URL,
  secret: env.AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": {
        window: 60 * 15,
        max: 5,
      },
      "/sign-up/email": {
        window: 60 * 60,
        max: 3,
      },
    },
  },
  advanced: {
    cookiePrefix: "portfoliocms",
    useSecureCookies: env.NODE_ENV === "production",
  },
  trustedOrigins: [env.APP_URL],
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
