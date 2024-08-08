ALTER TABLE "reddit-clone_comment" RENAME COLUMN "id" TO "comment_id";--> statement-breakpoint
ALTER TABLE "reddit-clone_post" RENAME COLUMN "id" TO "post_id";--> statement-breakpoint
ALTER TABLE "reddit-clone_comment" DROP CONSTRAINT "reddit-clone_comment_post_id_reddit-clone_post_id_fk";
--> statement-breakpoint
ALTER TABLE "reddit-clone_comment" DROP CONSTRAINT "reddit-clone_comment_parent_id_reddit-clone_comment_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_comment" ADD CONSTRAINT "reddit-clone_comment_post_id_reddit-clone_post_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."reddit-clone_post"("post_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reddit-clone_comment" ADD CONSTRAINT "reddit-clone_comment_parent_id_reddit-clone_comment_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reddit-clone_comment"("comment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
