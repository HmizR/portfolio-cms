import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
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

export const media = pgTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storageKey: text("storage_key").notNull(),
    filename: text("filename").notNull(),
    originalFilename: text("original_filename").notNull(),
    mimeType: text("mime_type").notNull(),
    fileSize: integer("file_size").notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text").default("").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("media_storage_key_unique").on(table.storageKey),
    index("media_created_at_index").on(table.createdAt),
    index("media_mime_type_index").on(table.mimeType),
    check("media_filename_check", sql`length(trim(${table.filename})) > 0`),
    check("media_original_filename_check", sql`length(trim(${table.originalFilename})) > 0`),
    check("media_file_size_check", sql`${table.fileSize} > 0`),
    check("media_dimensions_check", sql`(${table.width} is null and ${table.height} is null) or (${table.width} > 0 and ${table.height} > 0)`),
    check("media_mime_type_check", sql`${table.mimeType} in ('image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf')`),
  ],
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
    avatarMediaId: uuid("avatar_media_id").references(() => media.id, { onDelete: "set null" }),
    avatarUrl: text("avatar_url"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("profiles_user_id_unique").on(table.userId),
    uniqueIndex("profiles_singleton_key_unique").on(table.singletonKey),
    index("profiles_avatar_media_id_index").on(table.avatarMediaId),
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
    defaultOgMediaId: uuid("default_og_media_id").references(() => media.id, { onDelete: "set null" }),
    twitterHandle: text("twitter_handle"),
    accentColor: text("accent_color").default("teal").notNull(),
    contentWidth: text("content_width").default("standard").notNull(),
    profileImageShape: text("profile_image_shape").default("circle").notNull(),
    typography: text("typography").default("classic").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("site_settings_singleton_key_unique").on(table.singletonKey),
    index("site_settings_default_og_media_id_index").on(table.defaultOgMediaId),
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
    ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
    ogImageUrl: text("og_image_url"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("pages_slug_unique").on(table.slug),
    index("pages_status_published_at_index").on(table.status, table.publishedAt),
    index("pages_og_media_id_index").on(table.ogMediaId),
    check("pages_status_check", sql`${table.status} in ('draft', 'published', 'archived')`),
  ],
);

export const homepageSections = pgTable(
  "homepage_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sectionType: text("section_type").notNull(),
    sortOrder: integer("sort_order").notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    configurationJson: jsonb("configuration_json").notNull(),
    pageId: uuid("page_id").references(() => pages.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("homepage_sections_type_unique").on(table.sectionType),
    uniqueIndex("homepage_sections_sort_order_unique").on(table.sortOrder),
    index("homepage_sections_page_id_index").on(table.pageId),
    check("homepage_sections_sort_order_check", sql`${table.sortOrder} >= 0`),
    check("homepage_sections_type_check", sql`${table.sectionType} in ('markdown', 'featured_projects', 'recent_posts', 'featured_publications', 'education', 'experience', 'page_excerpt')`),
    check("homepage_sections_page_shape_check", sql`${table.sectionType} = 'page_excerpt' or ${table.pageId} is null`),
  ],
);

