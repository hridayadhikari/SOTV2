import React, { useState } from 'react';
import { Mail, MapPin, Send, Check } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in" id="contact-page">
      <div className="border-b border-[#e6e1d8] pb-8 space-y-4">
        <span className="text-[10px] uppercase tracking-widest text-[#8c8881] font-semibold">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1a1918]">
          Contact us!
        </h1>
        <p className="text-sm text-[#5a5752] max-w-2xl font-light">
          For exhibition inquiries, collaborative projects, print archiving, or general questions, reach out to our team in Agartala.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5 space-y-8 text-xs text-[#5a5752]">
          <div className="space-y-2">
            <h3 className="font-serif text-xl text-[#1a1918]">Email Communications</h3>
            <div className="flex items-center space-x-2 text-[#1a1918] font-mono">
              <Mail className="w-4 h-4 text-[#b85d38]" />
              <a href="mailto:contact@streetsoftripura.in" className="hover:underline">
                contact@streetsoftripura.in
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl text-[#1a1918]">Collective Headquarters</h3>
            <div className="flex items-start space-x-2 text-[#1a1918]">
              <MapPin className="w-4 h-4 text-[#b85d38] mt-0.5" />
              <div>
                <p className="font-medium">Streets of Tripura</p>
                <p className="text-[#8c8881]">A venture of Chitranidhi</p>
                <p className="text-[#8c8881]">Agartala, West Tripura, PIN 799001</p>
                <p className="text-[#8c8881]">Tripura, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white border border-[#e6e1d8] p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full p-3 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full p-3 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8c8881] uppercase tracking-wider mb-1">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-white border border-[#e6e1d8] focus:border-[#1a1918] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a1918] text-[#faf8f5] py-3.5 uppercase tracking-widest font-semibold hover:bg-[#2b2a28] transition-colors flex items-center justify-center gap-2"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>

            {submitted && (
              <p className="text-xs text-[#2c6e49] flex items-center justify-center gap-1 pt-2 font-medium">
                <Check className="w-4 h-4" /> Thank you. Your message has been sent to our team!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
