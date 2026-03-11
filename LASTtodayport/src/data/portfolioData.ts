import { PortfolioData, MediaItem, SocialLink } from '../lib/supabase';

export interface PortfolioState {
  profile: PortfolioData;
  media: MediaItem[];
  socialLinks: SocialLink[];
  isLoading: boolean;
}

export const defaultPortfolioData: PortfolioData = {
  id: '1',
  full_name: 'Melis Melakie',
  home_description: 'Welcome to my portfolio.',
  about_text: 'I am a creative professional...',
  contact_email: 'melismelakie27@gmail.com',
  seo_title: 'Melis Melakie | Portfolio',
  seo_description: 'Professional portfolio of Melis Melakie',
  seo_keywords: 'portfolio, melis melakie, creative, design',
};

export const categories = ['About', 'Projects', 'CV', 'Contact'];