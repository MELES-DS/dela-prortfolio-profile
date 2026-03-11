import React from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Play, FileText, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { categories } from '../data/portfolioData';

const Home = () => {
  const { profile, media, isLoading } = usePortfolio();
  const { tab } = useParams();

  const currentTab = tab || 'home';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#87CEEB]"></div>
      </div>
    );
  }

  // Render content based on tab
  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center max-w-4xl mx-auto py-20 px-6"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto mb-6">
                {profile.profile_image_url ? (
                  <img src={profile.profile_image_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#87CEEB] flex items-center justify-center text-white text-4xl font-bold">
                    {profile.full_name[0]}
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                {profile.full_name}
              </h1>
              <div className="h-1 w-20 bg-[#87CEEB] mx-auto rounded-full"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10">
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto">
                {profile.home_description}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-[#87CEEB] hover:bg-sky-500 text-white rounded-full px-8 py-6 h-auto text-lg font-bold shadow-lg shadow-sky-200">
                <a href="#contact">Get in Touch <Mail className="ml-2" /></a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-slate-200 hover:border-[#87CEEB] rounded-full px-8 py-6 h-auto text-lg font-bold">
                <a href="#projects">View Projects</a>
              </Button>
            </motion.div>
          </motion.div>
        );

      case 'about':
        return (
          <div className="max-w-4xl mx-auto py-16 px-6">
            <h2 className="text-3xl font-bold mb-8 border-b-4 border-[#87CEEB] inline-block pb-2">About Me</h2>
            <div className="text-slate-700 leading-normal text-lg whitespace-pre-wrap">
              {profile.about_text}
            </div>
          </div>
        );

      case 'projects':
        const projectItems = media.filter(m => m.category === 'Projects');
        return (
          <div className="max-w-7xl mx-auto py-16 px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">My Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectItems.map((project) => (
                <motion.div 
                  key={project.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 group"
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    {project.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <Play size={48} className="text-white opacity-50 group-hover:scale-110 transition-transform" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={48} className="text-[#87CEEB] opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-slate-900">{project.title}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <Button variant="link" className="p-0 text-[#87CEEB] font-bold h-auto">
                        Learn More <ArrowRight size={16} className="ml-1" />
                      </Button>
                      {project.type === 'link' && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'cv':
        const cvItems = media.filter(m => m.category === 'CV');
        return (
          <div className="max-w-4xl mx-auto py-16 px-6">
            <h2 className="text-3xl font-bold mb-8 border-b-4 border-[#87CEEB] inline-block pb-2">Curriculum Vitae</h2>
            <div className="space-y-6">
              {cvItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-sky-50 text-[#87CEEB] rounded-lg">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500 uppercase tracking-wider">{item.type}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">View File</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-4xl mx-auto py-16 px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Me</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Have a project in mind? Want to collaborate? Or just want to say hi? 
                  Feel free to send a message and I'll get back to you as soon as possible.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#87CEEB] text-white rounded-full flex items-center justify-center shadow-lg shadow-sky-100">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter">Email</p>
                      <p className="text-slate-900 font-medium">{profile.contact_email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  // Implementation for sending email to admin
                  // In a real app, this would call a Supabase Edge Function
                  alert(`Message sent to ${profile.contact_email}`);
                }}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#87CEEB] outline-none transition-all" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#87CEEB] outline-none transition-all" placeholder="your@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Message</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#87CEEB] outline-none transition-all resize-none" placeholder="How can I help you?" required></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-[#87CEEB] hover:bg-sky-500 py-6 rounded-xl font-bold text-lg shadow-lg shadow-sky-100">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {renderContent()}
    </div>
  );
};

export default Home;