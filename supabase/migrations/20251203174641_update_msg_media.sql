-- add an array of storage object ids to the messages table
ALTER TABLE messages
ADD COLUMN msg_media UUID[] REFERENCES storage.objects(id);

-- update the messages table to add the storage object ids to the msg_media column
UPDATE messages
SET msg_media = ARRAY[]::UUID[];