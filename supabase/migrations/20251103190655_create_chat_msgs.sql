CREATE TABLE chat_msgs (
    chat_id UUID,
    msg_id UUID
);

ALTER TABLE chat_msgs
ADD CONSTRAINT pk_chat_msgs PRIMARY KEY (chat_id, msg_id);

ALTER TABLE chat_msgs
ADD CONSTRAINT fk_chat_msgs_chat
FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE;

ALTER TABLE chat_msgs
ADD CONSTRAINT fk_chat_msgs_message
FOREIGN KEY (msg_id) REFERENCES Messages(message_id) ON DELETE CASCADE;