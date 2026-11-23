import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Organization & Platform',
    question: 'What is Streets of Tripura?',
    answer: 'Streets of Tripura is a youth-led creative platform dedicated to documenting life, culture, heritage, and human stories across Tripura through visual arts, street photowalks, print exhibitions, and community workshops.'
  },
  {
    id: 'faq-2',
    category: 'Organization & Platform',
    question: 'Is Streets of Tripura affiliated with official institutions?',
    answer: 'Yes, Streets of Tripura works in close collaboration with official bodies such as Tripura Tourism, Tripura Rural Livelihood Mission, and Tripura State AIDS Control Society, along with leading educational institutions like Techno College of Engineering Agartala.'
  },
  {
    id: 'faq-3',
    category: 'Volunteering & Participation',
    question: 'How can I join upcoming photowalks and meetups?',
    answer: 'Our photowalks and community sessions are open to everyone without filling out any forms. Simply join our official WhatsApp group via the "Walk With Us" page to receive instant notifications.'
  },
  {
    id: 'faq-4',
    category: 'Volunteering & Participation',
    question: 'How can I volunteer or contribute to team operations?',
    answer: 'We welcome enthusiastic volunteers for event logistics, social media content, graphic design, print curation, and public relations. You can apply via our Contact form or reach out to our team leads directly during meetups.'
  },
  {
    id: 'faq-5',
    category: 'Volunteering & Participation',
    question: 'Do I need professional camera gear or prior experience?',
    answer: 'Not at all! We welcome photographers of all skill levels. Mobile phone photography is equally celebrated alongside DSLR and mirrorless setups—what matters most is your eye for storytelling and passion for culture.'
  },
  {
    id: 'faq-6',
    category: 'Photography Guidelines & Ethics',
    question: 'What ethics and photography guidelines should I follow on photowalks?',
    answer: 'We advocate for respectful, empathetic, and culturally conscious photography. Always respect individual privacy, seek polite permission when capturing intimate close-up portraits, refrain from intrusive practices, and uphold community dignity.'
  },
  {
    id: 'faq-7',
    category: 'Photography Guidelines & Ethics',
    question: 'How can I submit my work for exhibitions like LENS or digital showcases?',
    answer: 'Prior to every major exhibition, we issue open calls for photo submissions. Submissions are curated by our editorial team. Stay updated via our announcements section to submit high-resolution photographs under active themes.'
  }
];

export const AboutView: React.FC = () => {
  const { teamMembers } = useData();
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const coreTeam = teamMembers.filter(t => t.type === 'core');
  const advisoryBoard = teamMembers.filter(t => t.type === 'advisory');

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-20 animate-fade-in" id="about-page">
      {/* Header */}
      <section className="space-y-6 border-b border-[#e6e1d8] pb-12">
        <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
          About Streets of Tripura
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1a1918] leading-tight">
          Capturing Stories, Preserving Moments, Celebrating Culture.
        </h1>
        <div className="space-y-4 text-base text-[#5a5752] font-light leading-relaxed pt-2">
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
          <p className="font-serif italic text-lg text-[#1a1918]">
            📷 Join us in capturing the unseen.
          </p>
        </div>
      </section>

      {/* Core Team */}
      <section className="space-y-10 pt-10 border-t border-[#e6e1d8]" id="team">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
            Leadership & Curation
          </span>
          <h2 className="font-serif text-3xl font-light text-[#1a1918]">
            CORE TEAM
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {coreTeam.map(member => (
            <div key={member.id} className="bg-white border border-[#e6e1d8] p-6 space-y-4 shadow-xs">
              <img src={member.photoUrl} alt={member.name} className="w-20 h-20 object-cover rounded-full" />
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-medium text-[#1a1918]">{member.name}</h3>
                <p className="text-xs text-[#b85d38] font-semibold">{member.role}</p>
                <p className="text-[11px] text-[#8c8881]">{member.photographySpecialization}</p>
              </div>
              <p className="text-xs text-[#5a5752] font-light leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Advisory Board & Institutional Partner */}
      <section className="space-y-10 pt-10 border-t border-[#e6e1d8]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
            Institutional Support & Mentorship
          </span>
          <h2 className="font-serif text-3xl font-light text-[#1a1918]">
            ADVISORY & COOPERATIVE GOVERNANCE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {advisoryBoard.map(member => (
            <div key={member.id} className="bg-[#f2eee8] border border-[#e6e1d8] p-6 space-y-3">
              <h3 className="font-serif text-xl font-normal text-[#1a1918]">{member.name}</h3>
              <p className="text-xs text-[#b85d38] font-semibold">{member.role}</p>
              <p className="text-xs text-[#5a5752] font-light leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8 pt-10 border-t border-[#e6e1d8]" id="faq">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#8c8881]">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light text-[#1a1918]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-sm text-[#5a5752] font-light max-w-2xl">
            Find details on platform initiatives, volunteering opportunities, photowalk participation, and community guidelines.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map(item => {
            const isOpen = openFaqId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-[#e6e1d8] transition-colors"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#8c8881] font-semibold block">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1a1918] group-hover:text-[#b85d38] transition-colors">
                      {item.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8c8881] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1a1918]' : ''
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#5a5752] font-light leading-relaxed border-t border-[#f2eee8]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

