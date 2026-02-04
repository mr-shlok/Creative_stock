-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. Create boards table
CREATE TABLE IF NOT EXISTS public.boards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- 2. Create pins table (Advanced)
CREATE TABLE IF NOT EXISTS public.pins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0.00,
  tags TEXT[], -- Array of strings for search
  image_url TEXT NOT NULL, -- Watermarked version
  original_url TEXT NOT NULL, -- Original clean version
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  likes_count INT DEFAULT 0,
  buy_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- 3. Create likes table (to track who liked what)
CREATE TABLE IF NOT EXISTS public.likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_id UUID REFERENCES public.pins(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, pin_id)
);
-- 4. Create cart table
CREATE TABLE IF NOT EXISTS public.cart (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_id UUID REFERENCES public.pins(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, pin_id)
);
-- RLS & Policies
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
-- Board Policies
CREATE POLICY "Users can manage their own boards." ON public.boards
  FOR ALL USING (auth.uid() = user_id);
-- Pins Policies
CREATE POLICY "Everyone can see pins." ON public.pins
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage pins." ON public.pins
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Likes Policies
CREATE POLICY "Users can manage their own likes." ON public.likes
  FOR ALL USING (auth.uid() = user_id);
-- Cart Policies
CREATE POLICY "Users can manage their own cart." ON public.cart
  FOR ALL USING (auth.uid() = user_id);
-- Trigger to auto-increment likes_count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE pins SET likes_count = likes_count + 1 WHERE id = NEW.pin_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE pins SET likes_count = likes_count - 1 WHERE id = OLD.pin_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_likes_count();