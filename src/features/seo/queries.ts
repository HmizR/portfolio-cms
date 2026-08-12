import "server-only";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { defaultAppearance } from "@/features/profile/defaults";
import { getMediaUrlById } from "@/features/media/queries";
import { seoSettingsSchema, type SeoSettingsInput } from "@/features/seo/validation";
import { env } from "@/lib/env/server";

export interface GlobalSeoSettings extends SeoSettingsInput {
  baseUrl: string;
  defaultDescription: string;
  defaultOgImageUrl: string | null;
  siteTitle: string;
}

export async function getSeoEditorData(): Promise<SeoSettingsInput> {
  const [settings] = await db.select().from(siteSettings).limit(1);
  return seoSettingsSchema.parse({
    defaultOgMediaId: settings?.defaultOgMediaId ?? null,
    twitterHandle: settings?.twitterHandle ?? "",
  });
}

export async function getGlobalSeoSettings(): Promise<GlobalSeoSettings> {
  const [settings] = await db.select().from(siteSettings).limit(1);
  const defaultOgMediaId = settings?.defaultOgMediaId ?? null;
  return {
    baseUrl: env.APP_URL.replace(/\/$/, ""),
    defaultDescription: settings?.siteDescription ?? defaultAppearance.siteDescription,
    defaultOgImageUrl: await getMediaUrlById(defaultOgMediaId),
    defaultOgMediaId,
    siteTitle: settings?.siteTitle ?? defaultAppearance.siteTitle,
    twitterHandle: settings?.twitterHandle ?? null,
  };
}
