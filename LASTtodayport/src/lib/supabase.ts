import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dutvjupyhnzlmptncshh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dHZqdXB5aG56bG1wdG5jc2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjA0ODksImV4cCI6MjA4ODEzNjQ4OX0.cpdU8JlQHUtJ5VUlRSQTyXoTtya2hyzmmpG2ByRH-kI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PortfolioData = {
  id: string;
  full_name: string;
  home_description: string;
  about_text: string;
  contact_email: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  profile_image_url?: string;
};

export type MediaItem = {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'audio' | 'document' | 'image' | 'link';
  category: string;
  created_at: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
};