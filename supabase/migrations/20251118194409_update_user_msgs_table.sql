ALTER TABLE public.user_msgs DROP COLUMN IF EXISTS sender_type;

ALTER TABLE public.user_msgs ADD COLUMN sender_type msg_role;;