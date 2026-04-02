-- Supabase Storage Setup for Chat Images
-- This creates a storage bucket for chat images
-- Run this in your Supabase SQL Editor OR create the bucket via Dashboard

-- Note: Storage buckets are typically created via Supabase Dashboard UI
-- But you can also use this SQL if needed

-- Create storage bucket for chat images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for chat-images bucket

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload chat images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view all chat images
CREATE POLICY "Anyone can view chat images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own chat images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Chat images storage bucket configured!';
  RAISE NOTICE 'Images will be stored in: chat-images/{user_id}/{filename}';
END $$;
