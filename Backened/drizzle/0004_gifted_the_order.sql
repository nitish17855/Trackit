CREATE TABLE "schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"tite" varchar(300),
	"message" varchar(400),
	"is_pending" boolean DEFAULT true,
	"send_email" boolean DEFAULT false,
	"send_notifications" boolean DEFAULT true,
	"run_at" timestamp NOT NULL
);
