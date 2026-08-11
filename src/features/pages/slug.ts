export const RESERVED_PAGE_SLUGS = new Set([
  "admin",
  "api",
  "cv",
  "feed",
  "login",
  "posts",
  "preview",
  "projects",
  "publications",
  "setup",
]);

export { generateSlug } from "@/lib/slug";

export function isReservedPageSlug(value: string): boolean {
  return RESERVED_PAGE_SLUGS.has(value);
}
