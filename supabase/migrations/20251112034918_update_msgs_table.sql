-- add the not null and on delete cascade constraints to the msgs table

ALTER TABLE messages
ALTER COLUMN chat_id SET NOT NULL ;

ALTER TABLE messages
DROP CONSTRAINT IF EXISTS fk_messages_chat;

ALTER TABLE messages
ADD CONSTRAINT fk_messages_chat foreign key (chat_id) references chats(chat_id) on delete cascade;