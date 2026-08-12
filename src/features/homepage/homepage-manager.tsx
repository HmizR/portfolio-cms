"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { saveHomepageConfigurationAction, renderHomepageMarkdownAction } from "@/features/homepage/actions";
import type { HomepagePageOption } from "@/features/homepage/queries";
import type { HomepageSectionInput, HomepageSectionType } from "@/features/homepage/validation";
import type { MediaRecord } from "@/features/media/queries";

const labels: Record<HomepageSectionType, string> = { markdown: "Markdown introduction", featured_projects: "Featured projects", recent_posts: "Recent posts", featured_publications: "Featured publications", education: "Education", experience: "Experience", page_excerpt: "Custom page excerpt" };

function withHeading(section: HomepageSectionInput, heading: string): HomepageSectionInput {
  switch (section.sectionType) {
    case "markdown": return { ...section, configuration: { ...section.configuration, heading } };
    case "featured_projects": return { ...section, configuration: { ...section.configuration, heading } };
    case "recent_posts": return { ...section, configuration: { ...section.configuration, heading } };
    case "featured_publications": return { ...section, configuration: { ...section.configuration, heading } };
    case "education": return { ...section, configuration: { ...section.configuration, heading } };
    case "experience": return { ...section, configuration: { ...section.configuration, heading } };
    case "page_excerpt": return { ...section, configuration: { ...section.configuration, heading } };
  }
}

function withItemCount(section: Exclude<HomepageSectionInput, { sectionType: "markdown" | "page_excerpt" }>, itemCount: number): HomepageSectionInput {
  return { ...section, configuration: { ...section.configuration, itemCount } };
}

export function HomepageManager({ initialPreviewHtml, initialSections, media, pages }: { initialPreviewHtml: string; initialSections: HomepageSectionInput[]; media: MediaRecord[]; pages: HomepagePageOption[] }) {
  const [sections, setSections] = useState(initialSections);
  const [state, action, pending] = useActionState(saveHomepageConfigurationAction, {});
  function move(index: number, offset: -1 | 1) { const target = index + offset; if (target < 0 || target >= sections.length) return; setSections((current) => { const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; }); }
  function replace(next: HomepageSectionInput) { setSections((current) => current.map((section) => section.sectionType === next.sectionType ? next : section)); }
  function toggle(section: HomepageSectionInput) { replace({ ...section, isVisible: !section.isVisible }); }
  const serialized = JSON.stringify({ sections });
  return <form action={action} aria-label="Configure homepage" className="space-y-6"><input name="configuration" type="hidden" value={serialized} />
    <ol className="space-y-5">{sections.map((section, index) => <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" data-section-type={section.sectionType} key={section.sectionType}>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4"><div className="min-w-0 flex-1"><h2 className="font-serif text-xl font-semibold">{labels[section.sectionType]}</h2><p className="text-xs text-slate-500">{section.isVisible ? "Visible publicly" : "Hidden publicly"}</p></div><Button aria-label={`Move ${labels[section.sectionType]} up`} className="bg-transparent px-2 text-slate-700 shadow-none hover:bg-slate-100" disabled={index === 0} onClick={() => move(index, -1)} type="button"><ArrowUp className="size-4" /></Button><Button aria-label={`Move ${labels[section.sectionType]} down`} className="bg-transparent px-2 text-slate-700 shadow-none hover:bg-slate-100" disabled={index === sections.length - 1} onClick={() => move(index, 1)} type="button"><ArrowDown className="size-4" /></Button><Button aria-label={`${section.isVisible ? "Hide" : "Show"} ${labels[section.sectionType]}`} className="min-w-24 border border-slate-300 bg-white text-slate-800 shadow-none hover:bg-slate-100" onClick={() => toggle(section)} type="button">{section.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}{section.isVisible ? "Visible" : "Hidden"}</Button></div>
      <div className="mt-5 space-y-4"><label className="block text-sm font-medium text-slate-800">Section heading<Input aria-label={`${labels[section.sectionType]} heading`} className="mt-1.5" maxLength={100} onChange={(event) => replace(withHeading(section, event.target.value))} value={section.configuration.heading} /></label>
      {section.sectionType === "markdown" ? <MarkdownEditor initialPreviewHtml={initialPreviewHtml} media={media} onChange={(markdown) => replace({ ...section, configuration: { ...section.configuration, markdown } })} previewAction={renderHomepageMarkdownAction} value={section.configuration.markdown} /> : null}
      {section.sectionType !== "markdown" && section.sectionType !== "page_excerpt" ? <label className="block text-sm font-medium text-slate-800">Maximum items<Input aria-label={`${labels[section.sectionType]} item count`} className="mt-1.5 max-w-32" max={12} min={1} onChange={(event) => replace(withItemCount(section, Number(event.target.value)))} type="number" value={section.configuration.itemCount} /></label> : null}
      {section.sectionType === "page_excerpt" ? <label className="block text-sm font-medium text-slate-800">Published page<Select aria-label="Custom page excerpt page" className="mt-1.5" onChange={(event) => replace({ ...section, configuration: { ...section.configuration, pageId: event.target.value || null } })} value={section.configuration.pageId ?? ""}><option value="">Choose a published page</option>{pages.map((page) => <option key={page.id} value={page.id}>{page.title}</option>)}</Select></label> : null}</div>
    </li>)}</ol>
    <div className="flex items-center justify-between gap-4"><p aria-live="polite" className={`text-sm ${state.status === "error" ? "text-red-700" : "text-emerald-700"}`}>{state.message}</p><Button disabled={pending} type="submit">{pending ? "Saving…" : "Save homepage"}</Button></div>
  </form>;
}
