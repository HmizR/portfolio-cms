CREATE TABLE "homepage_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_type" text NOT NULL,
	"sort_order" integer NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"configuration_json" jsonb NOT NULL,
	"page_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "homepage_sections_sort_order_check" CHECK ("homepage_sections"."sort_order" >= 0),
	CONSTRAINT "homepage_sections_type_check" CHECK ("homepage_sections"."section_type" in ('markdown', 'featured_projects', 'recent_posts', 'featured_publications', 'education', 'experience', 'page_excerpt')),
	CONSTRAINT "homepage_sections_page_shape_check" CHECK ("homepage_sections"."section_type" = 'page_excerpt' or "homepage_sections"."page_id" is null)
);
--> statement-breakpoint
INSERT INTO "homepage_sections" ("id", "section_type", "sort_order", "is_visible", "configuration_json") VALUES
	('20000000-0000-4000-8000-000000000001', 'markdown', 0, true, '{"heading":"About","markdown":"Welcome to my academic and professional portfolio. Use the homepage editor to introduce your work, research interests, and current focus."}'::jsonb),
	('20000000-0000-4000-8000-000000000002', 'featured_projects', 1, true, '{"heading":"Featured projects","itemCount":3}'::jsonb),
	('20000000-0000-4000-8000-000000000003', 'recent_posts', 2, true, '{"heading":"Recent writing","itemCount":3}'::jsonb),
	('20000000-0000-4000-8000-000000000004', 'featured_publications', 3, true, '{"heading":"Featured publications","itemCount":3}'::jsonb),
	('20000000-0000-4000-8000-000000000005', 'education', 4, false, '{"heading":"Education","itemCount":3}'::jsonb),
	('20000000-0000-4000-8000-000000000006', 'experience', 5, false, '{"heading":"Experience","itemCount":3}'::jsonb),
	('20000000-0000-4000-8000-000000000007', 'page_excerpt', 6, false, '{"heading":"More about my work"}'::jsonb);
--> statement-breakpoint
ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "homepage_sections_type_unique" ON "homepage_sections" USING btree ("section_type");--> statement-breakpoint
CREATE UNIQUE INDEX "homepage_sections_sort_order_unique" ON "homepage_sections" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "homepage_sections_page_id_index" ON "homepage_sections" USING btree ("page_id");
