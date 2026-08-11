import { listPublishedPosts } from "@/features/posts/queries";
import { generateRssFeed } from "@/features/posts/rss";
import { getPublicSiteData } from "@/features/profile/queries";
import { env } from "@/lib/env/server";

export async function GET() {
  const [posts, site] = await Promise.all([listPublishedPosts(), getPublicSiteData()]);
  const xml = generateRssFeed({
    baseUrl: env.APP_URL,
    description: site.appearance.siteDescription || `Recent posts from ${site.appearance.siteTitle}.`,
    posts,
    title: site.appearance.siteTitle,
  });
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
