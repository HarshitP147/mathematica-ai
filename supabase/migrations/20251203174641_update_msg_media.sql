-- add an array of storage object ids to the messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS msg_media UUID[];
