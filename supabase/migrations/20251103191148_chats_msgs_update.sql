-- set the column to not null
ALTER TABLE messages ALTER COLUMN role SET NOT NULL;
ALTER TABLE messages ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE chats ALTER COLUMN chat_name SET NOT NULL;
ALTER TABLE chats ALTER COLUMN created_at SET NOT NULL;
