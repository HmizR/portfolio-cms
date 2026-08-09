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

export function generateSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export function isReservedPageSlug(value: string): boolean {
  return RESERVED_PAGE_SLUGS.has(value);
}
