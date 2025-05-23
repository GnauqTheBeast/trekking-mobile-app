ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_role_id_fkey";
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_provider_id_fkey";
ALTER TABLE "role_permission" DROP CONSTRAINT IF EXISTS "role_permission_role_id_fkey";
ALTER TABLE "role_permission" DROP CONSTRAINT IF EXISTS "role_permission_permission_id_fkey";
ALTER TABLE "tour" DROP CONSTRAINT IF EXISTS "tour_host_id_fkey";
ALTER TABLE "booking" DROP CONSTRAINT IF EXISTS "booking_user_id_fkey";
ALTER TABLE "booking" DROP CONSTRAINT IF EXISTS "booking_tour_id_fkey";
ALTER TABLE "payment" DROP CONSTRAINT IF EXISTS "payment_booking_id_fkey";
ALTER TABLE "rating" DROP CONSTRAINT IF EXISTS "rating_user_id_fkey";
ALTER TABLE "rating" DROP CONSTRAINT IF EXISTS "rating_booking_id_fkey";
ALTER TABLE "booking" DROP CONSTRAINT IF EXISTS "booking_porter_id_fkey";
ALTER TABLE "favorite" DROP CONSTRAINT IF EXISTS "favorite_user_id_fkey";
ALTER TABLE "favorite" DROP CONSTRAINT IF EXISTS "favorite_tour_id_fkey";

DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "role" CASCADE;
DROP TABLE IF EXISTS "role_permission" CASCADE;
DROP TABLE IF EXISTS "auth_provider" CASCADE;
DROP TABLE IF EXISTS "permission" CASCADE;
DROP TABLE IF EXISTS "tour" CASCADE;
DROP TABLE IF EXISTS "booking" CASCADE;
DROP TABLE IF EXISTS "payment" CASCADE;
DROP TABLE IF EXISTS "rating" CASCADE;
DROP TABLE IF EXISTS "notification" CASCADE;
DROP TABLE IF EXISTS "favorite" CASCADE;

