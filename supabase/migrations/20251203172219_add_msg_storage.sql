ALTER TABLE messages
ADD COLUMN msg_media UUID REFERENCES storage.objects(id);
