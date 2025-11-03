CREATE TABLE user_msgs (
    user_id UUID,
    message_id UUID
);

ALTER TABLE user_msgs ADD CONSTRAINT pk_user_msgs PRIMARY KEY (user_id, message_id);

ALTER TABLE user_msgs
ADD CONSTRAINT fk_user_msgs_user
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE user_msgs
ADD CONSTRAINT fk_user_msgs_message
FOREIGN KEY (message_id) REFERENCES Messages(message_id) ON DELETE CASCADE;