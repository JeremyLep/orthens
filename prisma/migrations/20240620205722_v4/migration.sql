-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_address_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_phone_public" BOOLEAN NOT NULL DEFAULT false;
