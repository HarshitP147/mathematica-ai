ALTER TABLE user_msgs
DROP COLUMN IF EXISTS user_id;

ALTER TABLE user_msgs
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE user_msgs
DROP COLUMN IF EXISTS sender_type;

ALTER TABLE user_msgs
ADD COLUMN IF NOT EXISTS sender_role msg_role;

ALTER TABLE user_msgs
ADD COLUMN IF NOT EXISTS model_name TEXT;