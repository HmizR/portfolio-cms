import type { NavigationType } from "@/features/navigation/validation";

const systemDestinations: Record<Exclude<NavigationType, "page" | "external">, string> = {
  posts: "/posts",
  projects: "/projects",
  publications: "/publications",
  cv: "/cv",
};

export interface PublicNavigationItem {
  href: string;
  id: string;
  label: string;
  openNewTab: boolean;
}

export function resolveNavigationHref(input: {
  pageSlug: string | null;
  pageStatus: string | null;
  type: NavigationType;
  url: string | null;
}): string | null {
  if (input.type === "page") {
    return input.pageSlug && input.pageStatus === "published" ? `/${input.pageSlug}` : null;
  }
  if (input.type === "external") return input.url;
  return systemDestinations[input.type];
}

export function describeNavigationDestination(input: {
  pageTitle: string | null;
  type: NavigationType;
  url: string | null;
}): string {
  if (input.type === "page") return input.pageTitle ?? "Missing page";
  if (input.type === "external") return input.url ?? "Missing URL";
  return systemDestinations[input.type];
}
