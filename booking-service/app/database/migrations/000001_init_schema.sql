CREATE TABLE "booking" (
        "id" uuid PRIMARY KEY,
        "user_id" uuid NOT NULL,
        "tour_id" uuid NOT NULL,
        "host_id" uuid NOT NULL,
        "porter_id" uuid,
        "quantity" int NOT NULL DEFAULT 1,
        "total_price" bigint,
        "created_at" timestamptz NOT NULL DEFAULT (now()),
        "updated_at" timestamptz NOT NULL DEFAULT (now())
);
