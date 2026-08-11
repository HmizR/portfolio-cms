CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_key" text NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt_text" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_filename_check" CHECK (length(trim("media"."filename")) > 0),
	CONSTRAINT "media_original_filename_check" CHECK (length(trim("media"."original_filename")) > 0),
	CONSTRAINT "media_file_size_check" CHECK ("media"."file_size" > 0),
	CONSTRAINT "media_dimensions_check" CHECK (("media"."width" is null and "media"."height" is null) or ("media"."width" > 0 and "media"."height" > 0)),
	CONSTRAINT "media_mime_type_check" CHECK ("media"."mime_type" in ('image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'))
);
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "og_media_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "cover_media_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "og_media_id" uuid;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "avatar_media_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "cover_media_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "og_media_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "media_storage_key_unique" ON "media" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "media_created_at_index" ON "media" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "media_mime_type_index" ON "media" USING btree ("mime_type");--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_og_media_id_media_id_fk" FOREIGN KEY ("og_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_og_media_id_media_id_fk" FOREIGN KEY ("og_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_avatar_media_id_media_id_fk" FOREIGN KEY ("avatar_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_og_media_id_media_id_fk" FOREIGN KEY ("og_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pages_og_media_id_index" ON "pages" USING btree ("og_media_id");--> statement-breakpoint
CREATE INDEX "posts_cover_media_id_index" ON "posts" USING btree ("cover_media_id");--> statement-breakpoint
CREATE INDEX "posts_og_media_id_index" ON "posts" USING btree ("og_media_id");--> statement-breakpoint
CREATE INDEX "profiles_avatar_media_id_index" ON "profiles" USING btree ("avatar_media_id");--> statement-breakpoint
CREATE INDEX "projects_cover_media_id_index" ON "projects" USING btree ("cover_media_id");--> statement-breakpoint
CREATE INDEX "projects_og_media_id_index" ON "projects" USING btree ("og_media_id");