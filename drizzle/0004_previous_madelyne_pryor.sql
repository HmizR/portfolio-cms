CREATE TABLE "navigation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"type" text NOT NULL,
	"page_id" uuid,
	"url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"open_new_tab" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "navigation_items_label_check" CHECK (length(trim("navigation_items"."label")) > 0),
	CONSTRAINT "navigation_items_sort_order_check" CHECK ("navigation_items"."sort_order" >= 0),
	CONSTRAINT "navigation_items_destination_check" CHECK ((
        ("navigation_items"."type" = 'page' and "navigation_items"."page_id" is not null and "navigation_items"."url" is null)
        or ("navigation_items"."type" = 'external' and "navigation_items"."page_id" is null and "navigation_items"."url" is not null)
        or ("navigation_items"."type" in ('posts', 'projects', 'publications', 'cv') and "navigation_items"."page_id" is null and "navigation_items"."url" is null)
      ))
);
--> statement-breakpoint
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "navigation_items_sort_order_index" ON "navigation_items" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "navigation_items_page_id_index" ON "navigation_items" USING btree ("page_id");