export const navigationItems = pgTable(
  "navigation_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    label: text("label").notNull(),
    type: text("type").notNull(),
    pageId: uuid("page_id").references(() => pages.id, { onDelete: "cascade" }),
    url: text("url"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    openNewTab: boolean("open_new_tab").default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    index("navigation_items_sort_order_index").on(table.sortOrder),
    index("navigation_items_page_id_index").on(table.pageId),
    check("navigation_items_label_check", sql`length(trim(${table.label})) > 0`),
    check("navigation_items_sort_order_check", sql`${table.sortOrder} >= 0`),
    check(
      "navigation_items_destination_check",
      sql`(
        (${table.type} = 'page' and ${table.pageId} is not null and ${table.url} is null)
        or (${table.type} = 'external' and ${table.pageId} is null and ${table.url} is not null)
        or (${table.type} in ('posts', 'projects', 'publications', 'cv') and ${table.pageId} is null and ${table.url} is null)
      )`,
    ),
  ],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").default("").notNull(),
    contentMarkdown: text("content_markdown").default("").notNull(),
    draftMarkdown: text("draft_markdown"),
    coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    coverImageUrl: text("cover_image_url"),
    status: text("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
    ogImageUrl: text("og_image_url"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("posts_slug_unique").on(table.slug),
    index("posts_status_published_at_index").on(table.status, table.publishedAt),
    index("posts_cover_media_id_index").on(table.coverMediaId),
    index("posts_og_media_id_index").on(table.ogMediaId),
    check("posts_title_check", sql`length(trim(${table.title})) > 0`),
    check("posts_status_check", sql`${table.status} in ('draft', 'published', 'archived')`),
    check(
      "posts_published_at_check",
      sql`${table.status} <> 'published' or ${table.publishedAt} is not null`,
    ),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tags_name_unique").on(sql`lower(${table.name})`),
    uniqueIndex("tags_slug_unique").on(table.slug),
    check("tags_name_check", sql`length(trim(${table.name})) > 0`),
  ],
);

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId], name: "post_tags_post_id_tag_id_pk" }),
    index("post_tags_tag_id_index").on(table.tagId),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary").default("").notNull(),
    contentMarkdown: text("content_markdown").default("").notNull(),
    draftMarkdown: text("draft_markdown"),
    coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    coverImageUrl: text("cover_image_url"),
    githubUrl: text("github_url"),
    demoUrl: text("demo_url"),
    externalUrl: text("external_url"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    projectStatus: text("project_status").default("planned").notNull(),
    startedOn: date("started_on"),
    endedOn: date("ended_on"),
    status: text("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
    ogImageUrl: text("og_image_url"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("projects_slug_unique").on(table.slug),
    index("projects_status_featured_index").on(table.status, table.isFeatured),
    index("projects_status_published_at_index").on(table.status, table.publishedAt),
    index("projects_cover_media_id_index").on(table.coverMediaId),
    index("projects_og_media_id_index").on(table.ogMediaId),
    check("projects_title_check", sql`length(trim(${table.title})) > 0`),
    check("projects_status_check", sql`${table.status} in ('draft', 'published', 'archived')`),
    check("projects_project_status_check", sql`${table.projectStatus} in ('planned', 'active', 'completed', 'archived')`),
    check("projects_published_at_check", sql`${table.status} <> 'published' or ${table.publishedAt} is not null`),
    check("projects_date_range_check", sql`${table.endedOn} is null or ${table.startedOn} is null or ${table.endedOn} >= ${table.startedOn}`),
  ],
);

export const technologies = pgTable(
  "technologies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("technologies_name_unique").on(sql`lower(${table.name})`),
    uniqueIndex("technologies_slug_unique").on(table.slug),
    check("technologies_name_check", sql`length(trim(${table.name})) > 0`),
  ],
);

export const projectTechnologies = pgTable(
  "project_technologies",
  {
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    technologyId: uuid("technology_id").notNull().references(() => technologies.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.technologyId], name: "project_technologies_project_id_technology_id_pk" }),
    index("project_technologies_technology_id_index").on(table.technologyId),
    check("project_technologies_sort_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const publications = pgTable(
  "publications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    abstract: text("abstract").default("").notNull(),
    contentMarkdown: text("content_markdown").default("").notNull(),
    draftMarkdown: text("draft_markdown"),
    publicationType: text("publication_type").default("other").notNull(),
    venue: text("venue"),
    publisher: text("publisher"),
    publicationDate: date("publication_date"),
    doi: text("doi"),
    externalUrl: text("external_url"),
    pdfMediaId: uuid("pdf_media_id").references(() => media.id, { onDelete: "set null" }),
    isFeatured: boolean("is_featured").default(false).notNull(),
    status: text("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
    ogImageUrl: text("og_image_url"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("publications_slug_unique").on(table.slug),
    index("publications_status_date_index").on(table.status, table.publicationDate),
    index("publications_status_featured_index").on(table.status, table.isFeatured),
    index("publications_pdf_media_id_index").on(table.pdfMediaId),
    index("publications_og_media_id_index").on(table.ogMediaId),
    check("publications_title_check", sql`length(trim(${table.title})) > 0`),
    check("publications_type_check", sql`${table.publicationType} in ('journal', 'conference', 'preprint', 'thesis', 'book', 'chapter', 'report', 'other')`),
    check("publications_status_check", sql`${table.status} in ('draft', 'published', 'archived')`),
    check("publications_published_at_check", sql`${table.status} <> 'published' or ${table.publishedAt} is not null`),
  ],
);

export const publicationAuthors = pgTable(
  "publication_authors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    publicationId: uuid("publication_id").notNull().references(() => publications.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    profileUrl: text("profile_url"),
    position: integer("position").notNull(),
    isOwner: boolean("is_owner").default(false).notNull(),
  },
  (table) => [
    uniqueIndex("publication_authors_publication_position_unique").on(table.publicationId, table.position),
    index("publication_authors_publication_id_index").on(table.publicationId),
    check("publication_authors_name_check", sql`length(trim(${table.name})) > 0`),
    check("publication_authors_position_check", sql`${table.position} >= 0`),
  ],
);

