import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public/public-shell";
import { requireAdmin } from "@/features/auth/session";
import { getMediaUrlById } from "@/features/media/queries";
import { getPublicNavigation } from "@/features/navigation/queries";
import { ProjectPresentation } from "@/features/projects/project-presentation";
import { getProjectById } from "@/features/projects/queries";
import { projectIdSchema } from "@/features/projects/validation";
import { getPublicSiteData } from "@/features/profile/queries";
import { renderMarkdown } from "@/lib/markdown/render";

export const metadata: Metadata = { title: "Project preview | PortfolioCMS", robots: { index: false, follow: false } };

export default async function PreviewProject({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const parsed = projectIdSchema.safeParse(id);
  if (!parsed.success) notFound();
  const [navigation, project, site] = await Promise.all([getPublicNavigation(), getProjectById(parsed.data), getPublicSiteData()]);
  if (!project) notFound();
  const [html, managedCoverUrl] = await Promise.all([renderMarkdown(project.draftMarkdown ?? project.contentMarkdown), getMediaUrlById(project.coverMediaId)]);
  return <PublicShell navigation={navigation} site={site}><div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">Private preview · {project.status}</div><ProjectPresentation coverImageUrl={managedCoverUrl ?? project.coverImageUrl} demoUrl={project.demoUrl} endedOn={project.endedOn} externalUrl={project.externalUrl} githubUrl={project.githubUrl} html={html} projectStatus={project.projectStatus} startedOn={project.startedOn} summary={project.summary} technologies={project.technologies} title={project.title} /></PublicShell>;
}
