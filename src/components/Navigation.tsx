import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsSearchOpen } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparentHero = currentPath === '/' && !isScrolled;

  const navItems = [
    { label: 'Gallery', path: '/gallery' },
    { label: 'Events', path: '/events' },
    { label: 'Photowalks', path: '/photowalks' },
    { label: 'Magazine', path: '/magazine' },
    { label: 'About', path: '/about' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isTransparentHero
            ? 'bg-gradient-to-b from-black/70 via-black/25 to-transparent py-5 sm:py-6'
            : isScrolled
            ? 'bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e6e1d8] py-3.5 shadow-2xs'
            : 'bg-[#faf8f5] border-b border-[#e6e1d8] py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="text-left group focus:outline-none"
            id="nav-logo-btn"
          >
            <span
              className={`font-serif text-lg sm:text-xl font-medium tracking-wider uppercase block leading-none transition-colors ${
                isTransparentHero ? 'text-white [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]' : 'text-[#1a1918]'
              }`}
            >
              Streets of Tripura
            </span>
            <span
              className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase block mt-1 font-sans font-normal ${
                isTransparentHero ? 'text-white/80 [text-shadow:_0_1px_6px_rgba(0,0,0,0.6)]' : 'text-[#8c8881]'
              }`}
            >
              YOUTH-LED CREATIVE PLATFORM
            </span>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-7" id="desktop-nav">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`text-[11px] sm:text-xs uppercase tracking-[0.18em] transition-colors relative py-1 focus:outline-none ${
                    isTransparentHero
                      ? isActive
                        ? 'text-white font-semibold [text-shadow:_0_1px_6px_rgba(0,0,0,0.6)]'
                        : 'text-white/85 hover:text-white [text-shadow:_0_1px_6px_rgba(0,0,0,0.6)]'
                      : isActive
                      ? 'text-[#1a1918] font-semibold'
                      : 'text-[#5a5752] hover:text-[#1a1918]'
                  }`}
                  id={`nav-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[1.5px] ${
                        isTransparentHero ? 'bg-white' : 'bg-[#1a1918]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 transition-colors focus:outline-none ${
                isTransparentHero ? 'text-white hover:text-white/80' : 'text-[#1a1918] hover:text-[#b85d38]'
              }`}
              title="Search Archive"
              aria-label="Search Archive"
              id="search-trigger-btn"
            >
              <Search className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>

            <button
              onClick={() => handleNavClick('/join')}
              className={`hidden sm:inline-block text-xs uppercase tracking-[0.2em] px-4 py-2 transition-all font-medium rounded-none ${
                isTransparentHero
                  ? 'border border-white/60 text-white hover:bg-white hover:text-black [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)]'
                  : 'bg-[#1a1918] text-[#faf8f5] hover:bg-black'
              }`}
              id="nav-join-btn"
            >
              JOIN US
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 lg:hidden focus:outline-none ${
                isTransparentHero ? 'text-white' : 'text-[#1a1918]'
              }`}
              aria-label="Toggle menu"
              id="mobile-menu-toggle-btn"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#faf8f5] pt-28 px-6 pb-12 flex flex-col justify-between overflow-y-auto lg:hidden">
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-widest text-[#8c8881] border-b border-[#e6e1d8] pb-2">
              Navigation Menu
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavClick('/')}
                className={`text-left font-serif text-3xl font-light ${
                  currentPath === '/' ? 'text-[#1a1918] italic font-normal' : 'text-[#5a5752]'
                }`}
              >
                Home
              </button>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`text-left font-serif text-3xl font-light ${
                    currentPath.startsWith(item.path) ? 'text-[#1a1918] italic font-normal' : 'text-[#5a5752]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#e6e1d8] space-y-4">
            <button
              onClick={() => handleNavClick('/join')}
              className="w-full bg-[#1a1918] text-[#faf8f5] py-3 text-xs uppercase tracking-[0.2em] font-medium text-center"
            >
              JOIN US
            </button>
            <div className="flex justify-between items-center text-xs text-[#8c8881] pt-2">
              <span>Agartala, Tripura</span>
              <span className="text-[11px] uppercase tracking-wider text-[#8c8881]">Youth-Led Creative Platform</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
