-- DropForeignKey
ALTER TABLE "conversation_messages" DROP CONSTRAINT "conversation_messages_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_relation_id_fkey";

-- DropForeignKey
ALTER TABLE "follow_up_messages" DROP CONSTRAINT "follow_up_messages_relation_id_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_relation_id_fkey";

-- DropForeignKey
ALTER TABLE "relations" DROP CONSTRAINT "relations_child_id_fkey";

-- AlterTable
ALTER TABLE "relations" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "relations" ADD CONSTRAINT "relations_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "relations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_up_messages" ADD CONSTRAINT "follow_up_messages_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "relations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_relation_id_fkey" FOREIGN KEY ("relation_id") REFERENCES "relations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
