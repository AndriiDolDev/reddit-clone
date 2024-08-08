CREATE TABLE IF NOT EXISTS "reddit-clone_comment" (
	"id" varchar PRIMARY KEY NOT NULL,
	"comment" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"like" integer,
	"created_by" varchar(255) NOT NULL,
	"post_id" varchar NOT NULL,
	"parent_id" varchar,
	"user_name" varchar,
	"user_image" varchar
);
--> statement-breakpoint
ALTER TABLE "reddit-clone_post" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "reddit-clone_post" ADD COLUMN "description" varchar(1024);--> statement-breakpoint
ALTER TABLE "reddit-clone_post" ADD COLUMN "user_name" varchar;--> statement-breakpoint
ALTER TABLE "reddit-clone_post" ADD COLUMN "user_image" varchar;--> statement-breakpoint
ALTER TABLE "reddit-clone_post" ADD COLUMN "like" integer;--> statement-breakpoint
ALTER TABLE "reddit-clone_user" ADD COLUMN "likes" varchar[];--> statement-breakpoint
ALTER TABLE "reddit-clone_user" ADD COLUMN "dislikes" varchar[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_comment" ADD CONSTRAINT "reddit-clone_comment_created_by_reddit-clone_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."reddit-clone_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_comment" ADD CONSTRAINT "reddit-clone_comment_post_id_reddit-clone_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."reddit-clone_post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_comment" ADD CONSTRAINT "reddit-clone_comment_parent_id_reddit-clone_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reddit-clone_comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_comment" ADD CONSTRAINT "reddit-clone_comment_user_name_reddit-clone_user_name_fk" FOREIGN KEY ("user_name") REFERENCES "public"."reddit-clone_user"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_comment" ADD CONSTRAINT "reddit-clone_comment_user_image_reddit-clone_user_image_fk" FOREIGN KEY ("user_image") REFERENCES "public"."reddit-clone_user"("image") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_post" ADD CONSTRAINT "reddit-clone_post_user_name_reddit-clone_user_name_fk" FOREIGN KEY ("user_name") REFERENCES "public"."reddit-clone_user"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_post" ADD CONSTRAINT "reddit-clone_post_user_image_reddit-clone_user_image_fk" FOREIGN KEY ("user_image") REFERENCES "public"."reddit-clone_user"("image") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
