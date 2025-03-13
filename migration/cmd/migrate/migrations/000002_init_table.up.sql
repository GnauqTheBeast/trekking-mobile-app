CREATE TABLE "user" (
                        "id" bigserial PRIMARY KEY,
                        "name" varchar NOT NULL,
                        "email" varchar NOT NULL,
                        "password" varchar NOT NULL,
                        "phone_number" varchar,
                        "role_id" int,
                        "address" text,
                        "dob" date,
                        "provider_id" int,
                        "created_at" timestamptz NOT NULL DEFAULT (now()),
                        "updated_at" timestamptz
);

CREATE TABLE "role" (
                        "id" int PRIMARY KEY,
                        "name" "UserRole" not null ,
                        "description" varchar
);

CREATE TABLE "role_permission" (
                                   "role_id" int,
                                   "permission_id" int
);

CREATE TABLE "auth_provider" (
                                 "id" bigserial PRIMARY KEY,
                                 "name" varchar NOT NULL,
                                 "type" varchar
);

CREATE TABLE "permission" (
                              "id" bigserial PRIMARY KEY,
                              "name" varchar NOT NULL,
                              "code" varchar NOT NULL,
                              "description" text,
                              "created_at" timestamptz NOT NULL DEFAULT (now()),
                              "updated_at" timestamptz
);

CREATE TABLE "tour" (
                        "id" bigserial PRIMARY KEY,
                        "name" varchar NOT NULL,
                        "description" text,
                        "host" bigint NOT NULL,
                        "amount" bigint,
                        "currency" varchar,
                        "start_at" timestamptz,
                        "end_at" timestamptz,
                        "created_at" timestamptz NOT NULL DEFAULT (now()),
                        "updated_at" timestamptz
);

CREATE TABLE "booking" (
                           "id" bigserial PRIMARY KEY,
                           "user_id" bigint NOT NULL,
                           "tour_id" bigint NOT NULL,
                           "voucher_id" bigint,
                           "porter_id" bigint,
                           "quantity" int NOT NULL DEFAULT 1,
                           "total_price" bigint,
                           "created_at" timestamptz NOT NULL DEFAULT (now()),
                           "updated_at" timestamptz
);

CREATE TABLE "payment" (
                           "id" bigserial PRIMARY KEY,
                           "booking_id" bigint NOT NULL,
                           "total" bigint,
                           "method" varchar,
                           "type" varchar,
                           "status" varchar,
                           "transaction_id" varchar,
                           "created_at" timestamptz NOT NULL DEFAULT (now()),
                           "updated_at" timestamptz
);

CREATE TABLE "rating" (
                          "id" bigserial PRIMARY KEY,
                          "user_id" bigint NOT NULL,
                          "booking_id" bigint NOT NULL,
                          "rate" int,
                          "review" text,
                          "created_at" timestamptz NOT NULL DEFAULT (now()),
                          "updated_at" timestamptz
);

CREATE TABLE "notification" (
                                "id" bigserial PRIMARY KEY,
                                "name" varchar,
                                "description" text,
                                "created_at" timestamptz NOT NULL DEFAULT (now()),
                                "updated_at" timestamptz
);

CREATE TABLE "voucher" (
                           "id" bigserial PRIMARY KEY,
                           "name" varchar NOT NULL,
                           "description" text,
                           "amount" bigint,
                           "discount" int,
                           "discount_type" varchar,
                           "start_at" timestamptz,
                           "end_at" timestamptz,
                           "created_by" int,
                           "tour_id" int,
                           "created_at" timestamptz NOT NULL DEFAULT (now()),
                           "updated_at" timestamptz
);

CREATE TABLE "voucher_user" (
                                "id" bigserial PRIMARY KEY,
                                "user_id" int,
                                "voucher_id" int,
                                "status" "VoucherStatus"
);

ALTER TABLE "user" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");

ALTER TABLE "user" ADD FOREIGN KEY ("provider_id") REFERENCES "auth_provider" ("id");

ALTER TABLE "role_permission" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");

ALTER TABLE "role_permission" ADD FOREIGN KEY ("permission_id") REFERENCES "permission" ("id");

ALTER TABLE "tour" ADD FOREIGN KEY ("host") REFERENCES "user" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("tour_id") REFERENCES "tour" ("id");

ALTER TABLE "booking" ADD FOREIGN KEY ("voucher_id") REFERENCES "voucher_user" ("id");

ALTER TABLE "payment" ADD FOREIGN KEY ("booking_id") REFERENCES "booking" ("id");

ALTER TABLE "rating" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "rating" ADD FOREIGN KEY ("booking_id") REFERENCES "booking" ("id");

ALTER TABLE "voucher" ADD FOREIGN KEY ("created_by") REFERENCES "user" ("id");

ALTER TABLE "voucher" ADD FOREIGN KEY ("tour_id") REFERENCES "tour" ("id");

ALTER TABLE "voucher_user" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "voucher_user" ADD FOREIGN KEY ("voucher_id") REFERENCES "voucher" ("id");