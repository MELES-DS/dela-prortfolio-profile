import React, { useState, useRef } from 'react';
import { Maximize2, Play, Pause, Volume2, VolumeX, Music, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FullscreenMedia } from './FullscreenMedia';
import { Media } from '../data/portfolioData';

interface MediaFrameProps {
  media?: Media;
  fallback?: string;
  className?: string;
  rounded?: string;
  enableFullscreen?: boolean;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({ 
  media, 
  fallback, 
  className = "", 
  rounded = "rounded-full",
  enableFullscreen = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaRef.current) {
      try {
        if (isPlaying) {
          mediaRef.current.pause();
        } else {
          await mediaRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (err) {
        console.error('Media play/pause error:', err);
        toast.error('Could not play media.');
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const openFullscreen = () => {
    if (media?.type === 'document') {
      openDocument();
      return;
    }
    if (enableFullscreen && (media?.url || fallback)) {
      setIsFullscreenOpen(true);
    }
  };

  const openDocument = () => {
    const url = media?.url || fallback;
    if (!url) return;
    
    if (url.toLowerCase().endsWith('.pdf')) {
      window.open(url, '_blank');
    } else if (url.toLowerCase().includes('docs.google.com') || url.toLowerCase().includes('office.com') || url.toLowerCase().includes('drive.google.com')) {
      window.open(url, '_blank');
    } else {
      // General Office viewer for .doc, .docx, .ppt, .pptx
      const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
      window.open(viewerUrl, '_blank');
    }
  };

  const currentUrl = media?.url || fallback;
  const isVideo = media?.type === 'video';
  const isAudio = media?.type === 'audio';
  const isDocument = media?.type === 'document';
  const isImage = media?.type === 'image' || (!isVideo && !isAudio && !isDocument);

  return (
    <>
      <div 
        className={`relative group cursor-pointer ${className}`}
        onClick={openFullscreen}
      >
        <div className={`w-full h-full ${rounded} overflow-hidden border-4 border-primary/20 shadow-xl bg-muted flex items-center justify-center`}>
          {isVideo ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={currentUrl}
              className="w-full h-full object-contain"
              loop
              muted={isMuted}
              playsInline
              controls={false}
            />
          ) : isAudio ? (
            <div className="flex flex-col items-center justify-center p-4 gap-4 w-full h-full bg-blue-50/10">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Music className="text-blue-600 w-8 h-8" />
              </div>
              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={currentUrl}
                loop
                muted={isMuted}
              />
              <p className="text-xs font-bold text-blue-600/70 uppercase tracking-widest">Audio Track</p>
            </div>
          ) : isDocument ? (
            <div className="flex flex-col items-center justify-center p-4 gap-4 w-full h-full bg-red-50/10">
              <div className="w-16 h-16 rounded-lg bg-red-100 flex items-center justify-center">
                <FileText className="text-red-600 w-8 h-8" />
              </div>
              <p className="text-xs font-medium text-muted-foreground truncate max-w-full px-2 text-center">Document File</p>
              <Button size="sm" variant="outline" className="mt-2 rounded-full bg-white border-2 border-red-200 text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); openDocument(); }}>
                 <ExternalLink className="w-3 h-3 mr-1" /> View
              </Button>
            </div>
          ) : (
            <img
              src={currentUrl}
              alt="Media content"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Overlay for controls or fullscreen hint */}
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 ${rounded}`}>
          <div className="flex gap-2">
            {(isVideo || isAudio) && (
              <>
                <Button size="icon" variant="secondary" className="rounded-full w-10 h-10 shadow-lg" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full w-10 h-10 shadow-lg" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </>
            )}
            {enableFullscreen && !isDocument && (
              <Button size="icon" variant="secondary" className="rounded-full w-10 h-10 shadow-lg" onClick={(e) => { e.stopPropagation(); openFullscreen(); }}>
                <Maximize2 className="w-5 h-5" />
              </Button>
            )}
            {isDocument && (
              <Button size="icon" variant="secondary" className="rounded-full w-10 h-10 shadow-lg" onClick={(e) => { e.stopPropagation(); openDocument(); }}>
                <ExternalLink className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <FullscreenMedia
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        mediaUrl={currentUrl || ''}
        mediaType={media?.type || 'image'}
      />
    </>
  );
};