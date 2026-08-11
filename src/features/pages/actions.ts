"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth/session";
import { PUBLIC_NAVIGATION_CACHE_TAG } from "@/features/navigation/queries";
import { PUBLIC_PAGES_CACHE_TAG } from "@/features/pages/queries";
import {
  autosavePage,
  createPage,
  deletePage,
  PageSlugConflictError,
  updatePage,
} from "@/features/pages/service";
import { generateSlug } from "@/features/pages/slug";
import {
  autosavePageSchema,
  createPageSchema,
  pageFormSchema,
  pageIdSchema,
  pageIntentSchema,
  pageSlugSchema,
  type CreatePageActionState,
  type PageActionState,
} from "@/features/pages/validation";
import { renderMarkdown } from "@/lib/markdown/render";

function valuesFromPageForm(formData: FormData) {
  return {
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    contentMarkdown: formData.get("contentMarkdown"),
    showTitle: formData.get("showTitle") === "on",
    showSidebar: formData.get("showSidebar") === "on",
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    canonicalUrl: formData.get("canonicalUrl"),
    ogMediaId: formData.get("ogMediaId"),
    ogImageUrl: formData.get("ogImageUrl"),
  };
}

function revalidatePageRoutes(slugs: string[]): void {
  updateTag(PUBLIC_PAGES_CACHE_TAG);
  updateTag(PUBLIC_NAVIGATION_CACHE_TAG);
  for (const slug of new Set(slugs)) revalidatePath(`/${slug}`);
  revalidatePath("/", "layout");
  revalidatePath("/admin/navigation");
  revalidatePath("/admin/pages");
}

export async function createPageAction(
  _state: CreatePageActionState,
  formData: FormData,
): Promise<CreatePageActionState> {
  await requireAdmin();
  const parsed = createPageSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
  });
  const values = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
  };
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values };
  }

  const generatedSlug = parsed.data.slug || generateSlug(parsed.data.title);
  const slugResult = pageSlugSchema.safeParse(generatedSlug);
  if (!slugResult.success) {
    return {
      fieldErrors: { slug: slugResult.error.issues.map((issue) => issue.message) },
      values,
    };
  }

  let id: string;
  try {
    id = await createPage({ title: parsed.data.title, slug: slugResult.data });
  } catch (error) {
    if (error instanceof PageSlugConflictError) {
      return { fieldErrors: { slug: [error.message] }, values: { ...values, slug: generatedSlug } };
    }
    console.error("Page creation failed.", error instanceof Error ? error.name : "UnknownError");
    return { message: "The page could not be created. Please try again.", values };
  }

  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${id}`);
}

export async function updatePageAction(
  _state: PageActionState,
  formData: FormData,
): Promise<PageActionState> {
  await requireAdmin();
  const parsed = pageFormSchema.safeParse(valuesFromPageForm(formData));
  const intent = pageIntentSchema.safeParse(formData.get("intent"));
  if (!parsed.success || !intent.success) {
    return {
      status: "error",
      message: "Review the highlighted page fields.",
      fieldErrors: parsed.success ? { intent: ["Choose a valid page action."] } : parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const updated = await updatePage(parsed.data, intent.data);
    revalidatePageRoutes([updated.previousSlug, updated.page.slug]);
    return {
      status: "success",
      message: intent.data === "publish" ? "Page published." : intent.data === "archive" ? "Page archived." : intent.data === "draft" ? "Page moved to draft." : "Page saved.",
      savedPage: {
        ...parsed.data,
        slug: updated.page.slug,
      },
      savedStatus: updated.page.status,
    };
  } catch (error) {
    if (error instanceof PageSlugConflictError) {
      return { status: "error", message: "Choose a different slug.", fieldErrors: { slug: [error.message] } };
    }
    console.error("Page update failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "The page could not be saved. Please try again." };
  }
}

export async function autosavePageAction(input: unknown) {
  await requireAdmin();
  const parsed = autosavePageSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Autosave input is invalid." };

  try {
    const savedAt = await autosavePage(parsed.data.id, parsed.data.contentMarkdown);
    return { ok: true as const, savedAt: savedAt.toISOString() };
  } catch (error) {
    console.error("Page autosave failed.", error instanceof Error ? error.name : "UnknownError");
    return { ok: false as const, message: "Autosave failed. Your local text is unchanged." };
  }
}

export async function renderMarkdownPreviewAction(markdown: unknown) {
  await requireAdmin();
  const parsed = autosavePageSchema.shape.contentMarkdown.safeParse(markdown);
  if (!parsed.success) return { ok: false as const, message: "Preview content is invalid." };
  return { ok: true as const, html: await renderMarkdown(parsed.data) };
}

export async function deletePageAction(id: string): Promise<void> {
  await requireAdmin();
  const parsed = pageIdSchema.safeParse(id);
  if (!parsed.success) return;
  const slug = await deletePage(parsed.data);
  if (slug) revalidatePageRoutes([slug]);
  redirect("/admin/pages");
}
