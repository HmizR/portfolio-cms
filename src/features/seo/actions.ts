"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { PUBLIC_SITE_CACHE_TAG } from "@/features/profile/queries";
import { saveSeoSettings } from "@/features/seo/service";
import { seoSettingsSchema, type SeoSettingsActionState } from "@/features/seo/validation";

export async function updateSeoSettingsAction(
  _state: SeoSettingsActionState,
  formData: FormData,
): Promise<SeoSettingsActionState> {
  await requireAdmin();
  const parsed = seoSettingsSchema.safeParse({
    defaultOgMediaId: formData.get("defaultOgMediaId"),
    twitterHandle: formData.get("twitterHandle"),
  });
  if (!parsed.success) return { status: "error", message: "Review the highlighted SEO fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    await saveSeoSettings(parsed.data);
  } catch (error) {
    console.error("SEO settings update failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "SEO settings could not be saved." };
  }
  updateTag(PUBLIC_SITE_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
  revalidatePath("/admin/seo");
  return { status: "success", message: "SEO defaults saved." };
}
