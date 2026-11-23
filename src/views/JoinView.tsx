import React from 'react';
import { ArrowUpRight, MessageCircle, Users, Camera, Calendar, Award } from 'lucide-react';

export const JoinView: React.FC = () => {
  const whatsappGroupUrl = 'https://chat.whatsapp.com/D9vpuyTFSKE6gR3a3KOooX';

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 animate-fade-in" id="join-page">
      <div className="border-b border-[#e6e1d8] pb-8 space-y-4 text-center">
        <span className="text-[10px] uppercase tracking-widest text-[#b85d38] font-semibold">
          Be Part of Streets of Tripura
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1a1918] leading-tight">
          WALK WITH US.
        </h1>
        <p className="text-base text-[#5a5752] max-w-2xl mx-auto font-light leading-relaxed">
          No forms required! Simply join our official WhatsApp group to instantly connect with photographers, receive photowalk announcements, and participate in creative discussions across Tripura.
        </p>
      </div>

      {/* Main WhatsApp CTA Card */}
      <div className="bg-white border border-[#e6e1d8] p-8 sm:p-12 text-center space-y-8 shadow-xs max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto border border-[#25D366]/30">
          <MessageCircle className="w-8 h-8 fill-current" />
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1a1918]">
            Official Community WhatsApp Group
          </h2>
          <p className="text-sm text-[#5a5752] font-light max-w-md mx-auto leading-relaxed">
            Click below to join our active WhatsApp group. Get instant access to photowalk schedules, exhibition notices, photo reviews, and collaborative opportunities.
          </p>
        </div>

        <div>
          <a
            href={whatsappGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#1a1918] hover:bg-[#25D366] text-[#faf8f5] px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 shadow-sm group rounded-none"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Join WhatsApp Community</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <p className="text-xs text-[#8c8881] font-mono">
          Direct Link: <a href={whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1a1918]">{whatsappGroupUrl}</a>
        </p>
      </div>

      {/* Community Benefits Grid */}
      <div className="space-y-6 pt-4">
        <h3 className="font-serif text-2xl font-light text-[#1a1918] text-center">
          What Happens in the Group?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#faf8f5] p-6 border border-[#e6e1d8] space-y-2">
            <div className="flex items-center gap-3 text-[#1a1918]">
              <Calendar className="w-5 h-5 text-[#b85d38]" />
              <h4 className="font-serif text-lg font-medium">Photowalk Announcements</h4>
            </div>
            <p className="text-xs text-[#5a5752] font-light leading-relaxed">
              Get notified first about weekly and monthly photowalks in Agartala, markets, heritage sites, and districts across Tripura.
            </p>
          </div>

          <div className="bg-[#faf8f5] p-6 border border-[#e6e1d8] space-y-2">
            <div className="flex items-center gap-3 text-[#1a1918]">
              <Award className="w-5 h-5 text-[#b85d38]" />
              <h4 className="font-serif text-lg font-medium">Exhibition Open Calls</h4>
            </div>
            <p className="text-xs text-[#5a5752] font-light leading-relaxed">
              Receive submission guidelines for upcoming editions of LENS Exhibition and public print showcases.
            </p>
          </div>

          <div className="bg-[#faf8f5] p-6 border border-[#e6e1d8] space-y-2">
            <div className="flex items-center gap-3 text-[#1a1918]">
              <Camera className="w-5 h-5 text-[#b85d38]" />
              <h4 className="font-serif text-lg font-medium">Photo Reviews & Feedback</h4>
            </div>
            <p className="text-xs text-[#5a5752] font-light leading-relaxed">
              Share your frames, receive constructive feedback from veteran storytellers, and discuss gear and visual composition.
            </p>
          </div>

          <div className="bg-[#faf8f5] p-6 border border-[#e6e1d8] space-y-2">
            <div className="flex items-center gap-3 text-[#1a1918]">
              <Users className="w-5 h-5 text-[#b85d38]" />
              <h4 className="font-serif text-lg font-medium">Networking & Collaborations</h4>
            </div>
            <p className="text-xs text-[#5a5752] font-light leading-relaxed">
              Connect with fellow photographers, artists, filmmakers, and cultural organizers in a welcoming environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

