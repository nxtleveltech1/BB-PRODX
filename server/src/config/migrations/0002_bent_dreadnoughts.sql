CREATE TABLE "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"session_token" varchar(255) NOT NULL,
	"refresh_token" varchar(255) NOT NULL,
	"device_info" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_activity" timestamp DEFAULT now(),
	CONSTRAINT "user_sessions_session_token_unique" UNIQUE("session_token"),
	CONSTRAINT "user_sessions_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;