export const education = pgTable(
  "education",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    institution: text("institution").notNull(),
    institutionUrl: text("institution_url"),
    degree: text("degree").notNull(),
    field: text("field").default("").notNull(),
    location: text("location").default("").notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    isCurrent: boolean("is_current").default(false).notNull(),
    descriptionMarkdown: text("description_markdown").default("").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    index("education_sort_order_index").on(table.sortOrder),
    check("education_institution_check", sql`length(trim(${table.institution})) > 0`),
    check("education_degree_check", sql`length(trim(${table.degree})) > 0`),
    check("education_sort_order_check", sql`${table.sortOrder} >= 0`),
    check("education_current_end_check", sql`not ${table.isCurrent} or ${table.endDate} is null`),
    check("education_date_range_check", sql`${table.endDate} is null or ${table.startDate} is null or ${table.endDate} >= ${table.startDate}`),
  ],
);

export const experience = pgTable(
  "experience",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organization: text("organization").notNull(),
    organizationUrl: text("organization_url"),
    position: text("position").notNull(),
    location: text("location").default("").notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    isCurrent: boolean("is_current").default(false).notNull(),
    descriptionMarkdown: text("description_markdown").default("").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    index("experience_sort_order_index").on(table.sortOrder),
    check("experience_organization_check", sql`length(trim(${table.organization})) > 0`),
    check("experience_position_check", sql`length(trim(${table.position})) > 0`),
    check("experience_sort_order_check", sql`${table.sortOrder} >= 0`),
    check("experience_current_end_check", sql`not ${table.isCurrent} or ${table.endDate} is null`),
    check("experience_date_range_check", sql`${table.endDate} is null or ${table.startDate} is null or ${table.endDate} >= ${table.startDate}`),
  ],
);

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("skills_category_name_unique").on(sql`lower(${table.category})`, sql`lower(${table.name})`),
    index("skills_category_sort_order_index").on(table.category, table.sortOrder),
    check("skills_name_check", sql`length(trim(${table.name})) > 0`),
    check("skills_category_check", sql`length(trim(${table.category})) > 0`),
    check("skills_sort_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const cvSections = pgTable(
  "cv_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sectionType: text("section_type").notNull(),
    sortOrder: integer("sort_order").notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("cv_sections_type_unique").on(table.sectionType),
    uniqueIndex("cv_sections_sort_order_unique").on(table.sortOrder),
    check("cv_sections_type_check", sql`${table.sectionType} in ('profile', 'education', 'experience', 'projects', 'publications', 'skills')`),
    check("cv_sections_sort_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const cvProjectSelections = pgTable(
  "cv_project_selections",
  {
    cvSectionId: uuid("cv_section_id").notNull().references(() => cvSections.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.cvSectionId, table.projectId], name: "cv_project_selections_section_project_pk" }),
    uniqueIndex("cv_project_selections_section_order_unique").on(table.cvSectionId, table.sortOrder),
    index("cv_project_selections_project_id_index").on(table.projectId),
    check("cv_project_selections_sort_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
  rateLimit: rateLimits,
};
