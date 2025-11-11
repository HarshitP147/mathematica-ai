CREATE TYPE msg_role as ENUM ('user', 'assistant', 'system');

CREATE TABLE Messages (
    message_id UUID,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role msg_role
);

ALTER TABLE Messages ADD CONSTRAINT msgs_pkey PRIMARY KEY (message_id);