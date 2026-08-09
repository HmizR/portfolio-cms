"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { PUBLIC_SITE_CACHE_TAG } from "@/features/profile/queries";
import { saveAppearance, saveProfile } from "@/features/profile/service";
import {
  appearanceSchema,
  profileSchema,
  type SettingsActionState,
} from "@/features/profile/validation";

function parseSocialLinks(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string") return [];
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function updateProfileAction(
  _state: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await requireAdmin();
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    headline: formData.get("headline"),
    shortBiography: formData.get("shortBiography"),
    longBiography: formData.get("longBiography"),
    location: formData.get("location"),
    publicEmail: formData.get("publicEmail"),
    avatarUrl: formData.get("avatarUrl"),
    socialLinks: parseSocialLinks(formData.get("socialLinks")),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted profile fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await saveProfile(session.user.id, parsed.data);
  } catch (error) {
    console.error("Profile update failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "The profile could not be saved. Please try again." };
  }

  updateTag(PUBLIC_SITE_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/admin/profile");
  return { status: "success", message: "Profile and social links saved." };
}

export async function updateAppearanceAction(
  _state: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();
  const parsed = appearanceSchema.safeParse({
    siteTitle: formData.get("siteTitle"),
    siteDescription: formData.get("siteDescription"),
    accentColor: formData.get("accentColor"),
    contentWidth: formData.get("contentWidth"),
    profileImageShape: formData.get("profileImageShape"),
    typography: formData.get("typography"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted appearance fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await saveAppearance(parsed.data);
  } catch (error) {
    console.error("Appearance update failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "Appearance settings could not be saved." };
  }

  updateTag(PUBLIC_SITE_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/admin/appearance");
  return {
    status: "success",
    message: "Site identity and appearance saved.",
    savedAppearance: parsed.data,
  };
}
