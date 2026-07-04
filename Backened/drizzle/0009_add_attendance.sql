CREATE TABLE IF NOT EXISTS "attendance" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" varchar(255) NOT NULL,
  "attended_on" date NOT NULL,
  "attended" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "attendance_email_day_unique" UNIQUE("email", "attended_on")
);
