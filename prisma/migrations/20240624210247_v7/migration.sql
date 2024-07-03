/*
  Warnings:

  - The `email_stringverified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_stringverified",
ADD COLUMN     "email_stringverified" TIMESTAMP(3);
