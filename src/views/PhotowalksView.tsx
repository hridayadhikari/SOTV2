import React from 'react';
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

interface PhotowalksViewProps {
  slug?: string;
  onNavigate: (path: string) => void;
}

export const PhotowalksView: React.FC<PhotowalksViewProps> = ({ slug, onNavigate }) => {
  const { photowalks, setActivePhoto } = useData();

  const selectedWalk = slug ? photowalks.find(w => w.slug === slug) : null;

  if (selectedWalk) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in" id="photowalk-detail-page">
        <button
          onClick={() => onNavigate('/photowalks')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8c8881] hover:text-[#1a1918] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Photowalks</span>
        </button>

        <header className="space-y-6 border-b border-[#e6e1d8] pb-10">
          <div className="flex items-center space-x-3 text-xs uppercase tracking-widest">
            <span className="text-[#b85d38] font-mono font-semibold">{selectedWalk.edition}</span>
            <span>•</span>
            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest ${
              selectedWalk.status === 'upcoming' ? 'bg-[#1a1918] text-[#faf8f5]' : 'bg-[#e6e1d8] text-[#5a5752]'
            }`}>
              {selectedWalk.status}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1a1918]">
            {selectedWalk.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5a5752] pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1a1918]" />
              <span>{selectedWalk.date} ({selectedWalk.time})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1a1918]" />
              <span>Meeting: {selectedWalk.meetingPoint}</span>
            </div>
          </div>
        </header>

        <div className="bg-[#1a1918]">
          <img
            src={selectedWalk.coverImage}
            alt={selectedWalk.title}
            className="w-full h-[450px] object-cover"
          />
        </div>

        <section className="space-y-8">
          <div className="text-base text-[#2b2a28] font-light leading-relaxed space-y-4">
            <p>{selectedWalk.description}</p>
          </div>

          {/* Route Highlights */}
          {selectedWalk.routeHighlights && selectedWalk.routeHighlights.length > 0 && (
            <div className="bg-[#f2eee8] p-6 border border-[#e6e1d8] space-y-3">
              <h3 className="font-serif text-xl font-normal text-[#1a1918]">Route Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5a5752]">
                {selectedWalk.routeHighlights.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#b85d38]" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Photo Gallery from Walk */}
          {selectedWalk.photos && selectedWalk.photos.length > 0 && (
            <div className="pt-8 border-t border-[#e6e1d8] space-y-6">
              <h3 className="font-serif text-2xl text-[#1a1918] font-light">
                Photowalk Moments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {selectedWalk.photos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setActivePhoto({
                      id: `pw_p_${i}`,
                      title: selectedWalk.title,
                      url: photo.url,
                      photographer: photo.photographer,
                      location: selectedWalk.location,
                      year: '2026',
                      category: 'Street',
                      caption: photo.caption
                    })}
                    className="group cursor-pointer bg-white border border-[#e6e1d8] p-3 space-y-2"
                  >
                    <img src={photo.url} alt={photo.caption} className="w-full h-64 object-cover" />
                    <p className="text-xs text-[#5a5752] italic">{photo.caption} — Photo by {photo.photographer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedWalk.status === 'upcoming' && (
            <div className="p-8 bg-[#1a1918] text-[#faf8f5] text-center space-y-4">
              <h3 className="font-serif text-2xl font-light">Join Us on this Walk</h3>
              <p className="text-xs text-[#a39c90]">Photowalks are free and open to photographers of all skill levels. Bring your camera or phone.</p>
              <button
                onClick={() => onNavigate('/join')}
                className="bg-[#faf8f5] text-[#1a1918] px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#e6e1d8] transition-colors"
              >
                Register for Walk →
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="photowalks-index-page">
      <div className="border-b border-[#e6e1d8] pb-8 space-y-4">
        <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
          Community Street Outings
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1a1918]">
          PHOTOWALKS ARCHIVE
        </h1>
        <p className="text-sm text-[#5a5752] max-w-2xl font-light">
          Photowalks bring people together to observe, document, and connect through photography across the streets, markets, and hills of Tripura.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {photowalks.map(walk => (
          <div
            key={walk.id}
            onClick={() => onNavigate(`/photowalks/${walk.slug}`)}
            className="bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all p-6 cursor-pointer group space-y-4 shadow-xs"
          >
            <div className="overflow-hidden bg-[#1a1918] h-60">
              <img
                src={walk.coverImage}
                alt={walk.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#b85d38] font-mono font-semibold">{walk.edition}</span>
              <span className="text-[#8c8881]">{walk.date}</span>
            </div>
            <h3 className="font-serif text-2xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors">
              {walk.title}
            </h3>
            <p className="text-xs text-[#5a5752] line-clamp-2 font-light">
              {walk.description}
            </p>
            <div className="pt-4 border-t border-[#e6e1d8] flex justify-between items-center text-xs text-[#1a1918] font-semibold uppercase tracking-wider">
              <span>{walk.status === 'upcoming' ? 'Upcoming Event' : 'Completed Walk'}</span>
              <span>Explore Walk →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
