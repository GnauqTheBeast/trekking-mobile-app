CREATE TABLE "tour" (
    "id" uuid PRIMARY KEY,
    "name" varchar NOT NULL,
    "description" text NOT NULL,
    "host_id" uuid NOT NULL,
    "slot" int NOT NULL,
    "available_slot" int NOT NULL,
    "price" int NOT NULL,
    "status" varchar NOT NULL,
    "start_at" timestamptz NOT NULL,
    "end_at" timestamptz NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
);
