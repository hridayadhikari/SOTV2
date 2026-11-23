import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';

interface CollaborationsViewProps {
  slug?: string;
  onNavigate: (path: string) => void;
}

export const CollaborationsView: React.FC<CollaborationsViewProps> = ({ slug, onNavigate }) => {
  const { collaborations } = useData();

  const selectedCollab = slug ? collaborations.find(c => c.slug === slug) : null;

  if (selectedCollab) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in" id="collaboration-detail-page">
        <button
          onClick={() => onNavigate('/collaborations')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8c8881] hover:text-[#1a1918] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collaborations</span>
        </button>

        <header className="space-y-4 border-b border-[#e6e1d8] pb-8">
          <div className="flex items-center space-x-3 text-xs font-mono text-[#b85d38] uppercase">
            <span>STREETS OF TRIPURA</span>
            <span>×</span>
            <span className="text-[#1a1918] font-semibold">{selectedCollab.partnerName}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1a1918]">
            {selectedCollab.projectName}
          </h1>
          <p className="text-xs text-[#8c8881] font-mono">Initiated: {selectedCollab.year}</p>
        </header>

        <div className="bg-[#1a1918]">
          <img src={selectedCollab.coverImage} alt={selectedCollab.projectName} className="w-full h-[400px] object-cover" />
        </div>

        <section className="space-y-8 text-base text-[#2b2a28] font-light leading-relaxed">
          <div className="p-6 bg-[#f2eee8] border-l-2 border-[#1a1918] space-y-2">
            <h3 className="font-serif text-lg font-medium text-[#1a1918]">Project Summary & Impact</h3>
            <p className="text-sm text-[#5a5752]">{selectedCollab.fullStory}</p>
          </div>

          <div className="pt-4 border-t border-[#e6e1d8]">
            <h4 className="text-xs uppercase tracking-widest text-[#8c8881] font-semibold mb-2">Key Outcome</h4>
            <p className="text-sm font-semibold text-[#1a1918]">{selectedCollab.outcome}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="collaborations-index-page">
      <div className="border-b border-[#e6e1d8] pb-8 space-y-4">
        <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
          Joint Initiatives & Partnerships
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1a1918]">
          FRIENDS & COLLABORATIONS
        </h1>
        <p className="text-sm text-[#5a5752] max-w-2xl font-light">
          We collaborate with NGOs, health societies, cultural departments, and educational institutions to use photography as a force for social awareness and heritage documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collaborations.map(collab => (
          <div
            key={collab.id}
            onClick={() => onNavigate(`/collaborations/${collab.slug}`)}
            className="bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all p-8 space-y-6 cursor-pointer group shadow-xs"
          >
            <div className="flex items-center space-x-3 text-xs font-mono text-[#b85d38]">
              <span>STREETS OF TRIPURA</span>
              <span>×</span>
              <span className="text-[#1a1918] font-bold">{collab.partnerName}</span>
            </div>

            <h3 className="font-serif text-2xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors">
              {collab.projectName}
            </h3>

            <p className="text-xs text-[#5a5752] font-light leading-relaxed">
              {collab.summary}
            </p>

            <div className="pt-4 border-t border-[#e6e1d8] flex justify-between items-center text-xs text-[#1a1918] font-semibold uppercase tracking-wider">
              <span>{collab.year}</span>
              <span className="flex items-center gap-1">Read Collaboration Story <ExternalLink className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
