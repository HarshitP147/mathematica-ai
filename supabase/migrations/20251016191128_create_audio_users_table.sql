CREATE TABLE IF NOT EXISTS audio_users (
    user_id UUID ,
    audio_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE audio_users
ADD CONSTRAINT audio_users_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE audio_users
ADD CONSTRAINT audio_users_audio_id_fkey
FOREIGN KEY (audio_id) REFERENCES storage.objects(id) ON DELETE CASCADE;

ALTER TABLE audio_users
ADD CONSTRAINT audio_users_pkey
PRIMARY KEY (user_id, audio_id);