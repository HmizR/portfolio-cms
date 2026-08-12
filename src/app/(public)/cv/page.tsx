import type { Metadata } from "next";
import { connection } from "next/server";
import { PublicShell } from "@/components/public/public-shell";
import { CvPresentation } from "@/features/cv/cv-presentation";
import { CvPrintButton } from "@/features/cv/print-button";
import { getPublicCvConfiguration } from "@/features/cv/queries";
import { listEducation } from "@/features/education/queries";
import { listExperience } from "@/features/experience/queries";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteData } from "@/features/profile/queries";
import { listPublishedProjects } from "@/features/projects/queries";
import { listPublishedPublications } from "@/features/publications/queries";
import { listSkills } from "@/features/skills/queries";
import { buildMetadata } from "@/features/seo/metadata";
import { getGlobalSeoSettings } from "@/features/seo/queries";
export async function generateMetadata(): Promise<Metadata> { const seo = await getGlobalSeoSettings(); return buildMetadata(seo, { canonicalPath: "/cv", title: "CV", description: `Curriculum vitae for ${seo.siteTitle}.` }); }
export default async function CvPage() { await connection(); const [configuration, education, experience, navigation, projects, publications, site, skills] = await Promise.all([getPublicCvConfiguration(), listEducation(), listExperience(), getPublicNavigation(), listPublishedProjects(), listPublishedPublications(), getPublicSiteData(), listSkills()]); const byId = new Map(projects.map((project) => [project.id, project])); const selectedProjects = configuration.projectIds.flatMap((id) => { const project = byId.get(id); return project ? [project] : []; }); return <PublicShell navigation={navigation} printLayout="cv" showSidebar={false} site={site}><div className="mb-8 flex justify-end"><CvPrintButton /></div><CvPresentation education={education} experience={experience} projects={selectedProjects} publications={publications} sections={configuration.sections} site={site} skills={skills} /></PublicShell>; }
