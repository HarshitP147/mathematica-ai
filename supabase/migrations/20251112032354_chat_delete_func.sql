CREATE OR REPLACE FUNCTION delete_chat(p_chat_id uuid) 
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete from chats table
    -- CASCADE will automatically delete:
    -- 1. user_chats (via fk_user_chats_chat)
    -- 2. chat_msgs (via fk_chat_msgs_chat)
    -- 3. messages (via fk_chat_msgs_message from chat_msgs)
    -- 4. user_msgs (via fk_user_msgs_message from messages)
    DELETE FROM public.chats 
    WHERE chat_id = p_chat_id;
    
    -- Check if any rows were deleted
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$;