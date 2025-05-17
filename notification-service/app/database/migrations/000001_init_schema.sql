CREATE TABLE "notification" (
            "id" uuid PRIMARY KEY,
            "user_id" uuid NOT NULL,
            "name" varchar NOT NULL,
            "description" text NOT NULL,
            "created_at" timestamptz NOT NULL DEFAULT (now()),
            "updated_at" timestamptz NOT NULL DEFAULT (now())
);