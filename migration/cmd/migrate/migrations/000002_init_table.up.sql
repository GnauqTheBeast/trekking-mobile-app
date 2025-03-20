CREATE TABLE "user" (
                        "id" uuid PRIMARY KEY,
                        "name" varchar NOT NULL,
                        "email" varchar NOT NULL,
                        "password" varchar NOT NULL,
                        "phone_number" varchar,
                        "role_id" uuid,
                        "address" text,
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
                       "role_id" uuid,
                       "permission_id" uuid
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
                           "host_id" uuid NOT NULL,
                           "porter_id" uuid,
                           "quantity" int NOT NULL DEFAULT 1,
                           "total_price" bigint NOT NULL,
                           "created_at" timestamptz NOT NULL DEFAULT (now()),
                           "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "payment" (
                           "id" uuid PRIMARY KEY,
                           "booking_id" uuid NOT NULL,
                           "total" bigint NOT NULL,
                           "method" varchar,
                           "type" varchar,
                           "status" varchar,
                           "transaction_id" varchar,
                           "created_at" timestamptz NOT NULL DEFAULT (now()),
                           "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "rating" (
                          "id" uuid PRIMARY KEY,
                          "user_id" uuid NOT NULL,
                          "booking_id" uuid NOT NULL,
                          "rate" int,
                          "review" text,
                          "created_at" timestamptz NOT NULL DEFAULT (now()),
                          "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "notification" (
                                "id" uuid PRIMARY KEY,
                                "name" varchar,
                                "description" text,
                                "created_at" timestamptz NOT NULL DEFAULT (now()),
                                "updated_at" timestamptz NOT NULL DEFAULT (now())
);


ALTER TABLE "user" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");

ALTER TABLE "user" ADD FOREIGN KEY ("provider_id") REFERENCES "auth_provider" ("id");

ALTER TABLE "role_permission" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");

ALTER TABLE "role_permission" ADD FOREIGN KEY ("permission_id") REFERENCES "permission" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("host_id") REFERENCES "user" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("tour_id") REFERENCES "tour" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("porter_id") REFERENCES "user" ("id");

ALTER TABLE "tour" ADD FOREIGN KEY ("host_id") REFERENCES "user" ("id");

ALTER TABLE "payment" ADD FOREIGN KEY ("booking_id") REFERENCES "booking" ("id");

ALTER TABLE "rating" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "rating" ADD FOREIGN KEY ("booking_id") REFERENCES "booking" ("id");
