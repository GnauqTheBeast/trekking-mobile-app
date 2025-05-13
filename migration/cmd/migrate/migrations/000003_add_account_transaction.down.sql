-- Drop indexes first
DROP INDEX IF EXISTS idx_transaction_created_at;
DROP INDEX IF EXISTS idx_transaction_reference_id;
DROP INDEX IF EXISTS idx_transaction_account_id;
DROP INDEX IF EXISTS idx_account_user_id;

-- Drop tables
DROP TABLE IF EXISTS "transaction";
DROP TABLE IF EXISTS "account"; 