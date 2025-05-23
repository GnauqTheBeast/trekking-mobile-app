CREATE TABLE "booking" (
        "id" uuid PRIMARY KEY,
        "user_id" uuid NOT NULL,
        "tour_id" uuid NOT NULL,
        "porter_id" uuid,
        "status" varchar NOT NULL DEFAULT 'PENDING',
        "quantity" int NOT NULL DEFAULT 1,
        "total_price" bigint NOT NULL,
        "expired_at" timestamptz NOT NULL DEFAULT (now() + interval '15 minutes'),
        "created_at" timestamptz NOT NULL DEFAULT (now()),
        "updated_at" timestamptz NOT NULL DEFAULT (now())
);
