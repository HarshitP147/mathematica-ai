-- drop the old single UUID column and add as array
ALTER TABLE messages
DROP COLUMN IF EXISTS msg_media;

ALTER TABLE messages
ADD COLUMN msg_media UUID[];

-- update the messages table to add empty array as default
UPDATE messages
SET msg_media = ARRAY[]::UUID[]
WHERE msg_media IS NULL;