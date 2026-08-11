"use server";

import { revalidatePath, updateTag as invalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/auth/session";
import { PUBLIC_PROJECTS_CACHE_TAG } from "@/features/projects/queries";
import { autosaveProject, createProject, createTechnology, deleteProject, deleteTechnology, ProjectSlugConflictError, TechnologyConflictError, updateProject, updateTechnology } from "@/features/projects/service";
import { autosaveProjectSchema, createProjectSchema, projectFormSchema, projectIdSchema, projectIntentSchema, projectSlugSchema, technologyFormSchema, technologyIdSchema, technologySlugSchema, type CreateProjectActionState, type ProjectActionState, type TechnologyActionState } from "@/features/projects/validation";
import { renderMarkdown } from "@/lib/markdown/render";
import { generateSlug } from "@/lib/slug";

function projectValues(formData: FormData) { return { id: formData.get("id"), title: formData.get("title"), slug: formData.get("slug"), summary: formData.get("summary"), contentMarkdown: formData.get("contentMarkdown"), coverMediaId: formData.get("coverMediaId"), coverImageUrl: formData.get("coverImageUrl"), githubUrl: formData.get("githubUrl"), demoUrl: formData.get("demoUrl"), externalUrl: formData.get("externalUrl"), technologyIds: formData.getAll("technologyIds"), isFeatured: formData.get("isFeatured") === "on", projectStatus: formData.get("projectStatus"), startedOn: formData.get("startedOn"), endedOn: formData.get("endedOn"), seoTitle: formData.get("seoTitle"), seoDescription: formData.get("seoDescription"), canonicalUrl: formData.get("canonicalUrl"), ogMediaId: formData.get("ogMediaId"), ogImageUrl: formData.get("ogImageUrl") }; }
function revalidateProjectRoutes(slugs: string[]) { invalidateTag(PUBLIC_PROJECTS_CACHE_TAG); for (const slug of new Set(slugs)) revalidatePath(`/projects/${slug}`); revalidatePath("/projects"); revalidatePath("/admin/projects"); }

export async function createProjectAction(_state: CreateProjectActionState, formData: FormData): Promise<CreateProjectActionState> {
  await requireAdmin();
  const parsed = createProjectSchema.safeParse({ title: formData.get("title"), slug: formData.get("slug") });
  const values = { title: String(formData.get("title") ?? ""), slug: String(formData.get("slug") ?? "") };
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors, values };
  const slug = parsed.data.slug || generateSlug(parsed.data.title);
  const parsedSlug = projectSlugSchema.safeParse(slug);
  if (!parsedSlug.success) return { fieldErrors: { slug: parsedSlug.error.issues.map((issue) => issue.message) }, values };
  let id: string;
  try { id = await createProject({ title: parsed.data.title, slug: parsedSlug.data }); } catch (error) { if (error instanceof ProjectSlugConflictError) return { fieldErrors: { slug: [error.message] }, values: { ...values, slug } }; console.error("Project creation failed.", error instanceof Error ? error.name : "UnknownError"); return { message: "The project could not be created. Please try again.", values }; }
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${id}`);
}

export async function updateProjectAction(_state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireAdmin();
  const parsed = projectFormSchema.safeParse(projectValues(formData));
  const intent = projectIntentSchema.safeParse(formData.get("intent"));
  if (!parsed.success || !intent.success) return { status: "error", message: "Review the highlighted project fields.", fieldErrors: parsed.success ? { intent: ["Choose a valid project action."] } : parsed.error.flatten().fieldErrors };
  try { const updated = await updateProject(parsed.data, intent.data); revalidateProjectRoutes([updated.previousSlug, updated.project.slug]); return { status: "success", message: intent.data === "publish" ? "Project published." : intent.data === "archive" ? "Project archived." : intent.data === "draft" ? "Project moved to draft." : "Project saved.", savedProject: parsed.data, savedStatus: updated.project.status }; } catch (error) { if (error instanceof ProjectSlugConflictError) return { status: "error", message: "Choose a different slug.", fieldErrors: { slug: [error.message] } }; console.error("Project update failed.", error instanceof Error ? error.message : "UnknownError"); return { status: "error", message: "The project could not be saved. Please try again." }; }
}

export async function autosaveProjectAction(input: unknown) { await requireAdmin(); const parsed = autosaveProjectSchema.safeParse(input); if (!parsed.success) return { ok: false as const, message: "Autosave input is invalid." }; try { const savedAt = await autosaveProject(parsed.data.id, parsed.data.contentMarkdown); return { ok: true as const, savedAt: savedAt.toISOString() }; } catch (error) { console.error("Project autosave failed.", error instanceof Error ? error.name : "UnknownError"); return { ok: false as const, message: "Autosave failed. Your local text is unchanged." }; } }
export async function renderProjectMarkdownPreviewAction(markdown: unknown) { await requireAdmin(); const parsed = autosaveProjectSchema.shape.contentMarkdown.safeParse(markdown); if (!parsed.success) return { ok: false as const, message: "Preview content is invalid." }; return { ok: true as const, html: await renderMarkdown(parsed.data) }; }
export async function deleteProjectAction(id: string): Promise<void> { await requireAdmin(); const parsed = projectIdSchema.safeParse(id); if (!parsed.success) return; const slug = await deleteProject(parsed.data); if (slug) revalidateProjectRoutes([slug]); redirect("/admin/projects"); }

function technologyValues(formData: FormData) { return { id: formData.get("id") ?? undefined, name: formData.get("name"), slug: formData.get("slug") }; }
async function validatedTechnology(formData: FormData): Promise<{ ok: true; value: { id?: string; name: string; slug: string } } | { ok: false; state: TechnologyActionState }> {
  const parsed = technologyFormSchema.safeParse(technologyValues(formData)); const values = { name: String(formData.get("name") ?? ""), slug: String(formData.get("slug") ?? "") };
  if (!parsed.success) return { ok: false, state: { status: "error", fieldErrors: parsed.error.flatten().fieldErrors, values } };
  const slug = parsed.data.slug || generateSlug(parsed.data.name); const parsedSlug = technologySlugSchema.safeParse(slug);
  if (!parsedSlug.success) return { ok: false, state: { status: "error", fieldErrors: { slug: parsedSlug.error.issues.map((issue) => issue.message) }, values } };
  return { ok: true, value: { ...parsed.data, slug: parsedSlug.data } };
}
function revalidateTechnologyRoutes() { invalidateTag(PUBLIC_PROJECTS_CACHE_TAG); revalidatePath("/projects", "layout"); revalidatePath("/admin/projects", "layout"); }
export async function createTechnologyAction(_state: TechnologyActionState, formData: FormData): Promise<TechnologyActionState> { await requireAdmin(); const parsed = await validatedTechnology(formData); if (!parsed.ok) return parsed.state; try { await createTechnology({ name: parsed.value.name, slug: parsed.value.slug }); revalidatePath("/admin/projects", "layout"); return { status: "success", message: "Technology created." }; } catch (error) { if (error instanceof TechnologyConflictError) return { status: "error", message: error.message, values: { name: parsed.value.name, slug: parsed.value.slug } }; console.error("Technology creation failed.", error instanceof Error ? error.name : "UnknownError"); return { status: "error", message: "The technology could not be created." }; } }
export async function updateTechnologyAction(_state: TechnologyActionState, formData: FormData): Promise<TechnologyActionState> { await requireAdmin(); const parsed = await validatedTechnology(formData); if (!parsed.ok) return parsed.state; const id = technologyIdSchema.safeParse(parsed.value.id); if (!id.success) return { status: "error", message: "The technology identifier is invalid." }; try { await updateTechnology({ id: id.data, name: parsed.value.name, slug: parsed.value.slug }); revalidateTechnologyRoutes(); return { status: "success", message: "Technology saved." }; } catch (error) { if (error instanceof TechnologyConflictError) return { status: "error", message: error.message }; console.error("Technology update failed.", error instanceof Error ? error.name : "UnknownError"); return { status: "error", message: "The technology could not be saved." }; } }
export async function deleteTechnologyAction(id: string): Promise<void> { await requireAdmin(); const parsed = technologyIdSchema.safeParse(id); if (!parsed.success) return; await deleteTechnology(parsed.data); revalidateTechnologyRoutes(); }
