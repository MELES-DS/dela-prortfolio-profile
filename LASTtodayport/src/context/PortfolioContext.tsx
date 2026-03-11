import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, PortfolioData, MediaItem, SocialLink } from '../lib/supabase';
import { defaultPortfolioData } from '../data/portfolioData';
import { toast } from 'sonner';

interface PortfolioContextType {
  profile: PortfolioData;
  media: MediaItem[];
  socialLinks: SocialLink[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateProfile: (updates: Partial<PortfolioData>) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PortfolioData>(defaultPortfolioData);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('portfolio_settings')
        .select('*')
        .single();

      if (profileData) {
        setProfile(profileData);
      } else if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Fetch Media
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (mediaData) {
        setMedia(mediaData);
      }

      // Fetch Social Links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*');

      if (socialData) {
        setSocialLinks(socialData);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<PortfolioData>) => {
    try {
      const { error } = await supabase
        .from('portfolio_settings')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      setProfile(prev => ({ ...prev, ...updates }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ profile, media, socialLinks, isLoading, refreshData: fetchData, updateProfile }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};