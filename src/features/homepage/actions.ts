"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { PUBLIC_HOMEPAGE_CACHE_TAG } from "@/features/homepage/queries";
import { HomepagePageSelectionError, saveHomepageConfiguration } from "@/features/homepage/service";
import { homepageConfigurationSchema, homepageMarkdownSchema, type HomepageActionState } from "@/features/homepage/validation";
import { renderMarkdown } from "@/lib/markdown/render";

export async function saveHomepageConfigurationAction(_state: HomepageActionState, formData: FormData): Promise<HomepageActionState> {
  await requireAdmin();
  const serialized = formData.get("configuration");
  let candidate: unknown;
  try { candidate = typeof serialized === "string" ? JSON.parse(serialized) : null; }
  catch { return { status: "error", message: "The homepage configuration was not valid JSON." }; }
  const parsed = homepageConfigurationSchema.safeParse(candidate);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Review the homepage configuration." };
  try {
    await saveHomepageConfiguration(parsed.data);
    updateTag(PUBLIC_HOMEPAGE_CACHE_TAG);
    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return { status: "success", message: "Homepage configuration saved." };
  } catch (error) {
    if (error instanceof HomepagePageSelectionError) return { status: "error", message: error.message };
    console.error("Homepage configuration save failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "The homepage configuration could not be saved." };
  }
}

export async function renderHomepageMarkdownAction(markdown: unknown) {
  await requireAdmin();
  const parsed = homepageMarkdownSchema.safeParse(markdown);
  if (!parsed.success) return { ok: false as const, message: "Preview content is invalid." };
  return { ok: true as const, html: await renderMarkdown(parsed.data) };
}
