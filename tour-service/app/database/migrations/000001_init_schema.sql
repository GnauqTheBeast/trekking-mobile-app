CREATE TABLE "tour" (
    "id" uuid PRIMARY KEY,
    "name" varchar NOT NULL,
    "description" text,
    "host" uuid NOT NULL,
    "slot" int NOT NULL,
    "status" varchar NOT NULL,
    "start_at" timestamptz,
    "end_at" timestamptz,
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz
);