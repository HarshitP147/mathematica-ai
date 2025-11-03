CREATE TABLE chats (
    chat_id UUID,
    chat_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE chats ADD CONSTRAINT chats_pkey PRIMARY KEY (chat_id);