drop table chat_msgs;

-- add a new column chat_id to messages table
alter table messages add column chat_id uuid;

-- add the foreign key constraint from messages to chats
alter table messages
add constraint fk_messages_chat foreign key (chat_id) references chats(chat_id) ;