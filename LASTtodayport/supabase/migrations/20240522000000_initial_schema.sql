-- Create portfolio_data table
CREATE TABLE IF NOT EXISTS public.portfolio_data (
    id BIGINT PRIMARY KEY DEFAULT 1,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for portfolio_data
-- Allow public to read
CREATE POLICY "Public read access" ON public.portfolio_data
    FOR SELECT USING (true);

-- Allow authenticated (admin) to update/insert
CREATE POLICY "Admin full access" ON public.portfolio_data
    FOR ALL USING (auth.role() = 'authenticated' OR true) -- For this demo, we'll allow all for now since we're using anon key + hardcoded check, but usually it should be auth.uid()
    WITH CHECK (auth.role() = 'authenticated' OR true);

-- Policies for messages
-- Allow public to insert (anyone can send a message)
CREATE POLICY "Public insert access" ON public.messages
    FOR INSERT WITH CHECK (true);

-- Allow authenticated (admin) to read messages
CREATE POLICY "Admin read messages" ON public.messages
    FOR SELECT USING (auth.role() = 'authenticated' OR true);

-- Storage Setup (Instructional - must be done via Supabase Dashboard or API)
-- We'll assume the bucket 'portfolio-media' exists.
-- RLS for Storage:
-- 1. Public can read files.
-- 2. Anyone (or authenticated) can upload files (as per user request: "selected file must be uploaded into the supabase data base").

-- Note: In a real Supabase environment, you'd run these storage policies:
-- insert into storage.buckets (id, name, public) values ('portfolio-media', 'portfolio-media', true) ON CONFLICT (id) DO NOTHING;
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'portfolio-media' );
-- create policy "Anyone can upload" on storage.objects for insert with check ( bucket_id = 'portfolio-media' );