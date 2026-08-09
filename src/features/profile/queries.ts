import "server-only";

import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { profiles, siteSettings, socialLinks } from "@/db/schema";
import { defaultAppearance } from "@/features/profile/defaults";
import {
  appearanceSchema,
  type AppearanceInput,
  type ProfileInput,
  type SocialLinkInput,
} from "@/features/profile/validation";

export interface ProfileEditorData extends Omit<ProfileInput, "socialLinks"> {
  socialLinks: SocialLinkInput[];
}

export interface PublicSiteData {
  appearance: AppearanceInput;
  owner: {
    avatarUrl: string | null;
    biography: string;
    email: string | null;
    headline: string;
    location: string;
    name: string;
  };
  socialLinks: Array<{ href: string; label: string }>;
}

export const PUBLIC_SITE_CACHE_TAG = "public-site-settings";

export async function getProfileEditorData(
  fallback: { name: string; email: string },
): Promise<ProfileEditorData> {
  const [profile] = await db.select().from(profiles).limit(1);

  if (!profile) {
    return {
      fullName: fallback.name,
      headline: "",
      shortBiography: "",
      longBiography: "",
      location: "",
      publicEmail: fallback.email,
      avatarUrl: null,
      socialLinks: [],
    };
  }

  const links = await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.profileId, profile.id))
    .orderBy(asc(socialLinks.sortOrder));

  return {
    fullName: profile.fullName,
    headline: profile.headline,
    shortBiography: profile.shortBiography,
    longBiography: profile.longBiography,
    location: profile.location,
    publicEmail: profile.publicEmail,
    avatarUrl: profile.avatarUrl,
    socialLinks: links.map((link) => ({
      platform: link.platform,
      label: link.label,
      url: link.url,
      iconIdentifier: link.iconIdentifier,
      isVisible: link.isVisible,
    })),
  };
}

export async function getAppearanceEditorData(): Promise<AppearanceInput> {
  const [settings] = await db.select().from(siteSettings).limit(1);
  if (!settings) return defaultAppearance;

  return appearanceFromRow(settings);
}

function appearanceFromRow(settings: typeof siteSettings.$inferSelect): AppearanceInput {
  return appearanceSchema.parse({
    siteTitle: settings.siteTitle,
    siteDescription: settings.siteDescription,
    accentColor: settings.accentColor,
    contentWidth: settings.contentWidth,
    profileImageShape: settings.profileImageShape,
    typography: settings.typography,
  });
}

const getCachedPublicSiteData = unstable_cache(async (): Promise<PublicSiteData> => {
  const [profile] = await db.select().from(profiles).limit(1);
  const [settings] = await db.select().from(siteSettings).limit(1);
  const appearance = settings ? appearanceFromRow(settings) : defaultAppearance;

  if (!profile) {
    return {
      appearance,
      owner: {
        avatarUrl: null,
        biography: "Complete first-time setup to publish an owner profile.",
        email: null,
        headline: "Academic and professional portfolio",
        location: "",
        name: "Portfolio owner",
      },
      socialLinks: [],
    };
  }

  const links = await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.profileId, profile.id))
    .orderBy(asc(socialLinks.sortOrder));

  return {
    appearance,
    owner: {
      avatarUrl: profile.avatarUrl,
      biography: profile.shortBiography,
      email: profile.publicEmail,
      headline: profile.headline,
      location: profile.location,
      name: profile.fullName,
    },
    socialLinks: links
      .filter((link) => link.isVisible)
      .map((link) => ({ href: link.url, label: link.label })),
  };
}, [PUBLIC_SITE_CACHE_TAG], { tags: [PUBLIC_SITE_CACHE_TAG] });

export const getPublicSiteData = cache(async (): Promise<PublicSiteData> => {
  await connection();
  return getCachedPublicSiteData();
});
