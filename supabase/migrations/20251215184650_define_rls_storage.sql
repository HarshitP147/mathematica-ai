-- create a storage bucket for chat media files with RLS policies

-- define 15 MB file size limit
INSERT INTO storage.buckets(id, name, public, file_size_limit)
VALUES ('chat-media', 'chat-media', false, 15728640 );

-- RLS is already defined on storage.objects table

-- every users should be able to mutate and view their own files in the 'chat-media' bucket

CREATE POLICY "Allow logged-in users to read their own files"
ON storage.objects
FOR SELECT
TO public
USING (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (SELECT auth.role()) = 'authenticated'
);

CREATE POLICY "Allow logged-in users to insert their own files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (SELECT auth.role()) = 'authenticated'
);

CREATE POLICY "Allow logged-in users to update their own files"
ON storage.objects
FOR UPDATE
TO public
USING (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (SELECT auth.role()) = 'authenticated'
);

CREATE POLICY "Allow logged-in users to delete their own files"
ON storage.objects
FOR DELETE
TO public
USING (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (SELECT auth.role()) = 'authenticated'
);