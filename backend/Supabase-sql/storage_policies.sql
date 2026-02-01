-- 1. Create a bucket for avatars (run this in Supabase Dashboard -> Storage)
-- Bucket Name: "avatars"
-- Public: YES (so images can be viewed)

-- 2. Set up Storage Policies (Run this in SQL Editor)

-- Allow users to upload their own avatar
CREATE POLICY "Avatar upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own avatar
CREATE POLICY "Avatar update" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'avatars' AND 
    (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Allow public access to view avatars
CREATE POLICY "Avatar public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to delete their own avatar
CREATE POLICY "Avatar delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    (auth.uid())::text = (storage.foldername(name))[1]
  );
