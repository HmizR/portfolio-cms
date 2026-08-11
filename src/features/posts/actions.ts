"use server";

import { revalidatePath, updateTag as invalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth/session";
import { PUBLIC_POSTS_CACHE_TAG } from "@/features/posts/queries";
import {
  autosavePost,
  createPost,
  createTag,
  deletePost,
  deleteTag,
  PostSlugConflictError,
  TagConflictError,
  updatePost,
  updateTagRecord,
} from "@/features/posts/service";
import {
  autosavePostSchema,
  createPostSchema,
  postFormSchema,
  postIdSchema,
  postIntentSchema,
  postSlugSchema,
  tagFormSchema,
  tagIdSchema,
  tagSlugSchema,
  type CreatePostActionState,
  type PostActionState,
  type TagActionState,
} from "@/features/posts/validation";
import { renderMarkdown } from "@/lib/markdown/render";
import { generateSlug } from "@/lib/slug";

function valuesFromPostForm(formData: FormData) {
  return {
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    contentMarkdown: formData.get("contentMarkdown"),
    coverImageUrl: formData.get("coverImageUrl"),
    tagIds: formData.getAll("tagIds"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    canonicalUrl: formData.get("canonicalUrl"),
    ogImageUrl: formData.get("ogImageUrl"),
  };
}

function revalidatePostRoutes(slugs: string[]): void {
  invalidateTag(PUBLIC_POSTS_CACHE_TAG);
  for (const slug of new Set(slugs)) revalidatePath(`/posts/${slug}`);
  revalidatePath("/posts");
  revalidatePath("/feed.xml");
  revalidatePath("/admin/posts");
}

export async function createPostAction(_state: CreatePostActionState, formData: FormData): Promise<CreatePostActionState> {
  await requireAdmin();
  const parsed = createPostSchema.safeParse({ title: formData.get("title"), slug: formData.get("slug") });
  const values = { title: String(formData.get("title") ?? ""), slug: String(formData.get("slug") ?? "") };
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors, values };

  const generatedSlug = parsed.data.slug || generateSlug(parsed.data.title);
  const slugResult = postSlugSchema.safeParse(generatedSlug);
  if (!slugResult.success) return { fieldErrors: { slug: slugResult.error.issues.map((issue) => issue.message) }, values };

  let id: string;
  try {
    id = await createPost({ title: parsed.data.title, slug: slugResult.data });
  } catch (error) {
    if (error instanceof PostSlugConflictError) return { fieldErrors: { slug: [error.message] }, values: { ...values, slug: generatedSlug } };
    console.error("Post creation failed.", error instanceof Error ? error.name : "UnknownError");
    return { message: "The post could not be created. Please try again.", values };
  }

  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${id}`);
}

export async function updatePostAction(_state: PostActionState, formData: FormData): Promise<PostActionState> {
  await requireAdmin();
  const parsed = postFormSchema.safeParse(valuesFromPostForm(formData));
  const intent = postIntentSchema.safeParse(formData.get("intent"));
  if (!parsed.success || !intent.success) {
    return {
      status: "error",
      message: "Review the highlighted post fields.",
      fieldErrors: parsed.success ? { intent: ["Choose a valid post action."] } : parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const updated = await updatePost(parsed.data, intent.data);
    revalidatePostRoutes([updated.previousSlug, updated.post.slug]);
    return {
      status: "success",
      message: intent.data === "publish" ? "Post published." : intent.data === "archive" ? "Post archived." : intent.data === "draft" ? "Post moved to draft." : "Post saved.",
      savedPost: parsed.data,
      savedStatus: updated.post.status,
    };
  } catch (error) {
    if (error instanceof PostSlugConflictError) return { status: "error", message: "Choose a different slug.", fieldErrors: { slug: [error.message] } };
    console.error("Post update failed.", error instanceof Error ? error.message : "UnknownError");
    return { status: "error", message: "The post could not be saved. Please try again." };
  }
}

export async function autosavePostAction(input: unknown) {
  await requireAdmin();
  const parsed = autosavePostSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Autosave input is invalid." };
  try {
    const savedAt = await autosavePost(parsed.data.id, parsed.data.contentMarkdown);
    return { ok: true as const, savedAt: savedAt.toISOString() };
  } catch (error) {
    console.error("Post autosave failed.", error instanceof Error ? error.name : "UnknownError");
    return { ok: false as const, message: "Autosave failed. Your local text is unchanged." };
  }
}

export async function renderPostMarkdownPreviewAction(markdown: unknown) {
  await requireAdmin();
  const parsed = autosavePostSchema.shape.contentMarkdown.safeParse(markdown);
  if (!parsed.success) return { ok: false as const, message: "Preview content is invalid." };
  return { ok: true as const, html: await renderMarkdown(parsed.data) };
}

export async function deletePostAction(id: string): Promise<void> {
  await requireAdmin();
  const parsed = postIdSchema.safeParse(id);
  if (!parsed.success) return;
  const slug = await deletePost(parsed.data);
  if (slug) revalidatePostRoutes([slug]);
  redirect("/admin/posts");
}

function tagValues(formData: FormData) {
  return { id: formData.get("id") ?? undefined, name: formData.get("name"), slug: formData.get("slug") };
}

async function validatedTag(formData: FormData): Promise<
  | { ok: true; value: { id?: string; name: string; slug: string } }
  | { ok: false; state: TagActionState }
> {
  const parsed = tagFormSchema.safeParse(tagValues(formData));
  const values = { name: String(formData.get("name") ?? ""), slug: String(formData.get("slug") ?? "") };
  if (!parsed.success) return { ok: false, state: { status: "error", fieldErrors: parsed.error.flatten().fieldErrors, values } };
  const slug = parsed.data.slug || generateSlug(parsed.data.name);
  const parsedSlug = tagSlugSchema.safeParse(slug);
  if (!parsedSlug.success) return { ok: false, state: { status: "error", fieldErrors: { slug: parsedSlug.error.issues.map((issue) => issue.message) }, values } };
  return { ok: true, value: { ...parsed.data, slug: parsedSlug.data } };
}

export async function createTagAction(_state: TagActionState, formData: FormData): Promise<TagActionState> {
  await requireAdmin();
  const parsed = await validatedTag(formData);
  if (!parsed.ok) return parsed.state;
  try {
    await createTag({ name: parsed.value.name, slug: parsed.value.slug });
    revalidatePath("/admin/posts", "layout");
    return { status: "success", message: "Tag created." };
  } catch (error) {
    if (error instanceof TagConflictError) return { status: "error", message: error.message, values: { name: parsed.value.name, slug: parsed.value.slug } };
    console.error("Tag creation failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "The tag could not be created." };
  }
}

export async function updateTagAction(_state: TagActionState, formData: FormData): Promise<TagActionState> {
  await requireAdmin();
  const parsed = await validatedTag(formData);
  if (!parsed.ok) return parsed.state;
  const id = tagIdSchema.safeParse(parsed.value.id);
  if (!id.success) return { status: "error", message: "The tag identifier is invalid." };
  try {
    await updateTagRecord({ id: id.data, name: parsed.value.name, slug: parsed.value.slug });
    invalidateTag(PUBLIC_POSTS_CACHE_TAG);
    revalidatePath("/posts", "layout");
    revalidatePath("/feed.xml");
    revalidatePath("/admin/posts", "layout");
    return { status: "success", message: "Tag saved." };
  } catch (error) {
    if (error instanceof TagConflictError) return { status: "error", message: error.message };
    console.error("Tag update failed.", error instanceof Error ? error.name : "UnknownError");
    return { status: "error", message: "The tag could not be saved." };
  }
}

export async function deleteTagAction(id: string): Promise<void> {
  await requireAdmin();
  const parsed = tagIdSchema.safeParse(id);
  if (!parsed.success) return;
  await deleteTag(parsed.data);
  invalidateTag(PUBLIC_POSTS_CACHE_TAG);
  revalidatePath("/posts", "layout");
  revalidatePath("/feed.xml");
  revalidatePath("/admin/posts", "layout");
}
