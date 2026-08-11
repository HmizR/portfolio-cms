CREATE TABLE "project_technologies" (
	"project_id" uuid NOT NULL,
	"technology_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_technologies_project_id_technology_id_pk" PRIMARY KEY("project_id","technology_id"),
	CONSTRAINT "project_technologies_sort_order_check" CHECK ("project_technologies"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"content_markdown" text DEFAULT '' NOT NULL,
	"draft_markdown" text,
	"cover_image_url" text,
	"github_url" text,
	"demo_url" text,
	"external_url" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"project_status" text DEFAULT 'planned' NOT NULL,
	"started_on" date,
	"ended_on" date,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" text,
	"seo_description" text,
	"canonical_url" text,
	"og_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_title_check" CHECK (length(trim("projects"."title")) > 0),
	CONSTRAINT "projects_status_check" CHECK ("projects"."status" in ('draft', 'published', 'archived')),
	CONSTRAINT "projects_project_status_check" CHECK ("projects"."project_status" in ('planned', 'active', 'completed', 'archived')),
	CONSTRAINT "projects_published_at_check" CHECK ("projects"."status" <> 'published' or "projects"."published_at" is not null),
	CONSTRAINT "projects_date_range_check" CHECK ("projects"."ended_on" is null or "projects"."started_on" is null or "projects"."ended_on" >= "projects"."started_on")
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technologies_name_check" CHECK (length(trim("technologies"."name")) > 0)
);
--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_technologies_technology_id_index" ON "project_technologies" USING btree ("technology_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_status_featured_index" ON "projects" USING btree ("status","is_featured");--> statement-breakpoint
CREATE INDEX "projects_status_published_at_index" ON "projects" USING btree ("status","published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_name_unique" ON "technologies" USING btree (lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_slug_unique" ON "technologies" USING btree ("slug");