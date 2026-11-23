-- ==============================================================================
-- HERO PHOTOS SUPABASE MIGRATION & SEED
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/scsgtnaatfwhyzozivli/sql
-- ==============================================================================

-- 1. Create the hero_photos table
CREATE TABLE IF NOT EXISTS public.hero_photos (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  photographer TEXT NOT NULL,
  year TEXT NOT NULL,
  alignment TEXT NOT NULL DEFAULT 'bottom-left',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Grant permissions to anon and authenticated roles
GRANT ALL ON TABLE public.hero_photos TO anon, authenticated;

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE public.hero_photos ENABLE ROW LEVEL SECURITY;

-- 4. Setup read and write policies
DROP POLICY IF EXISTS "Public read hero_photos" ON public.hero_photos;
CREATE POLICY "Public read hero_photos" 
ON public.hero_photos 
FOR SELECT 
TO anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Public modify hero_photos" ON public.hero_photos;
CREATE POLICY "Public modify hero_photos" 
ON public.hero_photos 
FOR ALL 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- 5. Seed the original 5 hero slides
INSERT INTO public.hero_photos (id, url, title, location, photographer, year, alignment)
VALUES
(
  'hero_1',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=85&w=2400',
  'Evening Rain at Battala Market',
  'AGARTALA, TRIPURA',
  'SUJIT ROY',
  '2025',
  'bottom-left'
),
(
  'hero_2',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=85&w=2400',
  'Elder Weaver of Hojagiri',
  'JAMPUI HILLS, TRIPURA',
  'ANANYA DEBBARMA',
  '2025',
  'left'
),
(
  'hero_3',
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=85&w=2400',
  'Street Conversations at Motor Stand',
  'AGARTALA, TRIPURA',
  'DEBASHIS SAHA',
  '2025',
  'bottom-left'
),
(
  'hero_4',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=2400',
  'Garia Puja Procession',
  'AGARTALA, TRIPURA',
  'KUSHAL DAS',
  '2025',
  'right'
),
(
  'hero_5',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=85&w=2400',
  'Bamboo Craftsman at Maharajganj',
  'AGARTALA, TRIPURA',
  'BIKRAMJIT CHOUDHURY',
  '2025',
  'bottom-left'
)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  photographer = EXCLUDED.photographer,
  year = EXCLUDED.year,
  alignment = EXCLUDED.alignment;
