create table if not exists user_chats (
    user_id UUID,
    chat_id UUID
);

ALTER TABLE user_chats add constraint pk_user_chats primary key (user_id, chat_id);

alter table user_chats add constraint fk_user_chats_user foreign key (user_id) references auth.users (id) on delete cascade;

alter table user_chats add constraint fk_user_chats_chat foreign key (chat_id) references public.chats (chat_id) on delete cascade;