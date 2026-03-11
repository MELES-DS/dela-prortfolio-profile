import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { Settings, Menu, X, Mail, Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';

const Header = () => {
  const { profile } = usePortfolio();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'CV', path: '/cv' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#87CEEB] shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#87CEEB] font-bold overflow-hidden border-2 border-white shadow-sm">
            {profile.profile_image_url ? (
              <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{profile.full_name.split(' ').map(n => n[0]).join('')}</span>
            )}
          </div>
          <span className="font-bold text-white text-lg tracking-tight">{profile.full_name}</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-white font-medium hover:text-blue-100 transition-colors ${
                location.pathname === item.path ? 'border-b-2 border-white' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#87CEEB] border-t border-white/20 flex flex-col items-center py-6 gap-4 md:hidden shadow-lg"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-lg font-semibold hover:text-blue-100 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => {
  const { socialLinks } = usePortfolio();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <footer className="w-full bg-black text-white py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">Melis Melakie</h3>
          <p className="text-gray-400 max-w-xs">Creative professional dedicated to excellence and innovation.</p>
        </div>

        <div className="flex gap-6">
          <a href="#" className="bg-black border border-white/20 p-2 rounded-full hover:bg-white/10 transition-colors">
            <Github size={20} />
          </a>
          <a href="#" className="bg-black border border-white/20 p-2 rounded-full hover:bg-white/10 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="#" className="bg-black border border-white/20 p-2 rounded-full hover:bg-white/10 transition-colors">
            <Instagram size={20} />
          </a>
          <a href="#" className="bg-black border border-white/20 p-2 rounded-full hover:bg-white/10 transition-colors">
            <Twitter size={20} />
          </a>
        </div>

        <div className="text-center md:text-right relative">
          <p className="text-sm text-gray-500 mb-4">&copy; {new Date().getFullYear()} Melis Melakie. All rights reserved.</p>
          
          {/* Admin Settings Icon - Now inside footer and scrolls with it */}
          {!isAdmin && (
            <Link to="/admin">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:text-white transition-colors"
                title="Admin Settings"
              >
                <Settings size={20} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <Router>
      <PortfolioProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-sky-200 selection:text-sky-900">
          <Header />
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Other routes handled within Home or separate components */}
              <Route path="/:tab" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" richColors />
        </div>
      </PortfolioProvider>
    </Router>
  );
}

export default App;