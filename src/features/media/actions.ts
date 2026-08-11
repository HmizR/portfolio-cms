"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { deleteMedia, updateMediaAltText } from "@/features/media/service";
import { deleteMediaSchema, updateMediaSchema } from "@/features/media/validation";
import { PUBLIC_SITE_CACHE_TAG } from "@/features/profile/queries";

export type MediaActionState = { message?: string; status?: "error" | "success" };

export async function updateMediaAltTextAction(_state: MediaActionState, formData: FormData): Promise<MediaActionState> {
  await requireAdmin();
  const parsed = updateMediaSchema.safeParse({ id: formData.get("id"), altText: formData.get("altText") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid media details." };
  try {
    await updateMediaAltText(parsed.data.id, parsed.data.altText);
    revalidatePath("/admin/media");
    return { status: "success", message: "Alternative text saved." };
  } catch (error) {
    console.error("Failed to update media alternative text.", error);
    return { status: "error", message: "Alternative text could not be saved." };
  }
}

export async function deleteMediaAction(_state: MediaActionState, formData: FormData): Promise<MediaActionState> {
  await requireAdmin();
  const parsed = deleteMediaSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { status: "error", message: "Select a valid media item." };
  try {
    const deleted = await deleteMedia(parsed.data.id);
    updateTag(PUBLIC_SITE_CACHE_TAG);
    revalidatePath("/admin/media");
    revalidatePath("/admin");
    return deleted ? { status: "success", message: "Media deleted." } : { status: "error", message: "Media was already deleted." };
  } catch (error) {
    console.error("Failed to delete media.", error);
    return { status: "error", message: "Media could not be deleted from storage." };
  }
}
