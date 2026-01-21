CREATE TABLE "followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" text NOT NULL,
	"following_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"subject" text NOT NULL,
	"branch" text NOT NULL,
	"semester" text NOT NULL,
	"cycle" text DEFAULT 'none',
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_usn" text NOT NULL,
	"badge_type" text NOT NULL,
	"badge_image" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"usn" text,
	"branch" text,
	"semester" text,
	"cycle" text DEFAULT 'none',
	"bio" text,
	"created_at" timestamp DEFAULT now()
);
