import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { toast } from 'sonner';
import { LayoutDashboard, User, FileUp, Globe, Shield, LogOut, Trash2, Plus, ExternalLink, Play, FileText, Link as LinkIcon } from 'lucide-react';
import { uploadFile } from '../utils/storage';

const AdminDashboard = () => {
  const { profile, media, socialLinks, refreshData, updateProfile } = usePortfolio();
  const [isAuthenticated, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [linkForm, setLinkForm] = useState({ title: '', url: '', category: 'Projects' });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: profile.full_name,
    home_description: profile.home_description,
    about_text: profile.about_text,
    contact_email: profile.contact_email,
  });

  // SEO Form State
  const [seoForm, setSeoForm] = useState({
    seo_title: profile.seo_title,
    seo_description: profile.seo_description,
    seo_keywords: profile.seo_keywords,
  });

  useEffect(() => {
    setProfileForm({
      full_name: profile.full_name,
      home_description: profile.home_description,
      about_text: profile.about_text,
      contact_email: profile.contact_email,
    });
    setSeoForm({
      seo_title: profile.seo_title,
      seo_description: profile.seo_description,
      seo_keywords: profile.seo_keywords,
    });
  }, [profile]);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAdmin(!!session);
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      setIsAdmin(true);
      toast.success('Logged in successfully');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast.success('Logged out');
  };

  const handleSaveProfile = async () => {
    await updateProfile(profileForm);
  };

  const handleSaveSEO = async () => {
    await updateProfile(seoForm);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string, category: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const limit = type === 'video' ? 300 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > limit) {
      toast.error(`File too large. Max size: ${type === 'video' ? '300MB' : '100MB'}`);
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      const { error } = await supabase.from('media_items').insert({
        title: file.name,
        url,
        type,
        category,
      });

      if (error) throw error;
      toast.success('File uploaded successfully');
      refreshData();
    } catch (err) {
      toast.error('Upload failed');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddLink = async () => {
    if (!linkForm.title || !linkForm.url) {
      toast.error('Title and URL are required');
      return;
    }

    try {
      const { error } = await supabase.from('media_items').insert({
        title: linkForm.title,
        url: linkForm.url,
        type: 'link',
        category: linkForm.category,
      });

      if (error) throw error;
      toast.success('Link added successfully');
      setLinkForm({ title: '', url: '', category: 'Projects' });
      refreshData();
    } catch (err) {
      toast.error('Failed to add link');
      console.error(err);
    }
  };

  const deleteMedia = async (id: string) => {
    const { error } = await supabase.from('media_items').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Deleted successfully');
      refreshData();
    }
  };

  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-slate-50">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-1">
            <div className="w-16 h-16 bg-sky-50 text-[#87CEEB] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to manage your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="rounded-xl"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="rounded-xl"
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-[#87CEEB] hover:bg-sky-500 rounded-xl py-6 font-bold shadow-lg shadow-sky-100">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <LayoutDashboard className="text-[#87CEEB]" /> Admin Dashboard
            </h1>
            <p className="text-slate-500 font-medium">Welcome back, {profile.full_name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="rounded-xl border-slate-200 text-slate-600 font-bold">
            <LogOut className="mr-2" size={18} /> Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto overflow-x-auto h-auto">
            <TabsTrigger value="profile" className="rounded-xl font-bold py-3 px-6 data-[state=active]:bg-sky-50 data-[state=active]:text-[#87CEEB]">
              <User className="mr-2" size={18} /> Profile
            </TabsTrigger>
            <TabsTrigger value="content" className="rounded-xl font-bold py-3 px-6 data-[state=active]:bg-sky-50 data-[state=active]:text-[#87CEEB]">
              <FileUp className="mr-2" size={18} /> Content
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-xl font-bold py-3 px-6 data-[state=active]:bg-sky-50 data-[state=active]:text-[#87CEEB]">
              <Globe className="mr-2" size={18} /> SEO
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl font-bold py-3 px-6 data-[state=active]:bg-sky-50 data-[state=active]:text-[#87CEEB]">
              <Shield className="mr-2" size={18} /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-md">
              <CardHeader>
                <CardTitle className="font-bold">Personal Information</CardTitle>
                <CardDescription>Update your public profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Full Name</label>
                    <Input 
                      value={profileForm.full_name} 
                      onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Contact Email</label>
                    <Input 
                      value={profileForm.contact_email} 
                      onChange={(e) => setProfileForm({...profileForm, contact_email: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Home Menu Description</label>
                  <Textarea 
                    rows={4}
                    placeholder="Enter the description for your landing page..."
                    value={profileForm.home_description} 
                    onChange={(e) => setProfileForm({...profileForm, home_description: e.target.value})}
                    className="rounded-xl resize-none whitespace-pre-wrap leading-normal"
                  />
                  <p className="text-xs text-slate-400">This text will appear on your homepage. Spaces and Enter keys are preserved.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">About Text</label>
                  <Textarea 
                    rows={6}
                    value={profileForm.about_text} 
                    onChange={(e) => setProfileForm({...profileForm, about_text: e.target.value})}
                    className="rounded-xl whitespace-pre-wrap leading-normal"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-50 pt-6">
                <Button onClick={handleSaveProfile} className="bg-[#87CEEB] hover:bg-sky-500 rounded-xl font-bold px-8">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="rounded-3xl border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Upload Media</CardTitle>
                    <CardDescription>Videos (300MB), Audio/Docs (100MB)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                      <select id="category-select" className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-slate-700 font-medium outline-none">
                        <option value="Projects">Projects</option>
                        <option value="CV">CV</option>
                      </select>
                    </div>
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 bg-slate-50 hover:bg-sky-50/50 hover:border-[#87CEEB]/50 transition-all group relative">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#87CEEB] shadow-sm transition-colors">
                        <Plus size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-500">Click to upload file</p>
                      <input 
                        type="file" 
                        disabled={isUploading}
                        onChange={(e) => {
                          const category = (document.getElementById('category-select') as HTMLSelectElement).value;
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const type = file.type.split('/')[0];
                          handleFileUpload(e, type as any, category);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                    {isUploading && (
                      <div className="flex items-center gap-3 text-[#87CEEB] font-bold text-sm">
                        <div className="animate-spin h-4 w-4 border-2 border-[#87CEEB] border-t-transparent rounded-full"></div>
                        Uploading file...
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Add Custom Link</CardTitle>
                    <CardDescription>Add links to external sites or G-Drive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Link Name</label>
                      <Input 
                        placeholder="Project Live Link" 
                        value={linkForm.title}
                        onChange={(e) => setLinkForm({...linkForm, title: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">URL</label>
                      <Input 
                        placeholder="https://..." 
                        value={linkForm.url}
                        onChange={(e) => setLinkForm({...linkForm, url: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>
                    <Button onClick={handleAddLink} className="w-full bg-slate-900 hover:bg-black rounded-xl font-bold">
                      Add Link
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card className="rounded-3xl border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-white pb-0">
                    <CardTitle className="font-bold">Media Library</CardTitle>
                    <CardDescription>Manage your uploaded files and links</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {media.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-sky-50 text-[#87CEEB] rounded-lg flex items-center justify-center">
                              {item.type === 'video' ? <Play size={20} /> : item.type === 'link' ? <LinkIcon size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{item.title}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                                <span className="text-slate-200 text-xs">|</span>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#87CEEB] hover:underline flex items-center gap-1">
                                  View <ExternalLink size={10} />
                                </a>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteMedia(item.id)}
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))}
                      {media.length === 0 && (
                        <div className="p-12 text-center text-slate-400 font-medium">
                          No media items found. Upload something to get started.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-md">
              <CardHeader>
                <CardTitle className="font-bold text-xl flex items-center gap-2">
                  <Globe className="text-[#87CEEB]" size={24} /> SEO Customization
                </CardTitle>
                <CardDescription>Optimize your portfolio for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Site Title</label>
                  <Input 
                    value={seoForm.seo_title} 
                    onChange={(e) => setSeoForm({...seoForm, seo_title: e.target.value})}
                    placeholder="Melis Melakie | Portfolio"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Meta Description</label>
                  <Textarea 
                    rows={3}
                    value={seoForm.seo_description} 
                    onChange={(e) => setSeoForm({...seoForm, seo_description: e.target.value})}
                    placeholder="Brief description of your site for Google search results..."
                    className="rounded-xl resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Keywords (Comma separated)</label>
                  <Input 
                    value={seoForm.seo_keywords} 
                    onChange={(e) => setSeoForm({...seoForm, seo_keywords: e.target.value})}
                    placeholder="portfolio, designer, creative, melis melakie"
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-50 pt-6">
                <Button onClick={handleSaveSEO} className="bg-[#87CEEB] hover:bg-sky-500 rounded-xl font-bold px-8 shadow-lg shadow-sky-100">
                  Save SEO Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-md">
              <CardHeader>
                <CardTitle className="font-bold">Security Settings</CardTitle>
                <CardDescription>Manage your authentication and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 max-w-md">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full rounded-xl py-6 font-bold border-slate-200">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl py-6 font-bold border-slate-200">
                    Setup Multi-Factor Auth
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;