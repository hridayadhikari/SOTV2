import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowRight, Camera, MapPin, Calendar, Award, Users, Globe, Building2, Trophy, ShieldCheck, Landmark, Film, Footprints, GalleryVerticalEnd, Aperture, Handshake, BookImage, Target } from 'lucide-react';
import { useData } from '../context/DataContext';
import { HERO_PHOTOS } from '../data/initialData';
import { PhotoCategory } from '../types';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const {
    photos,
    stories,
    photowalks,
    exhibitions,
    magazines,
    collaborations,
    photographers,
    teamMembers,
    timeline,
    press,
    setActivePhoto,
    heroPhotos
  } = useData();

  // Hero state & auto-rotation
  const [heroIndex, setHeroIndex] = useState(0);
  const defaultHero: HeroPhoto = {
    url: '',
    title: 'Streets of Tripura',
    location: 'Agartala, Tripura',
    photographer: 'Streets of Tripura',
    year: '2025',
    alignment: 'bottom-left'
  };

  const activeHeroList = heroPhotos && heroPhotos.length > 0 ? heroPhotos : HERO_PHOTOS;
  const currentHero = activeHeroList[heroIndex] || activeHeroList[0] || defaultHero;

  useEffect(() => {
    if (activeHeroList.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % activeHeroList.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [activeHeroList.length]);

  // Gallery category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = ['All', 'Street', 'Documentary', 'Culture', 'People', 'Landscape', 'Travel', 'Events'];

  const filteredGalleryPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter(p => p.category === selectedCategory);

  const getAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return {
          container: 'justify-center items-start text-left my-auto self-start',
          textWidth: 'max-w-xl md:max-w-md lg:max-w-xl'
        };
      case 'right':
        return {
          container: 'justify-center items-end text-left md:text-right my-auto self-end ml-auto',
          textWidth: 'max-w-xl md:max-w-md lg:max-w-xl'
        };
      case 'bottom-right':
        return {
          container: 'justify-end items-end text-left md:text-right mt-auto self-end ml-auto pb-12 sm:pb-16',
          textWidth: 'max-w-xl md:max-w-md lg:max-w-xl'
        };
      case 'bottom-left':
      default:
        return {
          container: 'justify-end items-start text-left mt-auto self-start pb-12 sm:pb-16',
          textWidth: 'max-w-xl md:max-w-md lg:max-w-xl'
        };
    }
  };

  return (
    <div className="space-y-0" id="homepage-root">
      {/* 01. HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-[#0e0d0c] text-white" id="hero-section">
        {/* Full Bleed Crossfading Hero Photographs */}
        <div className="absolute inset-0 z-0">
          {activeHeroList.map((photo, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === heroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Subtle localized bottom vignette for contrast & text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-28 sm:pt-32 pb-8 sm:pb-10">
          {/* Main Statement Positioned According to Hero Image Alignment */}
          <div className={`w-full flex flex-col ${getAlignmentClasses(currentHero.alignment).container}`}>
            <div className={`space-y-3 sm:space-y-4 ${getAlignmentClasses(currentHero.alignment).textWidth}`}>
              <div className="inline-block bg-[#1a1918]/80 backdrop-blur-xs px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium text-white/90 border border-white/20">
                STREETS of TRIPURA
              </div>
              {/* Editorial Headline */}
              <h1 className="font-serif text-[42px] sm:text-[64px] lg:text-[78px] font-normal leading-[1.02] text-white tracking-tight [text-shadow:_0_2px_12px_rgba(0,0,0,0.85)]">
                Streets of Tripura
              </h1>

              {/* Sub-statement */}
              <p className="text-sm sm:text-base font-serif italic text-white/95 leading-relaxed tracking-wide max-w-lg [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
                Connecting photographers and sharing stories from the streets.
              </p>
              
              <div className="text-xs sm:text-sm font-sans font-light text-white/90 space-y-1 [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
                <p className="font-semibold text-white tracking-wider uppercase">Agartala, Tripura</p>
              </div>

              {/* Text CTA */}
              <div className="pt-3 sm:pt-4">
                <button
                  onClick={() => onNavigate('/join')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-white border-b border-white/70 pb-1 hover:border-white hover:text-white/80 transition-all group focus:outline-none"
                  id="hero-join-btn"
                >
                  <span>JOIN OUR COMMUNITY</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Subtle Dots/Line Indicators + Photographer Attribution */}
          <div className="flex items-end justify-between w-full pt-4 border-t border-white/15">
            {/* Extremely subtle carousel indicators */}
            <div className="flex items-center space-x-2">
              {activeHeroList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-[2px] transition-all duration-500 focus:outline-none ${
                    idx === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white/35 hover:bg-white/60'
                  }`}
                  aria-label={`View photograph ${idx + 1}`}
                />
              ))}
            </div>

            {/* Bottom-Right Photographer Credit */}
            <div className="text-right font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/90 leading-tight [text-shadow:_0_1px_6px_rgba(0,0,0,0.85)]">
              <p className="font-semibold text-white">{currentHero.location} · {currentHero.year}</p>
              <p className="text-white/75 mt-0.5 font-normal">PHOTOGRAPH BY {currentHero.photographer}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 02. ABOUT STREETS OF TRIPURA */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] border-b border-[#e6e1d8]" id="intro-section">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold block">
              02 / Introduction
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#1a1918] leading-[1.1] tracking-tight">
              Capturing Stories, Preserving Moments, Celebrating Culture.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            <div className="md:col-span-8 space-y-6 text-base sm:text-lg text-[#5a5752] font-light leading-relaxed">
              <p>
                Streets of Tripura is more than just a photography community—it’s a movement dedicated to showcasing the essence of Tripura through the lens of passionate photographers.
              </p>
              <p>
                Founded with the vision of creating a platform for photographers—both budding and professional—we aim to bring out the hidden narratives of life, culture, and emotions that define our land.
              </p>
              <p>
                Through exhibitions, workshops, competitions, and collaborations, we foster a thriving community where creativity meets purpose.
              </p>
              <p>
                Whether you're a photographer, an art enthusiast, or someone who simply appreciates the beauty of everyday life, Streets of Tripura welcomes you to be part of this journey.
              </p>
              <p className="font-serif italic text-xl text-[#1a1918]">
                📷 Join us in capturing the unseen.
              </p>
            </div>

            <div className="md:col-span-4 flex items-end">
              <button
                onClick={() => {
                  onNavigate('/about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#1a1918] hover:text-[#b85d38] font-semibold transition-colors border-b border-[#1a1918] pb-1"
                id="intro-story-btn"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 03. WHAT WE DO */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] border-b border-[#e6e1d8]" id="what-we-do-section">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold block">
                03 / Core Activities
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1a1918] leading-[1.05]">
                What We Do
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm text-[#5a5752] font-light leading-relaxed">
                From dawn street walks to curated exhibitions in public spaces — we create shared experiences that connect photographers, preserve culture, and amplify Tripura's visual identity.
              </p>
            </div>
          </div>

          {/* Top Row: 2 large feature cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Street Photowalks */}
            <div className="group relative bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all duration-300 p-8 sm:p-10 flex flex-col justify-between min-h-[280px] shadow-2xs hover:shadow-md">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#1a1918] text-[#faf8f5] flex items-center justify-center">
                      <Footprints className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c4bfb6]">01</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#b85d38] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918] leading-tight group-hover:text-[#b85d38] transition-colors duration-300">
                  Street Photowalks
                </h3>
                <p className="text-sm text-[#5a5752] font-light leading-relaxed max-w-md">
                  Regular collective walks through Agartala's markets, riverbanks, old quarters, and surrounding villages — camera in hand, stories at every turn.
                </p>
              </div>
              <div className="pt-6 border-t border-[#e6e1d8] mt-6 flex items-center gap-6 text-[10px] uppercase tracking-widest text-[#8c8881]">
                <span>43+ Walks Completed</span>
                <span>•</span>
                <span>Open to All Levels</span>
              </div>
            </div>

            {/* Card 2: Photography Exhibitions */}
            <div className="group relative bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all duration-300 p-8 sm:p-10 flex flex-col justify-between min-h-[280px] shadow-2xs hover:shadow-md">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#1a1918] text-[#faf8f5] flex items-center justify-center">
                      <GalleryVerticalEnd className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c4bfb6]">02</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#b85d38] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918] leading-tight group-hover:text-[#b85d38] transition-colors duration-300">
                  Photography Exhibitions
                </h3>
                <p className="text-sm text-[#5a5752] font-light leading-relaxed max-w-md">
                  Curating public print exhibitions like LENS that bring street photography from screens to physical spaces — galleries, colleges, and heritage venues.
                </p>
              </div>
              <div className="pt-6 border-t border-[#e6e1d8] mt-6 flex items-center gap-6 text-[10px] uppercase tracking-widest text-[#8c8881]">
                <span>LENS Series</span>
                <span>•</span>
                <span>3,000+ Visitors</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: 4 compact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 3 */}
            <div className="group bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all duration-300 p-6 space-y-4 shadow-2xs hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f2eee8] group-hover:bg-[#1a1918] text-[#1a1918] group-hover:text-[#faf8f5] flex items-center justify-center transition-colors duration-300">
                  <Aperture className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c4bfb6]">03</span>
              </div>
              <h3 className="font-serif text-xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors leading-snug">
                Workshops & Sessions
              </h3>
              <p className="text-xs text-[#8c8881] font-light leading-relaxed">
                Hands-on editing sessions, photo reviews, composition workshops, and guest talks with established photographers.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all duration-300 p-6 space-y-4 shadow-2xs hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f2eee8] group-hover:bg-[#1a1918] text-[#1a1918] group-hover:text-[#faf8f5] flex items-center justify-center transition-colors duration-300">
                  <Handshake className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c4bfb6]">04</span>
              </div>
              <h3 className="font-serif text-xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors leading-snug">
                Meetups & Community
              </h3>
              <p className="text-xs text-[#8c8881] font-light leading-relaxed">
                An inclusive space for photographers to connect, collaborate, share ideas, and build meaningful creative friendships.
              </p>
            </div>

            {/* Card 5 */}
            <div className="group bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all duration-300 p-6 space-y-4 shadow-2xs hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f2eee8] group-hover:bg-[#1a1918] text-[#1a1918] group-hover:text-[#faf8f5] flex items-center justify-center transition-colors duration-300">
                  <BookImage className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c4bfb6]">05</span>
              </div>
              <h3 className="font-serif text-xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors leading-snug">
                Heritage Documentation
              </h3>
              <p className="text-xs text-[#8c8881] font-light leading-relaxed">
                Preserving traditional lifestyles, indigenous heritage, tribal art forms, and architectural monuments through visual archives.
              </p>
            </div>

            {/* Card 6 */}
            <div className="group bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all duration-300 p-6 space-y-4 shadow-2xs hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#f2eee8] group-hover:bg-[#1a1918] text-[#1a1918] group-hover:text-[#faf8f5] flex items-center justify-center transition-colors duration-300">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c4bfb6]">06</span>
              </div>
              <h3 className="font-serif text-xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors leading-snug">
                Contests & Challenges
              </h3>
              <p className="text-xs text-[#8c8881] font-light leading-relaxed">
                Curated photography competitions and themed challenges that spark creativity and spotlight emerging talent.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => onNavigate('/about')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#5a5752] hover:text-[#1a1918] border border-[#c4bfb6] hover:border-[#1a1918] px-6 py-3 transition-all duration-300"
            >
              <span>Learn More About Our Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 04. OUR PARTNERS — Logo Marquee */}
      <section className="py-16 sm:py-20 bg-[#f2eee8] border-b border-[#e6e1d8] overflow-hidden" id="organisations-worked-with">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track:hover { animation-play-state: paused; }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold block">
                04 / Institutional Support
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918]">
                OUR PARTNERS
              </h2>
            </div>
            <p className="text-sm text-[#5a5752] font-light max-w-sm">
              Government bodies, institutions, and creative organisations we've collaborated with.
            </p>
          </div>
        </div>

        {/* Single marquee strip with all partners */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#f2eee8] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#f2eee8] to-transparent z-10 pointer-events-none" />

          <div
            className="marquee-track flex w-max items-center"
            style={{ animation: 'marquee 30s linear infinite' }}
          >
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex shrink-0 items-center">
                {[
                  'Tripura Tourism',
                  'Tripura State AIDS Control Society',
                  'Tripura Rural Livelihood Mission',
                  'ICA TTADC',
                  'Techno College of Engineering Agartala',
                  'Yoof'
                ].map((org, i) => (
                  <div key={`${setIdx}-${i}`} className="flex shrink-0 items-center">
                    <span className="font-serif text-xl sm:text-2xl font-normal text-[#1a1918]/40 hover:text-[#1a1918]/80 transition-colors duration-300 whitespace-nowrap px-6 sm:px-10 cursor-default select-none">
                      {org}
                    </span>
                    <span className="text-[#c4bfb6] text-sm select-none">✦</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05. WHY PARTNER WITH US */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] border-b border-[#e6e1d8]" id="why-partner-section">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold block">
              05 / Partnership Value
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#1a1918]">
              Why Partner With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#e6e1d8] space-y-4 hover:border-[#1a1918] transition-colors shadow-2xs">
              <div className="w-10 h-10 bg-[#1a1918] text-[#faf8f5] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-serif text-2xl font-light text-[#1a1918]">Strong & Engaged Photography Community</h3>
            </div>

            <div className="bg-white p-8 border border-[#e6e1d8] space-y-4 hover:border-[#1a1918] transition-colors shadow-2xs">
              <div className="w-10 h-10 bg-[#1a1918] text-[#faf8f5] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-serif text-2xl font-light text-[#1a1918]">Proven Experience in Organizing Exhibitions & Events</h3>
            </div>

            <div className="bg-white p-8 border border-[#e6e1d8] space-y-4 hover:border-[#1a1918] transition-colors shadow-2xs">
              <div className="w-10 h-10 bg-[#1a1918] text-[#faf8f5] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-serif text-2xl font-light text-[#1a1918]">Government Support & Institutional Trust</h3>
            </div>

            <div className="bg-white p-8 border border-[#e6e1d8] space-y-4 hover:border-[#1a1918] transition-colors shadow-2xs">
              <div className="w-10 h-10 bg-[#1a1918] text-[#faf8f5] flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-serif text-2xl font-light text-[#1a1918]">Massive Local & Digital Reach</h3>
            </div>

            <div className="bg-white p-8 border border-[#e6e1d8] space-y-4 hover:border-[#1a1918] transition-colors shadow-2xs">
              <div className="w-10 h-10 bg-[#1a1918] text-[#faf8f5] flex items-center justify-center font-bold">
                5
              </div>
              <h3 className="font-serif text-2xl font-light text-[#1a1918]">High Quality Content & Event Coverage</h3>
            </div>

            <div className="bg-white p-8 border border-[#e6e1d8] space-y-4 hover:border-[#1a1918] transition-colors shadow-2xs">
              <div className="w-10 h-10 bg-[#1a1918] text-[#faf8f5] flex items-center justify-center font-bold">
                6
              </div>
              <h3 className="font-serif text-2xl font-light text-[#1a1918]">Passionate Team Committed to Impact</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 04. FEATURED STORIES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] border-b border-[#e6e1d8]" id="featured-stories">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
                04 / Editorial Essays
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918]">
                STORIES FROM THE STREETS
              </h2>
            </div>
            <button
              onClick={() => {
                onNavigate('/stories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs uppercase tracking-widest text-[#1a1918] hover:text-[#b85d38] transition-colors border-b border-[#1a1918] pb-0.5 inline-flex items-center gap-1 self-start md:self-auto"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alternating Story Layouts */}
          <div className="space-y-20">
            {stories.map((story, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={story.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Large Photograph (60-70% width) */}
                  <div
                    onClick={() => onNavigate(`/stories/${story.slug}`)}
                    className={`lg:col-span-7 group cursor-pointer overflow-hidden bg-[#1a1918] ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-[400px] sm:h-[500px] object-cover group-hover:scale-102 transition-transform duration-700"
                    />
                  </div>

                  {/* Editorial Details */}
                  <div
                    className={`lg:col-span-5 space-y-6 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="text-xs uppercase tracking-widest text-[#8c8881] flex items-center space-x-2">
                      <span>{story.location}</span>
                      <span>•</span>
                      <span>{story.year}</span>
                    </div>

                    <h3
                      onClick={() => onNavigate(`/stories/${story.slug}`)}
                      className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918] hover:text-[#b85d38] transition-colors cursor-pointer leading-tight"
                    >
                      {story.title}
                    </h3>

                    {story.subtitle && (
                      <p className="text-sm font-serif italic text-[#5a5752]">
                        {story.subtitle}
                      </p>
                    )}

                    <p className="text-sm text-[#5a5752] leading-relaxed font-light">
                      {story.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-[#e6e1d8]">
                      <span className="text-xs text-[#8c8881]">
                        Photographs by <strong className="text-[#1a1918] font-normal">{story.photographer}</strong>
                      </span>
                      <button
                        onClick={() => onNavigate(`/stories/${story.slug}`)}
                        className="text-xs uppercase tracking-widest text-[#1a1918] hover:text-[#b85d38] font-semibold transition-colors flex items-center gap-1"
                      >
                        <span>View Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05. GALLERY (THE ARCHIVE) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f2eee8] border-b border-[#e6e1d8]" id="archive-section">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
                05 / Photography Archive
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918]">
                THE ARCHIVE
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1a1918] text-[#faf8f5]'
                      : 'bg-[#faf8f5] text-[#5a5752] hover:text-[#1a1918] border border-[#e6e1d8]'
                  }`}
                  id={`gallery-filter-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Editorial Masonry Gallery */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredGalleryPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative cursor-pointer overflow-hidden bg-[#1a1918] break-inside-avoid shadow-xs hover:shadow-md transition-shadow"
                id={`photo-card-${photo.id}`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  loading="lazy"
                />

                {/* Subtle Editorial Hover Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-[#faf8f5]">
                  <p className="font-serif text-lg font-light leading-snug">{photo.title}</p>
                  <p className="text-xs text-[#a39c90] mt-1 font-mono">
                    {photo.photographer} • {photo.location} ({photo.year})
                  </p>
                  <p className="text-[10px] text-[#b85d38] uppercase tracking-widest mt-2">
                    Click to view full screen →
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06. PHOTOWALKS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] border-b border-[#e6e1d8]" id="photowalks-section">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
                06 / Community Outings
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918]">
                WALK WITH US
              </h2>
            </div>
            <p className="text-sm text-[#5a5752] max-w-md font-light">
              Regular photowalks are the foundation of Streets of Tripura. We walk together through local markets, riverbanks, tea gardens, and historic alleys.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {photowalks.map((walk) => (
              <div
                key={walk.id}
                onClick={() => onNavigate(`/photowalks/${walk.slug}`)}
                className="lg:col-span-6 bg-white border border-[#e6e1d8] hover:border-[#1a1918] transition-all p-6 cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#b85d38] font-mono font-semibold uppercase tracking-wider">
                      {walk.edition}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                      walk.status === 'upcoming' ? 'bg-[#1a1918] text-[#faf8f5]' : 'bg-[#e6e1d8] text-[#5a5752]'
                    }`}>
                      {walk.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors">
                    {walk.title}
                  </h3>

                  <p className="text-xs text-[#5a5752] leading-relaxed line-clamp-2">
                    {walk.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#8c8881] pt-2 border-t border-[#e6e1d8]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#1a1918]" />
                      <span>{walk.date} at {walk.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#1a1918]" />
                      <span>Meeting: {walk.meetingPoint}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-[#e6e1d8] flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-[#1a1918]">
                  <span>{walk.participantsCount > 0 ? `${walk.participantsCount} Photographers Joined` : 'Open Registration'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {walk.status === 'upcoming' ? 'Join Walk →' : 'View Walk Gallery →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. EXHIBITIONS & EVENTS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1a1918] text-[#faf8f5]" id="exhibitions-section">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#b85d38] font-semibold">
                07 / Showcases & Gatherings
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#faf8f5]">
                EVENTS & EXHIBITIONS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/events')}
              className="text-xs uppercase tracking-widest text-[#a39c90] hover:text-[#faf8f5] transition-colors border-b border-[#a39c90] pb-0.5 inline-flex items-center gap-1"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-16">
            {exhibitions.map((ex) => (
              <div
                key={ex.id}
                onClick={() => onNavigate(`/events/${ex.slug}`)}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#2b2a28] pb-12 cursor-pointer group"
              >
                <div className="lg:col-span-6 overflow-hidden bg-[#2b2a28]">
                  <img
                    src={ex.coverImage}
                    alt={ex.title}
                    className="w-full h-[350px] object-cover group-hover:scale-102 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>

                <div className="lg:col-span-6 space-y-6">
                  <div className="flex items-center space-x-3 text-xs text-[#b85d38]">
                    <span className="font-mono">{ex.dates}</span>
                    <span>•</span>
                    <span className="text-[#a39c90]">{ex.venue}</span>
                  </div>

                  <h3 className="font-serif text-4xl font-light text-[#faf8f5] group-hover:text-[#b85d38] transition-colors">
                    {ex.title}
                  </h3>

                  <p className="text-sm text-[#a39c90] font-light leading-relaxed italic">
                    "{ex.curatorStatement}"
                  </p>

                  <div className="text-xs text-[#8c8881] space-y-1">
                    <p>Exhibited Artists: {ex.participatingPhotographers.slice(0, 4).join(', ')} + more</p>
                    <p>Visitors: {ex.visitorCount || '3,000+'}</p>
                  </div>

                  <button className="text-xs uppercase tracking-widest text-[#faf8f5] border-b border-[#faf8f5]/40 pb-1 flex items-center gap-2">
                    <span>View Permanent Digital Archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08. MAGAZINE — Hidden for now as requested */}
      {/* 
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] border-b border-[#e6e1d8]" id="magazine-section">
        ...
      </section>
      */}

      {/* 09. COLLABORATIONS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f2eee8] border-b border-[#e6e1d8]" id="collaborations-section">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
              09 / Institutional Partnerships
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918]">
              FRIENDS & COLLABORATIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {collaborations.map((collab) => (
              <div
                key={collab.id}
                onClick={() => onNavigate(`/collaborations/${collab.slug}`)}
                className="bg-[#faf8f5] border border-[#e6e1d8] p-8 space-y-6 cursor-pointer group hover:border-[#1a1918] transition-colors"
              >
                <div className="flex items-center space-x-3 text-xs font-mono text-[#b85d38] uppercase tracking-wider">
                  <span>STREETS OF TRIPURA</span>
                  <span>×</span>
                  <span className="text-[#1a1918] font-sans font-semibold">{collab.partnerName}</span>
                </div>

                <h3 className="font-serif text-2xl font-light text-[#1a1918] group-hover:text-[#b85d38] transition-colors">
                  {collab.projectName}
                </h3>

                <p className="text-xs text-[#5a5752] leading-relaxed font-light">
                  {collab.summary}
                </p>

                <div className="pt-4 border-t border-[#e6e1d8] flex justify-between items-center text-xs font-semibold text-[#1a1918] uppercase tracking-wider">
                  <span>Outcome: {collab.outcome}</span>
                  <span>Read Story →</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 text-center border-t border-[#e6e1d8] space-y-3">
            <p className="font-serif text-xl text-[#1a1918]">Interested in working together on a visual project?</p>
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-block bg-[#1a1918] text-[#faf8f5] text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#2b2a28] transition-colors"
            >
              Collaborate With Us →
            </button>
          </div>
        </div>
      </section>

      {/* 11. TEAM */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f2eee8] border-b border-[#e6e1d8]" id="team-section">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
              11 / Leadership & Governance
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1918]">
              BEHIND THE COMMUNITY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((tm) => (
              <div key={tm.id} className="bg-[#faf8f5] p-6 border border-[#e6e1d8] space-y-4">
                <div className="flex items-center space-x-4">
                  <img src={tm.photoUrl} alt={tm.name} className="w-14 h-14 object-cover rounded-full" />
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#1a1918]">{tm.name}</h3>
                    <p className="text-xs text-[#b85d38] font-semibold">{tm.role}</p>
                  </div>
                </div>
                <p className="text-xs text-[#5a5752] leading-relaxed font-light">
                  {tm.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. TIMELINE — Hidden for now as requested */}
      {/* 
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] border-b border-[#e6e1d8]" id="timeline-section">
        ...
      </section>
      */}

      {/* 13. PRESS & RECOGNITION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f2eee8] border-b border-[#e6e1d8]" id="press-section">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
              13 / In the Media
            </p>
            <h2 className="font-serif text-3xl font-light text-[#1a1918]">
              PRESS & FEATURES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {press.map((item) => (
              <div key={item.id} className="bg-white p-6 border border-[#e6e1d8] space-y-3">
                <div className="flex justify-between items-center text-xs text-[#8c8881]">
                  <span className="font-semibold text-[#1a1918]">{item.publication}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-serif text-lg font-normal text-[#1a1918] leading-snug">
                  "{item.headline}"
                </h3>
                <p className="text-xs text-[#5a5752] font-light">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. JOIN THE COMMUNITY CTA */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#121110] text-[#faf8f5] overflow-hidden" id="join-cta-section">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=85&w=2000"
            alt="Community photowalk"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <p className="text-xs uppercase tracking-widest text-[#b85d38] font-semibold">
            14 / Community Invitation
          </p>
          <h2 className="font-serif text-4xl sm:text-6xl font-light leading-tight">
            DON'T JUST FOLLOW THE STREETS.<br />
            WALK WITH US.
          </h2>
          <p className="text-sm sm:text-base text-[#a39c90] max-w-xl mx-auto font-light leading-relaxed">
            Whether you're picking up a camera for the first time or have been photographing for years, there's a place for you here in Tripura's visual collective.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/join')}
              className="bg-[#faf8f5] text-[#1a1918] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#e6e1d8] transition-colors"
              id="cta-join-btn"
            >
              Join the Community
            </button>
            <button
              onClick={() => onNavigate('/photowalks')}
              className="border border-[#faf8f5]/40 text-[#faf8f5] px-8 py-3.5 text-xs uppercase tracking-widest hover:border-[#faf8f5] transition-colors"
            >
              Attend a Photowalk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
