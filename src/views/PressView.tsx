import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';

export const PressView: React.FC = () => {
  const { press } = useData();

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in" id="press-page">
      <div className="border-b border-[#e6e1d8] pb-6 space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
          Media Features
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1a1918]">
          PRESS & COVERAGE
        </h1>
      </div>

      <div className="space-y-6">
        {press.map(item => (
          <div key={item.id} className="bg-white border border-[#e6e1d8] p-6 space-y-3 shadow-xs">
            <div className="flex justify-between items-center text-xs text-[#8c8881]">
              <span className="font-semibold text-[#1a1918]">{item.publication}</span>
              <span>{item.date}</span>
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#1a1918]">
              "{item.headline}"
            </h3>
            <p className="text-xs text-[#5a5752] font-light leading-relaxed">
              {item.summary}
            </p>
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#b85d38] font-semibold pt-1">
                <span>Read Full Article</span> <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
