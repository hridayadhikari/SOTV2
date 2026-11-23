import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Camera,
  Trophy,
  Clock,
  UserCheck,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Gift,
  Heart
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { EventCategory } from '../types';

interface EventsViewProps {
  slug?: string;
  onNavigate: (path: string) => void;
}

type MainTab = 'exhibitions' | 'events';

const EXHIBITION_CATEGORIES: EventCategory[] = [
  'Photography & Art Exhibitions',
  'Photography Exhibition (Collaboration)'
];

const EVENT_CATEGORIES: EventCategory[] = [
  'Anniversary Celebrations + Photography Competition',
  'Partnerships & Competitions'
];

export const EventsView: React.FC<EventsViewProps> = ({ slug, onNavigate }) => {
  const { events } = useData();
  const [activeTab, setActiveTab] = useState<MainTab>('exhibitions');

  // Single event detail matching if slug is passed
  const selectedEvent = slug ? events.find(e => e.slug === slug) : null;

  if (selectedEvent) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in" id="event-detail-page">
        <button
          onClick={() => onNavigate('/events')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8c8881] hover:text-[#1a1918] transition-colors"
          id="back-to-events-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Programs</span>
        </button>

        <header className="space-y-6 border-b border-[#e6e1d8] pb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[#b85d38] font-mono">
            <span>{selectedEvent.type || selectedEvent.category}</span>
            <span>•</span>
            <span className="text-[#8c8881] capitalize">{selectedEvent.status || 'Completed'} Archive</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1a1918]">
            {selectedEvent.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-xs text-[#5a5752]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1a1918]" />
              <span className="font-mono text-[#1a1918]">{selectedEvent.dates}</span>
            </div>
            {selectedEvent.time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1a1918]" />
                <span className="font-mono text-[#1a1918]">{selectedEvent.time}</span>
              </div>
            )}
            {(selectedEvent.venue || selectedEvent.location) && (
              <div className="flex items-center gap-2 sm:col-span-2 md:col-span-1">
                <MapPin className="w-4 h-4 text-[#1a1918]" />
                <span>{selectedEvent.venue ? `${selectedEvent.venue}, ` : ''}{selectedEvent.location}</span>
              </div>
            )}
          </div>

          {(selectedEvent.organizedBy || selectedEvent.inCollaborationWith || selectedEvent.sponsor) && (
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#e6e1d8] text-xs text-[#5a5752]">
              {selectedEvent.organizedBy && (
                <div>
                  <span className="text-[#8c8881] uppercase tracking-wider block text-[10px]">Organized By</span>
                  <strong className="text-[#1a1918] font-medium">{selectedEvent.organizedBy}</strong>
                </div>
              )}
              {selectedEvent.inCollaborationWith && (
                <div>
                  <span className="text-[#8c8881] uppercase tracking-wider block text-[10px]">In Collaboration With</span>
                  <strong className="text-[#1a1918] font-medium">{selectedEvent.inCollaborationWith}</strong>
                </div>
              )}
              {selectedEvent.sponsor && (
                <div>
                  <span className="text-[#8c8881] uppercase tracking-wider block text-[10px]">Sponsor</span>
                  <strong className="text-[#b85d38] font-medium">{selectedEvent.sponsor}</strong>
                </div>
              )}
            </div>
          )}
        </header>

        {selectedEvent.coverImage && (
          <div className="bg-[#1a1918] overflow-hidden">
            <img
              src={selectedEvent.coverImage}
              alt={selectedEvent.title}
              className="w-full h-[450px] object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-4">
              <h3 className="font-serif text-2xl text-[#1a1918] font-normal">Overview</h3>
              <p className="text-sm text-[#5a5752] font-light leading-relaxed">
                {selectedEvent.description}
              </p>
            </section>

            {selectedEvent.occasion && (
              <section className="space-y-2 bg-[#faf8f5] p-5 border-l-2 border-[#1a1918]">
                <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold block">Occasion</span>
                <p className="font-serif text-lg font-medium text-[#1a1918]">{selectedEvent.occasion}</p>
              </section>
            )}

            {selectedEvent.theme && (
              <section className="space-y-2 bg-[#f2eee8] p-5 border-l-2 border-[#b85d38]">
                <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold block">Official Theme</span>
                <p className="font-serif text-lg italic text-[#1a1918]">"{selectedEvent.theme}"</p>
              </section>
            )}

            {selectedEvent.inMemoryOf && selectedEvent.inMemoryOf.length > 0 && (
              <section className="space-y-2 bg-[#faf8f5] p-5 border border-[#e6e1d8] flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#b85d38] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold block">In Memory Of</span>
                  <strong className="text-sm font-serif text-[#1a1918]">{selectedEvent.inMemoryOf.join(', ')}</strong>
                </div>
              </section>
            )}

            {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-[#e6e1d8]">
                <h4 className="text-xs uppercase tracking-widest text-[#1a1918] font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#b85d38]" /> Events & Highlights
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5a5752]">
                  {selectedEvent.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 bg-[#faf8f5] p-3 border border-[#e6e1d8]">
                      <span className="text-[#b85d38] font-mono font-bold">•</span>
                      <span className="text-[#1a1918] font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {selectedEvent.competitionCategories && selectedEvent.competitionCategories.length > 0 && (
              <section className="space-y-3 pt-6 border-t border-[#e6e1d8]">
                <h4 className="text-xs uppercase tracking-widest text-[#1a1918] font-semibold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#b85d38]" /> Competition Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.competitionCategories.map((c, i) => (
                    <span key={i} className="text-xs font-mono bg-[#f2eee8] px-3 py-1 text-[#1a1918] border border-[#e6e1d8]">
                      {c}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {selectedEvent.workshopInfo && (
              <section className="space-y-3 pt-6 border-t border-[#e6e1d8]">
                <h4 className="text-xs uppercase tracking-widest text-[#1a1918] font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#b85d38]" /> Workshop Details
                </h4>
                <p className="text-xs text-[#5a5752] leading-relaxed bg-[#f2eee8] p-4 border-l-2 border-[#1a1918]">
                  {selectedEvent.workshopInfo}
                </p>
              </section>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            {selectedEvent.prizePool && (
              <div className="bg-white border border-[#e6e1d8] p-6 space-y-2 shadow-xs">
                <h4 className="text-xs uppercase tracking-widest text-[#8c8881] font-semibold flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#b85d38]" /> Prize Pool & Rewards
                </h4>
                <p className="text-sm text-[#1a1918] font-semibold font-mono">{selectedEvent.prizePool}</p>
              </div>
            )}

            {selectedEvent.winners && selectedEvent.winners.length > 0 && (
              <div className="bg-[#fbfbfb] border-2 border-[#a10000] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#c5c2c2] pb-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#a10000] font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#a10000]" /> Official Winners Roster
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-[#a10000] text-[#fbfbfb] px-2 py-0.5 font-bold">
                    {selectedEvent.winners.length} {selectedEvent.winners.length === 1 ? 'Winner' : 'Winners'}
                  </span>
                </div>
                <div className="space-y-2.5 pt-1 divide-y divide-[#c5c2c2]/50">
                  {selectedEvent.winners.map((w, idx) => (
                    <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <strong className="text-[#000000] block font-semibold text-sm">{w.name}</strong>
                        {w.section && <span className="text-[11px] text-[#5a5752] block font-light">{w.section}</span>}
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[#a10000] bg-[#a10000]/10 px-2.5 py-1 border border-[#a10000]/20 shrink-0">
                        {w.rank}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEvent.winnerAnnouncement && (
              <div className="bg-white border border-[#e6e1d8] p-6 space-y-2 shadow-xs">
                <h4 className="text-xs uppercase tracking-widest text-[#8c8881] font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#b85d38]" /> Winner Announcement
                </h4>
                <p className="text-xs text-[#5a5752]">{selectedEvent.winnerAnnouncement}</p>
              </div>
            )}

            {selectedEvent.mentors && selectedEvent.mentors.length > 0 && (
              <div className="bg-white border border-[#e6e1d8] p-6 space-y-3 shadow-xs">
                <h4 className="text-xs uppercase tracking-widest text-[#8c8881] font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#b85d38]" /> Mentors & Jury
                </h4>
                <div className="space-y-3 pt-2">
                  {selectedEvent.mentors.map((m, idx) => (
                    <div key={idx} className="border-b border-[#f2eee8] pb-2 last:border-b-0">
                      <strong className="text-xs text-[#1a1918] block">{m.name}</strong>
                      <span className="text-[11px] text-[#5a5752] block">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEvent.specialGuests && selectedEvent.specialGuests.length > 0 && (
              <div className="bg-white border border-[#e6e1d8] p-6 space-y-3 shadow-xs">
                <h4 className="text-xs uppercase tracking-widest text-[#8c8881] font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#b85d38]" /> Special Guests
                </h4>
                <ul className="space-y-1.5 text-xs text-[#1a1918] font-medium pt-1">
                  {selectedEvent.specialGuests.map((g, i) => (
                    <li key={i}>• {g}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEvent.contestInfo && selectedEvent.contestInfo.toLowerCase() !== 'none' && (
              <div className="bg-white border border-[#e6e1d8] p-6 space-y-2 shadow-xs">
                <h4 className="text-xs uppercase tracking-widest text-[#8c8881] font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#b85d38]" /> Photography Contest
                </h4>
                <p className="text-xs text-[#1a1918] font-mono">{selectedEvent.contestInfo}</p>
              </div>
            )}

            {selectedEvent.guests && selectedEvent.guests.length > 0 && (
              <div className="bg-[#faf8f5] border border-[#e6e1d8] p-6 space-y-2">
                <h4 className="text-xs uppercase tracking-widest text-[#8c8881] font-semibold">Guests</h4>
                <p className="text-xs text-[#5a5752] italic">{selectedEvent.guests.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const exhibitionEvents = events.filter(e => EXHIBITION_CATEGORIES.includes(e.category));
  const otherEvents = events.filter(e => EVENT_CATEGORIES.includes(e.category));

  const currentTabEvents = activeTab === 'exhibitions' ? exhibitionEvents : otherEvents;

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in" id="events-index-page">
      {/* Header */}
      <div className="border-b border-[#e6e1d8] pb-8 space-y-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
          <span>Streets of Tripura Archive & Calendar</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1a1918]">
          EXHIBITIONS & EVENTS ARCHIVE
        </h1>
        <p className="text-sm text-[#5a5752] max-w-2xl font-light leading-relaxed">
          Explore our complete archive of official photography exhibitions, anniversary celebrations, competitions, and memorial photowalks.
        </p>
      </div>

      {/* Two Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-[#e6e1d8] pb-2" id="main-two-tabs-nav">
        <button
          onClick={() => setActiveTab('exhibitions')}
          className={`px-6 py-3 text-xs uppercase tracking-widest transition-all flex items-center gap-2.5 font-semibold ${
            activeTab === 'exhibitions'
              ? 'bg-[#1a1918] text-[#faf8f5] shadow-xs'
              : 'bg-white border border-[#e6e1d8] text-[#5a5752] hover:text-[#1a1918] hover:border-[#1a1918]'
          }`}
          id="tab-exhibitions"
        >
          <Camera className="w-4 h-4" />
          <span>Exhibitions ({exhibitionEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-6 py-3 text-xs uppercase tracking-widest transition-all flex items-center gap-2.5 font-semibold ${
            activeTab === 'events'
              ? 'bg-[#1a1918] text-[#faf8f5] shadow-xs'
              : 'bg-white border border-[#e6e1d8] text-[#5a5752] hover:text-[#1a1918] hover:border-[#1a1918]'
          }`}
          id="tab-events"
        >
          <Trophy className="w-4 h-4" />
          <span>Events & Competitions ({otherEvents.length})</span>
        </button>
      </div>

      {/* Unified Grid under Active Main Tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="events-unified-grid">
        {currentTabEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => onNavigate(`/events/${evt.slug}`)}
            className="bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all p-6 cursor-pointer group shadow-xs flex flex-col justify-between"
            id={`event-card-${evt.id}`}
          >
            <div className="space-y-4">
              {evt.coverImage && (
                <div className="aspect-[16/10] bg-[#1a1918] overflow-hidden -mx-6 -mt-6 mb-4">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#b85d38] font-semibold px-2 py-0.5 bg-[#faf8f5] border border-[#e6e1d8] truncate">
                  {evt.type || evt.category}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#f2eee8] text-[#5a5752] shrink-0">
                  Completed
                </span>
              </div>

              <h3 className="font-serif text-2xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors leading-snug">
                {evt.title}
              </h3>

              <p className="text-xs text-[#5a5752] font-light leading-relaxed line-clamp-3">
                {evt.description}
              </p>

              {evt.theme && (
                <div className="text-[11px] font-serif italic text-[#1a1918] bg-[#faf8f5] p-2 border-l-2 border-[#b85d38]">
                  "{evt.theme}"
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#e6e1d8] mt-6 space-y-1.5 text-xs text-[#1a1918]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[#b85d38] font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{evt.dates}</span>
                </div>
                {evt.time && (
                  <span className="text-[10px] font-mono text-[#8c8881]">{evt.time}</span>
                )}
              </div>
              {(evt.venue || evt.location) && (
                <div className="flex items-center gap-1 text-[#8c8881] text-[11px] truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{evt.venue ? `${evt.venue}, ` : ''}{evt.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
