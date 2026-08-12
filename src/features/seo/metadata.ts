import type { Metadata } from "next";

export interface SeoMetadataInput {
  canonicalPath: string;
  canonicalUrl?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  kind?: "article" | "website";
  publishedAt?: Date | null;
  tags?: string[];
  title?: string | null;
}

export interface SeoDefaults {
  baseUrl: string;
  defaultDescription: string;
  defaultOgImageUrl: string | null;
  siteTitle: string;
  twitterHandle: string | null;
}

export function absoluteUrl(baseUrl: string, path: string): string {
  return new URL(path, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

export function buildMetadata(defaults: SeoDefaults, input: SeoMetadataInput): Metadata {
  const title = input.title?.trim() || defaults.siteTitle;
  const description = input.description?.trim() || defaults.defaultDescription || undefined;
  const canonical = input.canonicalUrl || absoluteUrl(defaults.baseUrl, input.canonicalPath);
  const image = input.imageUrl || defaults.defaultOgImageUrl;
  const images = image ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: input.kind ?? "website",
      title,
      description,
      url: canonical,
      siteName: defaults.siteTitle,
      images,
      ...(input.kind === "article" ? { publishedTime: input.publishedAt?.toISOString(), tags: input.tags } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
      creator: defaults.twitterHandle ?? undefined,
      site: defaults.twitterHandle ?? undefined,
    },
  };
}

export function serializeJsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function websiteJsonLd(defaults: SeoDefaults): object {
  return { "@context": "https://schema.org", "@type": "WebSite", name: defaults.siteTitle, description: defaults.defaultDescription || undefined, url: absoluteUrl(defaults.baseUrl, "/") };
}

export function personJsonLd(defaults: SeoDefaults, person: { name: string; description: string; image: string | null; sameAs: string[] }): object {
  return { "@context": "https://schema.org", "@type": "Person", name: person.name, description: person.description || undefined, image: person.image || undefined, sameAs: person.sameAs.length ? person.sameAs : undefined, url: absoluteUrl(defaults.baseUrl, "/") };
}

export function articleJsonLd(defaults: SeoDefaults, input: { path: string; title: string; description: string; image: string | null; publishedAt: Date | null; modifiedAt: Date; authorName: string; scholarly?: boolean }): object {
  const url = absoluteUrl(defaults.baseUrl, input.path);
  return { "@context": "https://schema.org", "@type": input.scholarly ? "ScholarlyArticle" : "BlogPosting", headline: input.title, description: input.description || undefined, image: input.image || undefined, datePublished: input.publishedAt?.toISOString(), dateModified: input.modifiedAt.toISOString(), mainEntityOfPage: url, url, author: { "@type": "Person", name: input.authorName } };
}
