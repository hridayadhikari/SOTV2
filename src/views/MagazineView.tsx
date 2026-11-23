import React from 'react';
import { BookOpen, Mail, ArrowRight, Camera } from 'lucide-react';

interface MagazineViewProps {
  id?: string;
  onNavigate: (path: string) => void;
}

export const MagazineView: React.FC<MagazineViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in" id="magazine-page">
      {/* Editorial Header */}
      <div className="border-b border-[#e6e1d8] pb-8 space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
          Publications & Printed Matter
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1a1918]">
          STREETS JOURNAL & MAGAZINE
        </h1>
        <p className="text-sm text-[#5a5752] max-w-2xl font-light leading-relaxed">
          An upcoming independent visual arts and documentary publication celebrating photographic stories, culture, and life across Tripura.
        </p>
      </div>

      {/* Coming Soon Notice Card */}
      <div className="bg-white border border-[#e6e1d8] p-8 sm:p-12 md:p-16 text-center space-y-8 shadow-xs relative overflow-hidden">
        {/* Subtle Decorative Backdrop Accent */}
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-[#f2eee8] rounded-full opacity-60 pointer-events-none" />
        
        <div className="mx-auto w-16 h-16 bg-[#faf8f5] border border-[#e6e1d8] flex items-center justify-center text-[#b85d38]">
          <BookOpen className="w-8 h-8" />
        </div>

        <div className="space-y-3 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1918] text-[#faf8f5] text-[10px] font-mono uppercase tracking-widest">
            <span>Coming Soon</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918] tracking-tight">
            No Magazine Yet
          </h2>

          <p className="text-sm text-[#5a5752] font-light leading-relaxed">
            Our editorial collective is currently curating and designing the inaugural issue of Streets Journal. Each volume will feature curated photography portfolios, essays on memory and place, and exclusive dialogues with visual storytellers.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-6 border-t border-[#e6e1d8] text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#b85d38] font-semibold">01 / Curated Portfolios</span>
            <p className="text-xs text-[#5a5752] font-light">High-fidelity photo essays documenting everyday life and heritage in Tripura.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#b85d38] font-semibold">02 / Photographer Essays</span>
            <p className="text-xs text-[#5a5752] font-light">In-depth perspectives and artist statements from regional practitioners.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#b85d38] font-semibold">03 / Limited Print Runs</span>
            <p className="text-xs text-[#5a5752] font-light">Archival quality physical copies and interactive digital spreads.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('/gallery')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1918] text-[#faf8f5] text-xs uppercase tracking-widest hover:bg-[#b85d38] transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Explore Photo Archive</span>
          </button>

          <a
            href="mailto:contact@streetsoftripura.in?subject=Magazine%20Notification%20Inquiry"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#e6e1d8] text-[#1a1918] text-xs uppercase tracking-widest hover:bg-[#faf8f5] transition-colors"
          >
            <Mail className="w-4 h-4 text-[#8c8881]" />
            <span>Inquire About Launch</span>
          </a>
        </div>
      </div>
    </div>
  );
};
