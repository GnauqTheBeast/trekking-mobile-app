CREATE TYPE "UserRole" AS ENUM (
  'ADMIN',
  'HOST',
  'USER',
  'PORTER'
);

CREATE TYPE "TourStatus" AS ENUM (
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED'
);
