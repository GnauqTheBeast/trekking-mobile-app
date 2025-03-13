CREATE TYPE "UserRole" AS ENUM (
  'ADMIN',
  'HOST',
  'USER',
  'PORTER'
);

CREATE TYPE "VoucherStatus" AS ENUM (
  'ACTIVE',
  'USED',
  'EXPIRED',
  'CANCELLED'
);

