ALTER TABLE "site_settings" ADD COLUMN "default_og_media_id" uuid;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "twitter_handle" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_media_id_media_id_fk" FOREIGN KEY ("default_og_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "site_settings_default_og_media_id_index" ON "site_settings" USING btree ("default_og_media_id");