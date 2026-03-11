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
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access' AND tablename = 'portfolio_data') THEN
        CREATE POLICY "Public read access" ON public.portfolio_data FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access' AND tablename = 'portfolio_data') THEN
        CREATE POLICY "Admin full access" ON public.portfolio_data FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Policies for messages
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert access' AND tablename = 'messages') THEN
        CREATE POLICY "Public insert access" ON public.messages FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin read messages' AND tablename = 'messages') THEN
        CREATE POLICY "Admin read messages" ON public.messages FOR SELECT USING (true);
    END IF;
END $$;

-- Storage Setup
-- Note: Creation of buckets and storage policies are handled via SQL but often require superuser or dashboard access.
-- Here we provide the SQL for manual execution or migration.
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
-- Allow public to read files
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
    END IF;
END $$;

-- Allow public to insert files
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-media');
    END IF;
END $$;

-- Allow public to update/delete (to match 'Admin' experience with local isAdmin check)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Update' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-media');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Delete' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-media');
    END IF;
END $$;