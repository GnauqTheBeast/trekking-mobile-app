CREATE TABLE "user" (
                        "id" uuid PRIMARY KEY,
                        "name" varchar NOT NULL,
                        "email" varchar NOT NULL,
                        "password" varchar NOT NULL,
                        "phone_number" varchar,
                        "role_id" uuid,
                        "address" text NOT NULL,
                        "dob" date,
                        "provider_id" uuid,
                        "created_at" timestamptz NOT NULL DEFAULT (now()),
                        "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "role" (
                        "id" uuid PRIMARY KEY,
                        "name" "UserRole" not null,
                        "description" varchar
);

CREATE TABLE "role_permission" (
                       "role_id" uuid NOT NULL,
                       "permission_id" uuid NOT NULL
);

CREATE TABLE "auth_provider" (
                                 "id" uuid PRIMARY KEY,
                                 "name" varchar NOT NULL,
                                 "type" varchar
);

CREATE TABLE "permission" (
                              "id" uuid PRIMARY KEY,
                              "name" varchar NOT NULL,
                              "code" varchar NOT NULL,
                              "description" text NOT NULL,
                              "created_at" timestamptz NOT NULL DEFAULT (now()),
                              "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "tour" (
                        "id" uuid PRIMARY KEY,
                        "name" varchar NOT NULL,
                        "description" text NOT NULL,
                        "host_id" uuid NOT NULL,
                        "slot" int NOT NULL,
                        "available_slot" int NOT NULL,
                        "price" int NOT NULL,
                        "status" "TourStatus" NOT NULL,
                        "start_at" timestamptz NOT NULL,
                        "end_at" timestamptz NOT NULL,
                        "created_at" timestamptz NOT NULL DEFAULT (now()),
                        "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "booking" (
                           "id" uuid PRIMARY KEY,
                           "user_id" uuid NOT NULL,
                           "tour_id" uuid NOT NULL,
                           "porter_id" uuid,
                           "quantity" int NOT NULL DEFAULT 1,
                           "status" varchar NOT NULL DEFAULT 'PENDING',
                           "total_price" bigint NOT NULL,
                           "expired_at" timestamptz NOT NULL DEFAULT (now() + interval '15 minutes'),
                           "created_at" timestamptz NOT NULL DEFAULT (now()),
                           "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "payment" (
                           "id" uuid PRIMARY KEY,
                           "booking_id" uuid NOT NULL,
                           "total" bigint NOT NULL,
                           "method" varchar NOT NULL,
                           "type" varchar NOT NULL,
                           "status" varchar NOT NULL,
                           "created_at" timestamptz NOT NULL DEFAULT (now()),
                           "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "rating" (
                          "id" uuid PRIMARY KEY,
                          "user_id" uuid NOT NULL,
                          "booking_id" uuid NOT NULL,
                          "rate" int NOT NULL,
                          "review" text NOT NULL,
                          "created_at" timestamptz NOT NULL DEFAULT (now()),
                          "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "notification" (
                                "id" uuid PRIMARY KEY,
                                "user_id" uuid NOT NULL,
                                "name" varchar NOT NULL,
                                "description" text NOT NULL,
                                "created_at" timestamptz NOT NULL DEFAULT (now()),
                                "updated_at" timestamptz NOT NULL DEFAULT (now())
);


ALTER TABLE "user" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");

ALTER TABLE "user" ADD FOREIGN KEY ("provider_id") REFERENCES "auth_provider" ("id");

ALTER TABLE "role_permission" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");

ALTER TABLE "role_permission" ADD FOREIGN KEY ("permission_id") REFERENCES "permission" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("tour_id") REFERENCES "tour" ("id");

ALTER TABLE "booking" ADD CONSTRAINT "booking_porter_id_fkey" FOREIGN KEY ("porter_id") REFERENCES "user" ("id") ON DELETE SET NULL;

ALTER TABLE "tour" ADD FOREIGN KEY ("host_id") REFERENCES "user" ("id");

ALTER TABLE "payment" ADD FOREIGN KEY ("booking_id") REFERENCES "booking" ("id");

ALTER TABLE "rating" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "rating" ADD FOREIGN KEY ("booking_id") REFERENCES "booking" ("id");
