CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution" text NOT NULL,
	"institution_url" text,
	"degree" text NOT NULL,
	"field" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"start_date" date,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"description_markdown" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "education_institution_check" CHECK (length(trim("education"."institution")) > 0),
	CONSTRAINT "education_degree_check" CHECK (length(trim("education"."degree")) > 0),
	CONSTRAINT "education_sort_order_check" CHECK ("education"."sort_order" >= 0),
	CONSTRAINT "education_current_end_check" CHECK (not "education"."is_current" or "education"."end_date" is null),
	CONSTRAINT "education_date_range_check" CHECK ("education"."end_date" is null or "education"."start_date" is null or "education"."end_date" >= "education"."start_date")
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization" text NOT NULL,
	"organization_url" text,
	"position" text NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"start_date" date,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"description_markdown" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "experience_organization_check" CHECK (length(trim("experience"."organization")) > 0),
	CONSTRAINT "experience_position_check" CHECK (length(trim("experience"."position")) > 0),
	CONSTRAINT "experience_sort_order_check" CHECK ("experience"."sort_order" >= 0),
	CONSTRAINT "experience_current_end_check" CHECK (not "experience"."is_current" or "experience"."end_date" is null),
	CONSTRAINT "experience_date_range_check" CHECK ("experience"."end_date" is null or "experience"."start_date" is null or "experience"."end_date" >= "experience"."start_date")
);
--> statement-breakpoint
CREATE TABLE "publication_authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publication_id" uuid NOT NULL,
	"name" text NOT NULL,
	"profile_url" text,
	"position" integer NOT NULL,
	"is_owner" boolean DEFAULT false NOT NULL,
	CONSTRAINT "publication_authors_name_check" CHECK (length(trim("publication_authors"."name")) > 0),
	CONSTRAINT "publication_authors_position_check" CHECK ("publication_authors"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"abstract" text DEFAULT '' NOT NULL,
	"content_markdown" text DEFAULT '' NOT NULL,
	"draft_markdown" text,
	"publication_type" text DEFAULT 'other' NOT NULL,
	"venue" text,
	"publisher" text,
	"publication_date" date,
	"doi" text,
	"external_url" text,
	"pdf_media_id" uuid,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" text,
	"seo_description" text,
	"canonical_url" text,
	"og_media_id" uuid,
	"og_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "publications_title_check" CHECK (length(trim("publications"."title")) > 0),
	CONSTRAINT "publications_type_check" CHECK ("publications"."publication_type" in ('journal', 'conference', 'preprint', 'thesis', 'book', 'chapter', 'report', 'other')),
	CONSTRAINT "publications_status_check" CHECK ("publications"."status" in ('draft', 'published', 'archived')),
	CONSTRAINT "publications_published_at_check" CHECK ("publications"."status" <> 'published' or "publications"."published_at" is not null)
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_name_check" CHECK (length(trim("skills"."name")) > 0),
	CONSTRAINT "skills_category_check" CHECK (length(trim("skills"."category")) > 0),
	CONSTRAINT "skills_sort_order_check" CHECK ("skills"."sort_order" >= 0)
);
--> statement-breakpoint
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "publications_pdf_media_id_media_id_fk" FOREIGN KEY ("pdf_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "publications_og_media_id_media_id_fk" FOREIGN KEY ("og_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "education_sort_order_index" ON "education" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "experience_sort_order_index" ON "experience" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "publication_authors_publication_position_unique" ON "publication_authors" USING btree ("publication_id","position");--> statement-breakpoint
CREATE INDEX "publication_authors_publication_id_index" ON "publication_authors" USING btree ("publication_id");--> statement-breakpoint
CREATE UNIQUE INDEX "publications_slug_unique" ON "publications" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "publications_status_date_index" ON "publications" USING btree ("status","publication_date");--> statement-breakpoint
CREATE INDEX "publications_status_featured_index" ON "publications" USING btree ("status","is_featured");--> statement-breakpoint
CREATE INDEX "publications_pdf_media_id_index" ON "publications" USING btree ("pdf_media_id");--> statement-breakpoint
CREATE INDEX "publications_og_media_id_index" ON "publications" USING btree ("og_media_id");--> statement-breakpoint
CREATE UNIQUE INDEX "skills_category_name_unique" ON "skills" USING btree (lower("category"),lower("name"));--> statement-breakpoint
CREATE INDEX "skills_category_sort_order_index" ON "skills" USING btree ("category","sort_order");