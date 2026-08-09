import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles, siteSettings, socialLinks } from "@/db/schema";
import { defaultAppearance } from "@/features/profile/defaults";
import type { AppearanceInput, ProfileInput } from "@/features/profile/validation";

interface AdminIdentity {
  id: string;
  name: string;
  email: string;
}

export async function initializePortfolioForAdmin(admin: AdminIdentity): Promise<void> {
  await db.transaction(async (transaction) => {
    await transaction
      .insert(profiles)
      .values({
        userId: admin.id,
        fullName: admin.name,
        publicEmail: admin.email,
      })
      .onConflictDoNothing({ target: profiles.singletonKey });

    await transaction
      .insert(siteSettings)
      .values({ ...defaultAppearance, siteTitle: admin.name })
      .onConflictDoNothing({ target: siteSettings.singletonKey });
  });
}

export async function saveProfile(userId: string, input: ProfileInput): Promise<void> {
  await db.transaction(async (transaction) => {
    const [profile] = await transaction
      .insert(profiles)
      .values({
        userId,
        fullName: input.fullName,
        headline: input.headline,
        shortBiography: input.shortBiography,
        longBiography: input.longBiography,
        location: input.location,
        publicEmail: input.publicEmail,
        avatarUrl: input.avatarUrl,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profiles.singletonKey,
        set: {
          userId,
          fullName: input.fullName,
          headline: input.headline,
          shortBiography: input.shortBiography,
          longBiography: input.longBiography,
          location: input.location,
          publicEmail: input.publicEmail,
          avatarUrl: input.avatarUrl,
          updatedAt: new Date(),
        },
      })
      .returning({ id: profiles.id });

    if (!profile) {
      throw new Error("Profile update did not return a profile.");
    }

    await transaction.delete(socialLinks).where(eq(socialLinks.profileId, profile.id));

    if (input.socialLinks.length > 0) {
      await transaction.insert(socialLinks).values(
        input.socialLinks.map((link, sortOrder) => ({
          profileId: profile.id,
          platform: link.platform,
          label: link.label,
          url: link.url,
          iconIdentifier: link.iconIdentifier,
          isVisible: link.isVisible,
          sortOrder,
        })),
      );
    }
  });
}

export async function saveAppearance(input: AppearanceInput): Promise<void> {
  await db
    .insert(siteSettings)
    .values(input)
    .onConflictDoUpdate({
      target: siteSettings.singletonKey,
      set: { ...input, updatedAt: new Date() },
    });
}
