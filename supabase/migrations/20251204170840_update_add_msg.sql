CREATE OR REPLACE FUNCTION add_message(
    p_chat_id UUID,
    p_sender_id UUID,
    p_sender_role msg_role,
    p_content TEXT,
    p_model_name TEXT,
    p_msg_media UUID[]
) RETURNS VOID AS $$
BEGIN
    DECLARE
        v_message_id UUID;
    BEGIN
    
    v_message_id := gen_random_uuid();

    -- insert message into messages table
    INSERT INTO messages (message_id, content, role, chat_id, created_at, msg_media) VALUES (v_message_id, p_content, p_sender_role, p_chat_id, NOW(), p_msg_media);    

    -- insert into user_messages table
    -- check if the sender is a user or the system
    IF p_sender_role = 'user' THEN
        INSERT INTO user_msgs (user_id, message_id, sender_role, model_name) VALUES (p_sender_id, v_message_id, 'user', NULL);
    ELSE

        INSERT INTO user_msgs (user_id, message_id, sender_role, model_name) VALUES (NULL, v_message_id, 'system', p_model_name);
    END IF;
    END;

END;
$$ LANGUAGE plpgsql;