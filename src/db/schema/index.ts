import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    singletonKey: integer("singleton_key").default(1).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_singleton_key_unique").on(table.singletonKey),
    check("users_singleton_key_check", sql`${table.singletonKey} = 1`),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("sessions_token_unique").on(table.token),
    index("sessions_user_id_index").on(table.userId),
    index("sessions_expires_at_index").on(table.expiresAt),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [
    index("accounts_user_id_index").on(table.userId),
    uniqueIndex("accounts_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("verifications_identifier_index").on(table.identifier)],
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    count: integer("count").notNull(),
    lastRequest: bigint("last_request", { mode: "number" }).notNull(),
  },
  (table) => [uniqueIndex("rate_limits_key_unique").on(table.key)],
);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    singletonKey: integer("singleton_key").default(1).notNull(),
    fullName: text("full_name").notNull(),
    headline: text("headline").default("").notNull(),
    shortBiography: text("short_biography").default("").notNull(),
    longBiography: text("long_biography").default("").notNull(),
    location: text("location").default("").notNull(),
    publicEmail: text("public_email"),
    avatarUrl: text("avatar_url"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("profiles_user_id_unique").on(table.userId),
    uniqueIndex("profiles_singleton_key_unique").on(table.singletonKey),
    check("profiles_singleton_key_check", sql`${table.singletonKey} = 1`),
  ],
);

export const socialLinks = pgTable(
  "social_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(),
    label: text("label").notNull(),
    url: text("url").notNull(),
    iconIdentifier: text("icon_identifier").default("link").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    index("social_links_profile_id_index").on(table.profileId),
    uniqueIndex("social_links_profile_url_unique").on(table.profileId, table.url),
    check("social_links_sort_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const siteSettings = pgTable(
  "site_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    singletonKey: integer("singleton_key").default(1).notNull(),
    siteTitle: text("site_title").notNull(),
    siteDescription: text("site_description").default("").notNull(),
    accentColor: text("accent_color").default("teal").notNull(),
    contentWidth: text("content_width").default("standard").notNull(),
    profileImageShape: text("profile_image_shape").default("circle").notNull(),
    typography: text("typography").default("classic").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("site_settings_singleton_key_unique").on(table.singletonKey),
    check("site_settings_singleton_key_check", sql`${table.singletonKey} = 1`),
    check(
      "site_settings_accent_color_check",
      sql`${table.accentColor} in ('teal', 'blue', 'burgundy', 'violet')`,
    ),
    check(
      "site_settings_content_width_check",
      sql`${table.contentWidth} in ('compact', 'standard', 'wide')`,
    ),
    check(
      "site_settings_profile_image_shape_check",
      sql`${table.profileImageShape} in ('circle', 'rounded', 'square')`,
    ),
    check(
      "site_settings_typography_check",
      sql`${table.typography} in ('classic', 'modern')`,
    ),
  ],
);

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").default("").notNull(),
    contentMarkdown: text("content_markdown").default("").notNull(),
    draftMarkdown: text("draft_markdown"),
    status: text("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    showTitle: boolean("show_title").default(true).notNull(),
    showSidebar: boolean("show_sidebar").default(true).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    ogImageUrl: text("og_image_url"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("pages_slug_unique").on(table.slug),
    index("pages_status_published_at_index").on(table.status, table.publishedAt),
    check("pages_status_check", sql`${table.status} in ('draft', 'published', 'archived')`),
  ],
);

export const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
  rateLimit: rateLimits,
};
