CREATE TABLE "workout" (
	"id" serial PRIMARY KEY NOT NULL,
	" exercise_name" varchar(300),
	"weight" integer,
	"set" integer,
	"reps" integer,
	"day" varchar(20)
);
