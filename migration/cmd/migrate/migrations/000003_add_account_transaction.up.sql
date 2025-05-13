-- Create account table
CREATE TABLE "account" (
    "id" uuid PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "balance" bigint NOT NULL DEFAULT 0,
    "currency" varchar NOT NULL DEFAULT 'VND',
    "status" varchar NOT NULL DEFAULT 'active',
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now()),
    FOREIGN KEY ("user_id") REFERENCES "user" ("id")
);

-- Create transaction table
CREATE TABLE "transaction" (
    "id" uuid PRIMARY KEY,
    "account_id" uuid NOT NULL,
    "amount" bigint NOT NULL,
    "type" varchar NOT NULL, -- 'deposit', 'withdraw', 'transfer', 'payment'
    "status" varchar NOT NULL, -- 'pending', 'completed', 'failed'
    "description" text,
    "reference_id" uuid, -- Reference to related entity (booking_id, etc.)
    "reference_type" varchar, -- Type of reference (booking, transfer, etc.)
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now()),
    FOREIGN KEY ("account_id") REFERENCES "account" ("id")
);

-- Add indexes for better performance
CREATE INDEX idx_account_user_id ON "account" ("user_id");
CREATE INDEX idx_transaction_account_id ON "transaction" ("account_id");
CREATE INDEX idx_transaction_reference_id ON "transaction" ("reference_id");
CREATE INDEX idx_transaction_created_at ON "transaction" ("created_at"); 