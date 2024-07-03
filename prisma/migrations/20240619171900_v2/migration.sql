-- AlterTable
ALTER TABLE "children" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "invitationCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "lastRetry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
