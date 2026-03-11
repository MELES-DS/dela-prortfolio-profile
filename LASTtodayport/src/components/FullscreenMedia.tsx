import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Music, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenMediaProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
}

export const FullscreenMedia: React.FC<FullscreenMediaProps> = ({ isOpen, onClose, mediaUrl, mediaType }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
        onClick={onClose}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full z-50"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-8 h-8" />
        </Button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-full max-h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {mediaType === 'video' ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          ) : mediaType === 'audio' ? (
            <div className="bg-card p-12 rounded-2xl border flex flex-col items-center gap-6">
               <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <Music className="w-12 h-12 text-blue-600" />
               </div>
               <audio src={mediaUrl} controls className="w-64 md:w-96" />
            </div>
          ) : mediaType === 'document' ? (
             <div className="bg-card p-12 rounded-2xl border flex flex-col items-center gap-6">
               <div className="w-24 h-24 rounded-lg bg-red-100 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-red-600" />
               </div>
               <p className="text-xl font-bold">Document File Preview</p>
               <Button size="lg" onClick={() => window.open(mediaUrl, '_blank')} className="rounded-full bg-blue-600">
                 Open in New Tab
               </Button>
            </div>
          ) : (
            <img
              src={mediaUrl}
              alt="Fullscreen view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};