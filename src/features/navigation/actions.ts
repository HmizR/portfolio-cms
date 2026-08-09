"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { PUBLIC_NAVIGATION_CACHE_TAG } from "@/features/navigation/queries";
import {
  createNavigationItem,
  deleteNavigationItem,
  NavigationOrderConflictError,
  NavigationPageNotFoundError,
  reorderNavigationItems,
  updateNavigationItem,
} from "@/features/navigation/service";
import {
  navigationIdSchema,
  navigationItemSchema,
  reorderNavigationSchema,
  updateNavigationItemSchema,
  type NavigationActionState,
} from "@/features/navigation/validation";

function nullableFormString(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function navigationValues(formData: FormData) {
  return {
    label: formData.get("label"),
    type: formData.get("type"),
    pageId: nullableFormString(formData.get("pageId")),
    url: nullableFormString(formData.get("url")),
    isVisible: formData.get("isVisible") === "on",
    openNewTab: formData.get("openNewTab") === "on",
  };
}

function revalidateNavigation(): void {
  updateTag(PUBLIC_NAVIGATION_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/admin/navigation");
}

export async function createNavigationItemAction(
  _state: NavigationActionState,
  formData: FormData,
): Promise<NavigationActionState> {
  await requireAdmin();
  const parsed = navigationItemSchema.safeParse(navigationValues(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted navigation fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createNavigationItem(parsed.data);
  } catch (error) {
    if (error instanceof NavigationPageNotFoundError) {
      return { status: "error", message: error.message };
    }
    console.error("Navigation item creation failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "The navigation item could not be created." };
  }

  revalidateNavigation();
  return { status: "success", message: "Navigation item added." };
}

export async function updateNavigationItemAction(
  _state: NavigationActionState,
  formData: FormData,
): Promise<NavigationActionState> {
  await requireAdmin();
  const parsed = updateNavigationItemSchema.safeParse({
    ...navigationValues(formData),
    id: formData.get("id"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted navigation fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { id, ...input } = parsed.data;
    if (!(await updateNavigationItem(id, input))) {
      return { status: "error", message: "This navigation item no longer exists." };
    }
  } catch (error) {
    if (error instanceof NavigationPageNotFoundError) {
      return { status: "error", message: error.message };
    }
    console.error("Navigation item update failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "The navigation item could not be saved." };
  }

  revalidateNavigation();
  return { status: "success", message: "Navigation item saved." };
}

export async function deleteNavigationItemAction(input: unknown) {
  await requireAdmin();
  const parsed = navigationIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Invalid navigation item." };

  try {
    if (!(await deleteNavigationItem(parsed.data))) {
      return { ok: false as const, message: "This navigation item no longer exists." };
    }
  } catch (error) {
    console.error("Navigation item deletion failed.", error instanceof Error ? error.name : "UnknownError");
    return { ok: false as const, message: "The navigation item could not be deleted." };
  }

  revalidateNavigation();
  return { ok: true as const, message: "Navigation item deleted." };
}

export async function reorderNavigationItemsAction(input: unknown) {
  await requireAdmin();
  const parsed = reorderNavigationSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Navigation order is invalid." };

  try {
    await reorderNavigationItems(parsed.data);
  } catch (error) {
    if (error instanceof NavigationOrderConflictError) {
      return { ok: false as const, message: error.message };
    }
    console.error("Navigation reorder failed.", error instanceof Error ? error.name : "UnknownError");
    return { ok: false as const, message: "Navigation order could not be saved." };
  }

  revalidateNavigation();
  return { ok: true as const, message: "Navigation order saved." };
}
