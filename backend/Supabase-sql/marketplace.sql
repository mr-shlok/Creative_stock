-- --- MARKETPLACE INITIALIZATION ---
-- Run this script in the Supabase SQL Editor

-- 1. Create Storage Bucket for Photos
-- Note: If this fails, you can also create a public bucket named "photos" in the Supabase Dashboard.
INSERT INTO storage.buckets (id, name, public)
SELECT 'photos', 'photos', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'photos'
);

-- 2. Storage Policies for "photos"
-- Allow public viewing of all photos
CREATE POLICY "Public Access to Photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND 
    auth.role() = 'authenticated'
  );

-- 3. Boards Table
CREATE TABLE IF NOT EXISTS public.boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Pins Table
CREATE TABLE IF NOT EXISTS public.pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0.0,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL, -- Watermarked URL
  original_url TEXT NOT NULL, -- Clean URL
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  buy_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Likes Table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pin_id UUID REFERENCES public.pins(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(pin_id, user_id)
);

-- 6. Purchases Table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pin_id UUID REFERENCES public.pins(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Functions & RPCs
-- Function to increment buy count
CREATE OR REPLACE FUNCTION increment_buy_count(pin_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.pins
  SET buy_count = buy_count + 1
  WHERE id = pin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RLS for Tables
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Board Policies
CREATE POLICY "Users can view their own boards." ON public.boards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own boards." ON public.boards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pin Policies
CREATE POLICY "Pins are viewable by everyone." ON public.pins FOR SELECT USING (true);
CREATE POLICY "Users can create their own pins." ON public.pins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Like Policies
CREATE POLICY "Likes are viewable by everyone." ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can toggle their own likes." ON public.likes FOR ALL USING (auth.uid() = user_id);

-- Purchase Policies
CREATE POLICY "Purchases are viewable by the buyer." ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can record their purchases." ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
