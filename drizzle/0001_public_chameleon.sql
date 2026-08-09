CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"singleton_key" integer DEFAULT 1 NOT NULL,
	"full_name" text NOT NULL,
	"headline" text DEFAULT '' NOT NULL,
	"short_biography" text DEFAULT '' NOT NULL,
	"long_biography" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"public_email" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_singleton_key_check" CHECK ("profiles"."singleton_key" = 1)
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"singleton_key" integer DEFAULT 1 NOT NULL,
	"site_title" text NOT NULL,
	"site_description" text DEFAULT '' NOT NULL,
	"accent_color" text DEFAULT 'teal' NOT NULL,
	"content_width" text DEFAULT 'standard' NOT NULL,
	"profile_image_shape" text DEFAULT 'circle' NOT NULL,
	"typography" text DEFAULT 'classic' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_singleton_key_check" CHECK ("site_settings"."singleton_key" = 1),
	CONSTRAINT "site_settings_accent_color_check" CHECK ("site_settings"."accent_color" in ('teal', 'blue', 'burgundy', 'violet')),
	CONSTRAINT "site_settings_content_width_check" CHECK ("site_settings"."content_width" in ('compact', 'standard', 'wide')),
	CONSTRAINT "site_settings_profile_image_shape_check" CHECK ("site_settings"."profile_image_shape" in ('circle', 'rounded', 'square')),
	CONSTRAINT "site_settings_typography_check" CHECK ("site_settings"."typography" in ('classic', 'modern'))
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"label" text NOT NULL,
	"url" text NOT NULL,
	"icon_identifier" text DEFAULT 'link' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "social_links_sort_order_check" CHECK ("social_links"."sort_order" >= 0)
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_user_id_unique" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_singleton_key_unique" ON "profiles" USING btree ("singleton_key");--> statement-breakpoint
CREATE UNIQUE INDEX "site_settings_singleton_key_unique" ON "site_settings" USING btree ("singleton_key");--> statement-breakpoint
CREATE INDEX "social_links_profile_id_index" ON "social_links" USING btree ("profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "social_links_profile_url_unique" ON "social_links" USING btree ("profile_id","url");--> statement-breakpoint
INSERT INTO "profiles" ("user_id", "full_name", "public_email")
SELECT "id", "name", "email" FROM "users" ORDER BY "created_at" LIMIT 1
ON CONFLICT ("singleton_key") DO NOTHING;--> statement-breakpoint
INSERT INTO "site_settings" ("site_title", "site_description")
SELECT "name", 'Academic and professional portfolio' FROM "users" ORDER BY "created_at" LIMIT 1
ON CONFLICT ("singleton_key") DO NOTHING;
