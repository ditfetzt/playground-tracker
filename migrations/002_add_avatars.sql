-- Add avatar_url column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create avatars storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload avatars
CREATE POLICY IF NOT EXISTS "Allow avatar uploads"
ON storage.objects FOR ALL
TO anon, authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Allow public read of avatars
CREATE POLICY IF NOT EXISTS "Allow public avatar reads"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'avatars');