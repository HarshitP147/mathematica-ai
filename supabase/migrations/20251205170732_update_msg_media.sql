ALTER TABLE messages
DROP COLUMN IF EXISTS msg_media;

-- add an array of text urls to the messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS msg_media TEXT[];