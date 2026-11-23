import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Calendar, Share2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const LightboxModal: React.FC = () => {
  const { activePhoto, setActivePhoto, nextPhoto, prevPhoto } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePhoto) return;
      if (e.key === 'Escape') setActivePhoto(null);
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (activePhoto) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activePhoto, setActivePhoto, nextPhoto, prevPhoto]);

  if (!activePhoto) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${activePhoto.title} by ${activePhoto.photographer}`,
        text: activePhoto.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Photo link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121110] text-[#faf8f5] flex flex-col justify-between overflow-hidden backdrop-blur-xl animate-fade-in" id="lightbox-modal">
      {/* Top Bar */}
      <div className="p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#a39c90]">
            {activePhoto.category} Photography
          </span>
          <h3 className="font-serif text-lg sm:text-xl text-[#faf8f5] font-normal">
            {activePhoto.title}
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="p-2 text-[#a39c90] hover:text-[#faf8f5] transition-colors focus:outline-none"
            title="Share Photograph"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActivePhoto(null)}
            className="p-2 text-[#a39c90] hover:text-[#faf8f5] transition-colors focus:outline-none"
            title="Close Viewer (Esc)"
            id="lightbox-close-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Photo Container */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-8 min-h-0">
        {/* Navigation Buttons */}
        <button
          onClick={prevPhoto}
          className="absolute left-2 sm:left-6 z-20 p-3 text-[#faf8f5]/70 hover:text-[#faf8f5] bg-black/40 hover:bg-black/70 rounded-full transition-all focus:outline-none"
          title="Previous Photo (Left Arrow)"
          id="lightbox-prev-btn"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextPhoto}
          className="absolute right-2 sm:right-6 z-20 p-3 text-[#faf8f5]/70 hover:text-[#faf8f5] bg-black/40 hover:bg-black/70 rounded-full transition-all focus:outline-none"
          title="Next Photo (Right Arrow)"
          id="lightbox-next-btn"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Uncropped Image */}
        <div className="max-w-full max-h-full flex items-center justify-center p-2">
          <img
            src={activePhoto.url}
            alt={activePhoto.title}
            className="max-h-[72vh] sm:max-h-[78vh] w-auto max-w-full object-contain shadow-2xl transition-opacity duration-300 select-none"
          />
        </div>
      </div>

      {/* Bottom Photo Metadata Panel */}
      <div className="bg-[#1a1918] border-t border-[#2b2a28] p-4 sm:p-6 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs text-[#a39c90]">
          {/* Caption & Photographer */}
          <div className="md:col-span-6 space-y-1.5">
            <p className="text-sm text-[#faf8f5] font-light leading-relaxed">
              "{activePhoto.caption}"
            </p>
            <div className="flex items-center space-x-2 text-xs pt-1">
              <span className="text-[#faf8f5] font-medium">Photograph by {activePhoto.photographer}</span>
              {activePhoto.series && (
                <>
                  <span>•</span>
                  <span className="text-[#b85d38]">Series: {activePhoto.series}</span>
                </>
              )}
            </div>
          </div>

          {/* Location & Date */}
          <div className="md:col-span-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-[#faf8f5]">
              <MapPin className="w-3.5 h-3.5 text-[#b85d38]" />
              <span>{activePhoto.location}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8c8881]" />
              <span>{activePhoto.date || activePhoto.year}</span>
            </div>
          </div>

          {/* Camera EXIF Info */}
          <div className="md:col-span-3 space-y-1 font-mono text-[11px] border-l md:border-[#2b2a28] md:pl-4">
            {activePhoto.cameraInfo ? (
              <>
                <div className="flex items-center space-x-1.5 text-[#faf8f5]">
                  <Camera className="w-3.5 h-3.5 text-[#8c8881]" />
                  <span>{activePhoto.cameraInfo.camera || 'Digital Archive'}</span>
                </div>
                <p className="text-[#8c8881]">
                  {activePhoto.cameraInfo.lens}
                </p>
                <p className="text-[#8c8881]">
                  {[
                    activePhoto.cameraInfo.focalLength,
                    activePhoto.cameraInfo.aperture,
                    activePhoto.cameraInfo.shutterSpeed,
                    activePhoto.cameraInfo.iso ? `ISO ${activePhoto.cameraInfo.iso}` : null
                  ].filter(Boolean).join(' • ')}
                </p>
              </>
            ) : (
              <p className="text-[#8c8881]">Streets of Tripura Archival Collection</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
