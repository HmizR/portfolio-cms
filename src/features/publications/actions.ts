"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth/session";
import { PUBLIC_PUBLICATIONS_CACHE_TAG } from "@/features/publications/queries";
import { autosavePublication, createPublication, deletePublication, PublicationSlugConflictError, updatePublication } from "@/features/publications/service";
import { autosavePublicationSchema, createPublicationSchema, publicationFormSchema, publicationIdSchema, publicationIntentSchema, publicationSlugSchema, type CreatePublicationActionState, type PublicationActionState } from "@/features/publications/validation";
import { renderMarkdown } from "@/lib/markdown/render";
import { generateSlug } from "@/lib/slug";

function parseAuthors(value: FormDataEntryValue | null): unknown { if (typeof value !== "string") return []; try { return JSON.parse(value) as unknown; } catch { return null; } }
function values(formData: FormData) { return { id: formData.get("id"), title: formData.get("title"), slug: formData.get("slug"), abstract: formData.get("abstract"), contentMarkdown: formData.get("contentMarkdown"), publicationType: formData.get("publicationType"), venue: formData.get("venue"), publisher: formData.get("publisher"), publicationDate: formData.get("publicationDate"), doi: formData.get("doi"), externalUrl: formData.get("externalUrl"), pdfMediaId: formData.get("pdfMediaId"), authors: parseAuthors(formData.get("authors")), isFeatured: formData.get("isFeatured") === "on", seoTitle: formData.get("seoTitle"), seoDescription: formData.get("seoDescription"), canonicalUrl: formData.get("canonicalUrl"), ogMediaId: formData.get("ogMediaId"), ogImageUrl: formData.get("ogImageUrl") }; }
function invalidate(slugs: string[]) { updateTag(PUBLIC_PUBLICATIONS_CACHE_TAG); for (const slug of new Set(slugs)) revalidatePath(`/publications/${slug}`); revalidatePath("/"); revalidatePath("/publications"); revalidatePath("/cv"); revalidatePath("/admin/publications"); }

export async function createPublicationAction(_state: CreatePublicationActionState, formData: FormData): Promise<CreatePublicationActionState> {
  await requireAdmin();
  const parsed = createPublicationSchema.safeParse({ title: formData.get("title"), slug: formData.get("slug") });
  const formValues = { title: String(formData.get("title") ?? ""), slug: String(formData.get("slug") ?? "") };
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors, values: formValues };
  const slug = parsed.data.slug || generateSlug(parsed.data.title); const parsedSlug = publicationSlugSchema.safeParse(slug);
  if (!parsedSlug.success) return { fieldErrors: { slug: parsedSlug.error.issues.map((issue) => issue.message) }, values: formValues };
  let id: string;
  try { id = await createPublication({ title: parsed.data.title, slug: parsedSlug.data }); } catch (error) { if (error instanceof PublicationSlugConflictError) return { fieldErrors: { slug: [error.message] }, values: { ...formValues, slug } }; console.error("Publication creation failed.", error instanceof Error ? error.name : "UnknownError"); return { message: "The publication could not be created.", values: formValues }; }
  revalidatePath("/admin/publications");
  redirect(`/admin/publications/${id}`);
}
export async function updatePublicationAction(_state: PublicationActionState, formData: FormData): Promise<PublicationActionState> {
  await requireAdmin(); const parsed = publicationFormSchema.safeParse(values(formData)); const intent = publicationIntentSchema.safeParse(formData.get("intent"));
  if (!parsed.success || !intent.success) return { status: "error", message: "Review the highlighted publication fields.", fieldErrors: parsed.success ? { intent: ["Choose a valid action."] } : parsed.error.flatten().fieldErrors };
  try { const result = await updatePublication(parsed.data, intent.data); invalidate([result.previousSlug, result.publication.slug]); return { status: "success", message: intent.data === "publish" ? "Publication published." : intent.data === "archive" ? "Publication archived." : intent.data === "draft" ? "Publication moved to draft." : "Publication saved.", savedPublication: parsed.data, savedStatus: result.publication.status }; } catch (error) { if (error instanceof PublicationSlugConflictError) return { status: "error", message: "Choose a different slug.", fieldErrors: { slug: [error.message] } }; console.error("Publication update failed.", error instanceof Error ? error.message : "UnknownError"); return { status: "error", message: "The publication could not be saved. Please try again." }; }
}
export async function autosavePublicationAction(input: unknown) { await requireAdmin(); const parsed = autosavePublicationSchema.safeParse(input); if (!parsed.success) return { ok: false as const, message: "Autosave input is invalid." }; try { const savedAt = await autosavePublication(parsed.data.id, parsed.data.contentMarkdown); return { ok: true as const, savedAt: savedAt.toISOString() }; } catch (error) { console.error("Publication autosave failed.", error instanceof Error ? error.name : "UnknownError"); return { ok: false as const, message: "Autosave failed. Your local text is unchanged." }; } }
export async function renderPublicationMarkdownPreviewAction(markdown: unknown) { await requireAdmin(); const parsed = autosavePublicationSchema.shape.contentMarkdown.safeParse(markdown); if (!parsed.success) return { ok: false as const, message: "Preview content is invalid." }; return { ok: true as const, html: await renderMarkdown(parsed.data) }; }
export async function deletePublicationAction(id: string): Promise<void> { await requireAdmin(); const parsed = publicationIdSchema.safeParse(id); if (!parsed.success) return; const slug = await deletePublication(parsed.data); if (slug) invalidate([slug]); redirect("/admin/publications"); }
