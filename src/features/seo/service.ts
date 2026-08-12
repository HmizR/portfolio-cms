import "server-only";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { assertImageMediaIds } from "@/features/media/service";
import type { SeoSettingsInput } from "@/features/seo/validation";

export async function saveSeoSettings(input: SeoSettingsInput): Promise<void> {
  await assertImageMediaIds([input.defaultOgMediaId]);
  await db.update(siteSettings).set({ ...input, updatedAt: new Date() });
}
