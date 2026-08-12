import type { MetadataRoute } from "next";

import { listPublishedPosts } from "@/features/posts/queries";
import { listPublishedProjects } from "@/features/projects/queries";
import { listPublishedPublications } from "@/features/publications/queries";
import { listPublishedPages } from "@/features/seo/sitemap-queries";
import { absoluteUrl } from "@/features/seo/metadata";
import { getGlobalSeoSettings } from "@/features/seo/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts, projects, publications, seo] = await Promise.all([listPublishedPages(), listPublishedPosts(), listPublishedProjects(), listPublishedPublications(), getGlobalSeoSettings()]);
  const entry = (path: string, lastModified?: Date): MetadataRoute.Sitemap[number] => ({ url: absoluteUrl(seo.baseUrl, path), lastModified });
  return [entry("/"), entry("/posts"), entry("/projects"), entry("/publications"), entry("/cv"), ...pages.map((item) => entry(`/${item.slug}`, item.updatedAt)), ...posts.map((item) => entry(`/posts/${item.slug}`, item.updatedAt)), ...projects.map((item) => entry(`/projects/${item.slug}`, item.updatedAt)), ...publications.map((item) => entry(`/publications/${item.slug}`, item.updatedAt))];
}
