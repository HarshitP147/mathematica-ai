CREATE OR REPLACE FUNCTION create_chat(
    p_user_id UUID,
    p_chat_name TEXT
)
RETURNS UUID AS $chat_id$
BEGIN
    DECLARE
        v_chat_id UUID;
    BEGIN
        -- generate a chat id
        v_chat_id := gen_random_uuid();

        -- created at timestamp
        insert into chats values (v_chat_id, p_chat_name, now(), now());

        -- link user to chat
        INSERT INTO user_chats values (p_user_id, v_chat_id);

        RETURN v_chat_id;
    END;

END;
$chat_id$ LANGUAGE plpgsql;