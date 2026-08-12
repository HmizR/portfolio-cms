import Link from "next/link";
import type { ReactNode } from "react";

import { MarkdownContent } from "@/components/markdown/markdown-content";
import type { PublicHomepageData } from "@/features/homepage/queries";
import { renderMarkdown } from "@/lib/markdown/render";

function formatDate(value: Date | string | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, { month: "short", year: "numeric", timeZone: "UTC" });
}

export async function HomepagePresentation({ data }: { data: PublicHomepageData }) {
  const markdownSections = data.sections.filter((section) => section.sectionType === "markdown");
  const markdownHtml = new Map(await Promise.all(markdownSections.map(async (section) => [section.sectionType, await renderMarkdown(section.configuration.markdown)] as const)));
  const educationHtml = new Map(await Promise.all(data.education.map(async (item) => [item.id, await renderMarkdown(item.descriptionMarkdown)] as const)));
  const experienceHtml = new Map(await Promise.all(data.experience.map(async (item) => [item.id, await renderMarkdown(item.descriptionMarkdown)] as const)));
  return <article className="homepage-sections">{data.sections.map((section) => {
    if (section.sectionType === "markdown") return <HomeSection key={section.sectionType} title={section.configuration.heading}><MarkdownContent html={markdownHtml.get(section.sectionType) ?? ""} /></HomeSection>;
    if (section.sectionType === "featured_projects") {
      const items = data.projects.filter((item) => item.isFeatured).slice(0, section.configuration.itemCount);
      if (!items.length) return null;
      return <HomeSection key={section.sectionType} title={section.configuration.heading}><ol className="divide-y divide-slate-200 border-y border-slate-200">{items.map((item) => <li className="py-5" key={item.id}><h3 className="font-serif text-xl font-semibold"><Link className="hover:text-[var(--public-accent)]" href={`/projects/${item.slug}`}>{item.title}</Link></h3>{item.summary ? <p className="mt-2 leading-7 text-slate-600">{item.summary}</p> : null}{item.technologies.length ? <p className="mt-2 text-sm text-slate-500">{item.technologies.map((technology) => technology.name).join(" · ")}</p> : null}</li>)}</ol></HomeSection>;
    }
    if (section.sectionType === "recent_posts") {
      const items = data.posts.slice(0, section.configuration.itemCount);
      if (!items.length) return null;
      return <HomeSection key={section.sectionType} title={section.configuration.heading}><ol className="divide-y divide-slate-200 border-y border-slate-200">{items.map((item) => <li className="py-5" key={item.id}><p className="text-sm text-slate-500">{formatDate(item.publishedAt)}</p><h3 className="mt-1 font-serif text-xl font-semibold"><Link className="hover:text-[var(--public-accent)]" href={`/posts/${item.slug}`}>{item.title}</Link></h3>{item.excerpt ? <p className="mt-2 leading-7 text-slate-600">{item.excerpt}</p> : null}</li>)}</ol></HomeSection>;
    }
    if (section.sectionType === "featured_publications") {
      const items = data.publications.filter((item) => item.isFeatured).slice(0, section.configuration.itemCount);
      if (!items.length) return null;
      return <HomeSection key={section.sectionType} title={section.configuration.heading}><ol className="space-y-5">{items.map((item) => <li key={item.id}><h3 className="font-serif text-xl font-semibold"><Link className="hover:text-[var(--public-accent)]" href={`/publications/${item.slug}`}>{item.title}</Link></h3>{item.authors.length ? <p className="mt-1 text-sm text-slate-600">{item.authors.map((author) => author.name).join(", ")}</p> : null}<p className="mt-1 text-sm italic text-slate-500">{[item.venue, item.publicationDate ? new Date(`${item.publicationDate}T00:00:00Z`).getUTCFullYear() : null].filter(Boolean).join(" · ")}</p></li>)}</ol></HomeSection>;
    }
    if (section.sectionType === "education") {
      const items = data.education.slice(0, section.configuration.itemCount); if (!items.length) return null;
      return <HomeSection key={section.sectionType} title={section.configuration.heading}>{items.map((item) => <Timeline descriptionHtml={educationHtml.get(item.id) ?? ""} heading={[item.degree, item.field].filter(Boolean).join(" in ")} key={item.id} organization={item.institution} period={[formatDate(item.startDate), item.isCurrent ? "Present" : formatDate(item.endDate)].filter(Boolean).join(" – ")} />)}</HomeSection>;
    }
    if (section.sectionType === "experience") {
      const items = data.experience.slice(0, section.configuration.itemCount); if (!items.length) return null;
      return <HomeSection key={section.sectionType} title={section.configuration.heading}>{items.map((item) => <Timeline descriptionHtml={experienceHtml.get(item.id) ?? ""} heading={item.position} key={item.id} organization={item.organization} period={[formatDate(item.startDate), item.isCurrent ? "Present" : formatDate(item.endDate)].filter(Boolean).join(" – ")} />)}</HomeSection>;
    }
    const page = section.configuration.pageId ? data.pages.get(section.configuration.pageId) : null;
    if (!page) return null;
    return <HomeSection key={section.sectionType} title={section.configuration.heading}><h3 className="font-serif text-xl font-semibold"><Link className="hover:text-[var(--public-accent)]" href={`/${page.slug}`}>{page.title}</Link></h3>{page.excerpt ? <p className="mt-3 leading-7 text-slate-600">{page.excerpt}</p> : null}<Link className="mt-4 inline-block text-sm font-semibold text-[var(--public-accent)] underline underline-offset-4" href={`/${page.slug}`}>Read more</Link></HomeSection>;
  })}</article>;
}

function HomeSection({ children, title }: { children: ReactNode; title: string }) { return <section className="border-b border-slate-200 py-9 first:pt-0 last:border-b-0 sm:py-11"><h2 className="mb-5 font-serif text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>{children}</section>; }
function Timeline({ descriptionHtml, heading, organization, period }: { descriptionHtml: string; heading: string; organization: string; period: string }) { return <article className="mb-6 last:mb-0"><div className="flex flex-wrap items-baseline justify-between gap-x-4"><div><h3 className="font-semibold text-slate-950">{heading}</h3><p className="text-sm text-slate-600">{organization}</p></div>{period ? <p className="text-sm text-slate-500">{period}</p> : null}</div>{descriptionHtml ? <MarkdownContent className="mt-2 text-sm" html={descriptionHtml} /> : null}</article>; }
