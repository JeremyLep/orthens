/*
  Warnings:

  - Added the required column `type` to the `alerts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_stringverified" BOOLEAN NOT NULL DEFAULT false;
