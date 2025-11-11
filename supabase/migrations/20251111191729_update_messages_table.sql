
-- Fix cascade delete for chat messages
-- When a chat is deleted, all related entries in chat_msgs should be deleted (already configured)
-- When a message in chat_msgs is deleted, the actual message in Messages table should also be deleted

-- Drop and recreate foreign key constraints to ensure CASCADE is properly set

-- 1. Fix chat_msgs -> Messages foreign key
ALTER TABLE chat_msgs DROP CONSTRAINT IF EXISTS fk_chat_msgs_message;
ALTER TABLE chat_msgs
ADD CONSTRAINT fk_chat_msgs_message
FOREIGN KEY (msg_id) REFERENCES Messages(message_id) ON DELETE CASCADE;

-- 2. Verify chat_msgs -> chats foreign key has CASCADE (should already exist)
ALTER TABLE chat_msgs DROP CONSTRAINT IF EXISTS fk_chat_msgs_chat;
ALTER TABLE chat_msgs
ADD CONSTRAINT fk_chat_msgs_chat
FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE;

-- Now when you delete a chat:
-- 1. user_chats entries are deleted (already had ON DELETE CASCADE)
-- 2. chat_msgs entries are deleted (CASCADE from chats)
-- 3. Messages are deleted (CASCADE from chat_msgs)