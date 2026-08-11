import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public/public-shell";
import { getMediaUrlById } from "@/features/media/queries";
import { getPublicNavigation } from "@/features/navigation/queries";
import { ProjectPresentation } from "@/features/projects/project-presentation";
import { getPublishedProjectBySlug } from "@/features/projects/queries";
import { projectSlugSchema } from "@/features/projects/validation";
import { getPublicSiteData } from "@/features/profile/queries";
import { renderMarkdown } from "@/lib/markdown/render";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = projectSlugSchema.safeParse(slug);
  if (!parsed.success) return {};
  const project = await getPublishedProjectBySlug(parsed.data);
  if (!project) return {};
  const ogImageUrl = await getMediaUrlById(project.ogMediaId) ?? project.ogImageUrl;
  return { title: project.seoTitle ?? project.title, description: (project.seoDescription ?? project.summary) || undefined, alternates: project.canonicalUrl ? { canonical: project.canonicalUrl } : undefined, openGraph: ogImageUrl ? { images: [{ url: ogImageUrl }] } : undefined };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const parsed = projectSlugSchema.safeParse(slug);
  if (!parsed.success) notFound();
  const [navigation, project, site] = await Promise.all([getPublicNavigation(), getPublishedProjectBySlug(parsed.data), getPublicSiteData()]);
  if (!project) notFound();
  const [html, managedCoverUrl] = await Promise.all([renderMarkdown(project.contentMarkdown), getMediaUrlById(project.coverMediaId)]);
  return <PublicShell navigation={navigation} site={site}><ProjectPresentation coverImageUrl={managedCoverUrl ?? project.coverImageUrl} demoUrl={project.demoUrl} endedOn={project.endedOn} externalUrl={project.externalUrl} githubUrl={project.githubUrl} html={html} projectStatus={project.projectStatus} startedOn={project.startedOn} summary={project.summary} technologies={project.technologies} title={project.title} /></PublicShell>;
}
