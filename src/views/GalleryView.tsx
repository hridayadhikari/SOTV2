import React, { useState, useEffect } from 'react';
import {
  Camera,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Layers,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { PhotoStory } from '../types';

interface GalleryViewProps {
  initialTab?: 'photos' | 'stories';
  storySlug?: string;
  onNavigate?: (path: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  initialTab = 'photos',
  storySlug,
  onNavigate
}) => {
  const { photos, stories, setActivePhoto } = useData();
  const [activeTab, setActiveTab] = useState<'photos' | 'stories'>(
    storySlug || initialTab === 'stories' ? 'stories' : 'photos'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeStory, setActiveStory] = useState<PhotoStory | null>(() => {
    if (storySlug) {
      return stories.find(s => s.slug === storySlug) || null;
    }
    return null;
  });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (storySlug) {
      const found = stories.find(s => s.slug === storySlug);
      if (found) {
        setActiveStory(found);
        setActiveTab('stories');
      }
    }
  }, [storySlug, stories]);

  const categories = ['All', 'Street', 'Documentary', 'Culture', 'People', 'Landscape', 'Travel', 'Events'];

  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter(p => p.category === selectedCategory);

  const handleSelectStory = (story: PhotoStory) => {
    setActiveStory(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNavigate) {
      window.history.pushState({}, '', `/gallery/stories/${story.slug}`);
    }
  };

  const handleBackToStoriesList = () => {
    setActiveStory(null);
    if (onNavigate) {
      window.history.pushState({}, '', `/gallery`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.share && activeStory) {
      navigator.share({
        title: activeStory.title,
        text: activeStory.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // If viewing a specific photo essay reader
  if (activeTab === 'stories' && activeStory) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in" id="gallery-story-reader">
        {/* Back navigation */}
        <div className="flex items-center justify-between border-b border-[#e6e1d8] pb-4">
          <button
            onClick={handleBackToStoriesList}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8c8881] hover:text-[#1a1918] transition-colors"
            id="back-to-gallery-stories-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stories Archive</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8c8881]">
              Gallery / Stories
            </span>
          </div>
        </div>

        {/* Story Header */}
        <header className="space-y-6 border-b border-[#e6e1d8] pb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[#8c8881]">
            <span className="text-[#b85d38] font-semibold">{activeStory.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {activeStory.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {activeStory.date}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1a1918] leading-tight">
            {activeStory.title}
          </h1>

          {activeStory.subtitle && (
            <p className="font-serif text-xl sm:text-2xl text-[#5a5752] italic font-light">
              {activeStory.subtitle}
            </p>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-3">
              {activeStory.photographerAvatar && (
                <img
                  src={activeStory.photographerAvatar}
                  alt={activeStory.photographer}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-[#1a1918] font-semibold">
                  Photographs & Narrative by {activeStory.photographer}
                </p>
                <p className="text-[10px] text-[#8c8881]">Streets of Tripura Archival Journal</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#e6e1d8] text-xs text-[#5a5752] hover:text-[#1a1918] hover:border-[#1a1918] transition-colors"
              title="Share Story"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Cover Image */}
        <div className="bg-[#1a1918] overflow-hidden shadow-sm">
          <img
            src={activeStory.coverImage}
            alt={activeStory.title}
            className="w-full h-[450px] sm:h-[600px] object-cover"
          />
        </div>

        {/* Story Text & Photo Essays */}
        <article className="space-y-12">
          {/* Pull Quote */}
          {activeStory.pullQuote && (
            <blockquote className="my-10 border-l-2 border-[#1a1918] pl-6 py-2 font-serif text-2xl sm:text-3xl text-[#1a1918] italic font-light leading-snug">
              "{activeStory.pullQuote}"
            </blockquote>
          )}

          {/* Paragraphs */}
          <div className="prose prose-lg max-w-none text-[#2b2a28] font-light leading-relaxed space-y-6 text-base sm:text-lg">
            {activeStory.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Photo Gallery Grid for this story */}
          {activeStory.photos && activeStory.photos.length > 0 && (
            <div className="space-y-10 pt-8 border-t border-[#e6e1d8]">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#1a1918] font-light flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#b85d38]" />
                  <span>Visual Portfolio & Plates</span>
                </h3>
                <span className="text-xs uppercase font-mono tracking-widest text-[#8c8881]">
                  {activeStory.photos.length} Plates
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeStory.photos.map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => setActivePhoto({
                      id: `gallery_story_p_${pIdx}`,
                      title: activeStory.title,
                      url: photo.url,
                      photographer: activeStory.photographer,
                      location: activeStory.location,
                      year: activeStory.year,
                      category: activeStory.category,
                      caption: photo.caption
                    })}
                    className="group cursor-pointer space-y-2 bg-white border border-[#e6e1d8] p-3 shadow-2xs hover:border-[#1a1918] transition-colors"
                  >
                    <div className="overflow-hidden bg-[#1a1918]">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-80 object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-xs text-[#5a5752] italic font-serif pt-1">
                      {photo.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in" id="gallery-page">
      {/* Header Banner */}
      <div className="border-b border-[#e6e1d8] pb-8 space-y-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
          <span>Curated Visual Repository & Stories</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1a1918]">
          THE GALLERY ARCHIVE
        </h1>
        <p className="text-sm text-[#5a5752] max-w-2xl font-light leading-relaxed">
          An uncropped visual repository documenting everyday moments, indigenous heritage, street life, and in-depth documentary photo essays across Tripura.
        </p>

        {/* Primary Tab Switcher: Photos vs Stories */}
        <div className="flex items-center gap-3 pt-4" id="gallery-main-tabs">
          <button
            onClick={() => {
              setActiveTab('photos');
              setActiveStory(null);
            }}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest transition-all flex items-center gap-2.5 font-medium ${
              activeTab === 'photos'
                ? 'bg-[#1a1918] text-[#faf8f5] shadow-xs'
                : 'bg-white border border-[#e6e1d8] text-[#5a5752] hover:text-[#1a1918] hover:border-[#1a1918]'
            }`}
            id="gallery-tab-photos"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photographs</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs ${
              activeTab === 'photos' ? 'bg-[#faf8f5]/20 text-white' : 'bg-[#f2eee8] text-[#8c8881]'
            }`}>
              {photos.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('stories');
              setActiveStory(null);
            }}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest transition-all flex items-center gap-2.5 font-medium ${
              activeTab === 'stories'
                ? 'bg-[#1a1918] text-[#faf8f5] shadow-xs'
                : 'bg-white border border-[#e6e1d8] text-[#5a5752] hover:text-[#1a1918] hover:border-[#1a1918]'
            }`}
            id="gallery-tab-stories"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Photo Stories & Essays</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs ${
              activeTab === 'stories' ? 'bg-[#faf8f5]/20 text-white' : 'bg-[#f2eee8] text-[#8c8881]'
            }`}>
              {stories.length}
            </span>
          </button>
        </div>

        {/* Category Filters (Only when viewing Photos Tab) */}
        {activeTab === 'photos' && (
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider pt-2 border-t border-[#f2eee8]">
            <span className="text-[10px] font-mono text-[#8c8881] mr-1">Filter Genre:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[11px] transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1a1918] text-[#faf8f5]'
                    : 'bg-white text-[#5a5752] hover:text-[#1a1918] border border-[#e6e1d8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: PHOTOGRAPHS MASONRY GRID */}
      {activeTab === 'photos' && (
        <section className="space-y-6" id="gallery-photos-grid">
          <div className="flex items-center justify-between text-xs text-[#8c8881]">
            <span>Showing {filteredPhotos.length} curated archival prints</span>
            <span className="font-mono text-[10px]">Click any photo for EXIF Metadata</span>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPhotos.map(photo => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative cursor-pointer overflow-hidden bg-[#1a1918] break-inside-avoid shadow-xs hover:shadow-md transition-shadow border border-[#e6e1d8]"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-[#faf8f5]">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#b85d38] font-semibold">
                    {photo.category}
                  </span>
                  <p className="font-serif text-lg font-light leading-snug">{photo.title}</p>
                  <p className="text-xs text-[#a39c90] mt-1 font-mono">
                    {photo.photographer} • {photo.location} ({photo.year})
                  </p>
                  <p className="text-[10px] text-[#faf8f5]/80 uppercase tracking-widest mt-2 border-t border-white/20 pt-1.5 flex items-center justify-between">
                    <span>View Lightbox & EXIF</span>
                    <span>→</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: PHOTO STORIES & ESSAYS */}
      {activeTab === 'stories' && (
        <section className="space-y-8" id="gallery-stories-grid">
          <div className="flex items-center justify-between text-xs text-[#8c8881]">
            <span>Showing {stories.length} long-form visual documentary essays</span>
            <span className="font-mono text-[10px]">Curated Editorial Portfolios</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map(story => (
              <div
                key={story.id}
                onClick={() => handleSelectStory(story)}
                className="group cursor-pointer bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs"
                id={`gallery-story-card-${story.id}`}
              >
                <div className="space-y-4">
                  <div className="overflow-hidden bg-[#1a1918] aspect-[4/3] relative">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 bg-[#1a1918] text-[#faf8f5] text-[9px] uppercase font-mono px-2 py-0.5 tracking-wider">
                      {story.category}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-[#8c8881] font-mono">
                    <span>{story.location}</span>
                    <span>•</span>
                    <span>{story.year}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-normal text-[#1a1918] group-hover:text-[#b85d38] transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-[#5a5752] line-clamp-3 font-light leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e6e1d8] flex justify-between items-center text-xs text-[#1a1918]">
                  <span className="text-[#8c8881] text-[11px]">By {story.photographer}</span>
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[#1a1918] group-hover:text-[#b85d38]">
                    <span>Read Essay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
