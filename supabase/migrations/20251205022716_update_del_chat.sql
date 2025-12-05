
CREATE OR REPLACE FUNCTION delete_chat(p_chat_id uuid) 
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete from chats table
    DELETE FROM public.chats 
    WHERE chat_id = p_chat_id;
    
    -- also delete the associated storage objects linked to the messages in this chat
    DELETE FROM storage.objects WHERE SPLIT_PART(name,'/',2) = p_chat_id::text;
    -- Check if any rows were deleted
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$;