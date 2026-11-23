import React from 'react';
import { ArrowUpRight, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1918] text-[#faf8f5] pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#2b2a28]" id="app-footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#2b2a28]">
          {/* Brand Heading */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-[#faf8f5] uppercase leading-tight">
              Streets<br />
              Of<br />
              Tripura
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#8c8881]">
              Photography • Community • Culture
            </p>
            <p className="text-sm text-[#a39c90] font-light max-w-sm leading-relaxed">
              A youth-led creative platform and independent digital archive documenting the people, places, culture, and everyday life across Tripura and Northeast India.
            </p>
            
            <div className="pt-2 space-y-2">
              <div>
                <a
                  href="mailto:contact@streetsoftripura.in"
                  className="inline-flex items-center space-x-2 text-sm text-[#faf8f5] hover:text-[#b85d38] transition-colors border-b border-[#faf8f5]/30 pb-1"
                >
                  <span>contact@streetsoftripura.in</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8c8881] mb-4 font-semibold">
                Archive Navigation
              </p>
              <ul className="space-y-2.5 text-xs tracking-wider uppercase text-[#a39c90]">
                <li>
                  <button onClick={() => handleLinkClick('/gallery')} className="hover:text-[#faf8f5] transition-colors">
                    Gallery & Stories
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('/events')} className="hover:text-[#faf8f5] transition-colors">
                    Events
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('/photowalks')} className="hover:text-[#faf8f5] transition-colors">
                    Photowalks
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('/magazine')} className="hover:text-[#faf8f5] transition-colors">
                    Magazine
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('/collaborations')} className="hover:text-[#faf8f5] transition-colors">
                    Collaborations
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8c8881] mb-4 font-semibold">
                Collective
              </p>
              <ul className="space-y-2.5 text-xs tracking-wider uppercase text-[#a39c90]">
                <li>
                  <button onClick={() => handleLinkClick('/about')} className="hover:text-[#faf8f5] transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('/team')} className="hover:text-[#faf8f5] transition-colors">
                    Team & Advisory
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('/press')} className="hover:text-[#faf8f5] transition-colors">
                    Press & Media
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('/contact')} className="hover:text-[#faf8f5] transition-colors">
                    Contact
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('/join')} className="hover:text-[#faf8f5] transition-colors text-[#b85d38] font-semibold pt-1">
                    Join Community →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & Location */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8c8881] mb-4 font-semibold">
                Connect With Us
              </p>
              <div className="flex space-x-4 text-[#a39c90]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-[#2b2a28] hover:border-[#faf8f5] hover:text-[#faf8f5] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-[#2b2a28] hover:border-[#faf8f5] hover:text-[#faf8f5] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-[#2b2a28] hover:border-[#faf8f5] hover:text-[#faf8f5] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-[#2b2a28] hover:border-[#faf8f5] hover:text-[#faf8f5] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="text-xs text-[#8c8881] space-y-1">
              <p className="text-[#faf8f5] font-medium">Headquarters</p>
              <p>Agartala, West Tripura, PIN 799001</p>
              <p>Tripura, India</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8c8881] gap-4">
          <p>© Streets of Tripura. A venture of Chitranidhi.</p>
          <div className="flex items-center space-x-6 text-[11px] uppercase tracking-wider">
            <span>Visual Archive</span>
            <span>•</span>
            <span>Agartala</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
