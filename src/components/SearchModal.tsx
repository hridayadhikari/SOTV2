import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Camera, BookOpen, Calendar, MapPin, User } from 'lucide-react';
import { useData } from '../context/DataContext';

interface SearchModalProps {
  onNavigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onNavigate }) => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    photos,
    stories,
    photowalks,
    exhibitions,
    magazines,
    setActivePhoto
  } = useData();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const filteredPhotos = cleanQuery
    ? photos.filter(
        p =>
          p.title.toLowerCase().includes(cleanQuery) ||
          p.photographer.toLowerCase().includes(cleanQuery) ||
          p.location.toLowerCase().includes(cleanQuery) ||
          p.caption.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredStories = cleanQuery
    ? stories.filter(
        s =>
          s.title.toLowerCase().includes(cleanQuery) ||
          s.photographer.toLowerCase().includes(cleanQuery) ||
          s.location.toLowerCase().includes(cleanQuery) ||
          s.summary.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredPhotowalks = cleanQuery
    ? photowalks.filter(
        w =>
          w.title.toLowerCase().includes(cleanQuery) ||
          w.location.toLowerCase().includes(cleanQuery) ||
          w.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredExhibitions = cleanQuery
    ? exhibitions.filter(
        e =>
          e.title.toLowerCase().includes(cleanQuery) ||
          e.venue.toLowerCase().includes(cleanQuery) ||
          e.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredMagazines = cleanQuery
    ? magazines.filter(
        m =>
          m.title.toLowerCase().includes(cleanQuery) ||
          m.issueNumber.toLowerCase().includes(cleanQuery) ||
          m.theme.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults =
    filteredPhotos.length +
    filteredStories.length +
    filteredPhotowalks.length +
    filteredExhibitions.length +
    filteredMagazines.length;

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1918]/90 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-fade-in" id="search-modal">
      <div className="max-w-4xl w-full mx-auto bg-[#faf8f5] text-[#1a1918] p-6 sm:p-8 rounded-none shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-[#e6e1d8]">
        {/* Search Header */}
        <div className="flex items-center justify-between border-b border-[#e6e1d8] pb-4">
          <div className="flex items-center space-x-3 flex-1 mr-4">
            <Search className="w-5 h-5 text-[#8c8881]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by location (e.g., Agartala, Unakoti), photographer, story, festival..."
              className="w-full bg-transparent text-base sm:text-lg text-[#1a1918] placeholder-[#8c8881] focus:outline-none font-serif"
              autoFocus
            />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#8c8881] hover:text-[#1a1918] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto pt-6 space-y-8 pr-2">
          {!cleanQuery && (
            <div className="text-center py-12 space-y-3 text-[#8c8881]">
              <p className="font-serif text-lg text-[#1a1918]">Explore the Tripura Visual Archive</p>
              <p className="text-xs">Try searching for <span className="italic text-[#1a1918]">"Agartala"</span>, <span className="italic text-[#1a1918]">"Unakoti"</span>, <span className="italic text-[#1a1918]">"Neermahal"</span>, <span className="italic text-[#1a1918]">"Ananya Debbarma"</span>, or <span className="italic text-[#1a1918]">"LENS 4.0"</span></p>
            </div>
          )}

          {cleanQuery && totalResults === 0 && (
            <div className="text-center py-12 text-[#8c8881]">
              <p className="text-sm">No archive records found for "{query}".</p>
            </div>
          )}

          {/* Stories */}
          {filteredStories.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-[#8c8881] mb-3 font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#b85d38]" /> Visual Stories ({filteredStories.length})
              </h4>
              <div className="space-y-3">
                {filteredStories.map(story => (
                  <div
                    key={story.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      onNavigate(`/stories/${story.slug}`);
                    }}
                    className="flex items-center justify-between p-3 hover:bg-[#f2eee8] transition-colors cursor-pointer border-b border-[#e6e1d8]"
                  >
                    <div>
                      <p className="font-serif text-base font-normal">{story.title}</p>
                      <p className="text-xs text-[#8c8881]">
                        Photographs by {story.photographer} • {story.location}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8c8881]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Photos */}
          {filteredPhotos.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-[#8c8881] mb-3 font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#b85d38]" /> Gallery Photos ({filteredPhotos.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredPhotos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActivePhoto(photo);
                    }}
                    className="group relative cursor-pointer overflow-hidden bg-[#1a1918]"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-white text-[10px]">
                      <p className="font-medium truncate">{photo.title}</p>
                      <p className="opacity-80">{photo.photographer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exhibitions */}
          {filteredExhibitions.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-[#8c8881] mb-3 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#b85d38]" /> Exhibitions ({filteredExhibitions.length})
              </h4>
              <div className="space-y-2">
                {filteredExhibitions.map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      onNavigate(`/events/${ex.slug}`);
                    }}
                    className="p-3 hover:bg-[#f2eee8] transition-colors cursor-pointer border-b border-[#e6e1d8] flex justify-between items-center"
                  >
                    <div>
                      <p className="font-serif text-base font-normal">{ex.title} — {ex.edition}</p>
                      <p className="text-xs text-[#8c8881]">{ex.dates} • {ex.venue}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8c8881]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photowalks */}
          {filteredPhotowalks.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-[#8c8881] mb-3 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#b85d38]" /> Photowalks ({filteredPhotowalks.length})
              </h4>
              <div className="space-y-2">
                {filteredPhotowalks.map(pw => (
                  <div
                    key={pw.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      onNavigate(`/photowalks/${pw.slug}`);
                    }}
                    className="p-3 hover:bg-[#f2eee8] transition-colors cursor-pointer border-b border-[#e6e1d8] flex justify-between items-center"
                  >
                    <div>
                      <p className="font-serif text-base font-normal">{pw.title} ({pw.edition})</p>
                      <p className="text-xs text-[#8c8881]">{pw.date} • {pw.location}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8c8881]" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
