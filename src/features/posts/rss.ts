import type { PostRecord } from "@/features/posts/queries";

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&apos;",
  })[character] ?? character);
}

export function generateRssFeed({ baseUrl, description, posts, title }: {
  baseUrl: string;
  description: string;
  posts: PostRecord[];
  title: string;
}): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const lastBuildDate = posts[0]?.publishedAt ?? new Date(0);
  const items = posts.map((post) => {
    const url = `${normalizedBaseUrl}/posts/${post.slug}`;
    return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${escapeXml(tag.name)}</category>`).join("\n      ")}
    </item>`;
  }).join("\n    ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(normalizedBaseUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${normalizedBaseUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}
