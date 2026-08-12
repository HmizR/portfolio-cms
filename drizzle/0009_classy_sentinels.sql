CREATE TABLE "cv_project_selections" (
	"cv_section_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "cv_project_selections_section_project_pk" PRIMARY KEY("cv_section_id","project_id"),
	CONSTRAINT "cv_project_selections_sort_order_check" CHECK ("cv_project_selections"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "cv_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_type" text NOT NULL,
	"sort_order" integer NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cv_sections_type_check" CHECK ("cv_sections"."section_type" in ('profile', 'education', 'experience', 'projects', 'publications', 'skills')),
	CONSTRAINT "cv_sections_sort_order_check" CHECK ("cv_sections"."sort_order" >= 0)
);
--> statement-breakpoint
INSERT INTO "cv_sections" ("id", "section_type", "sort_order", "is_visible") VALUES
	('10000000-0000-4000-8000-000000000001', 'profile', 0, true),
	('10000000-0000-4000-8000-000000000002', 'education', 1, true),
	('10000000-0000-4000-8000-000000000003', 'experience', 2, true),
	('10000000-0000-4000-8000-000000000004', 'projects', 3, true),
	('10000000-0000-4000-8000-000000000005', 'publications', 4, true),
	('10000000-0000-4000-8000-000000000006', 'skills', 5, true);
--> statement-breakpoint
ALTER TABLE "cv_project_selections" ADD CONSTRAINT "cv_project_selections_cv_section_id_cv_sections_id_fk" FOREIGN KEY ("cv_section_id") REFERENCES "public"."cv_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_project_selections" ADD CONSTRAINT "cv_project_selections_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cv_project_selections_section_order_unique" ON "cv_project_selections" USING btree ("cv_section_id","sort_order");--> statement-breakpoint
CREATE INDEX "cv_project_selections_project_id_index" ON "cv_project_selections" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cv_sections_type_unique" ON "cv_sections" USING btree ("section_type");--> statement-breakpoint
CREATE UNIQUE INDEX "cv_sections_sort_order_unique" ON "cv_sections" USING btree ("sort_order");
