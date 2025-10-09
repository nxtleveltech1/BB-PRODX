
'use client';

import { useState } from 'react';
import SocialMediaWall from '@/components/SocialMediaWall';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Canonical Format */}
      <section className="relative min-h-[var(--hero-min-h-tablet)] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Platform Graphics/Contact Us Banner.png"
            alt="Contact hero"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        {/* Hero Text (matching other pages) */}
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="min-h-[var(--hero-min-h-tablet)] flex flex-col items-center justify-center text-center py-24">
            <h1 
              className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6"
              style={{ 
                fontFamily: 'League Spartan, sans-serif',
                fontWeight: 900,
                fontSize: 'var(--hero-font-size)',
                lineHeight: 'var(--hero-lineheight)',
                letterSpacing: 'var(--hero-letterspacing)'
              }}
            >
              REAL PEOPLE, REAL REPLIES
            </h1>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Champagne Background */}
      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-start">
            {/* Contact Information */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-4xl font-light text-[var(--bb-black-bean)] leading-tight" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                  Let's Start a <em className="text-[var(--bb-mahogany)]">Conversation</em>
                </h2>
                <p className="text-lg text-[var(--bb-black-bean)] opacity-80 leading-relaxed font-light">
                  Whether you're new to wellness or a seasoned practitioner, we believe in meeting you exactly where you are in your journey.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-[var(--bb-black-bean)] text-white">
                  <h3 className="text-xl font-semibold uppercase tracking-wide" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                    Become a Stockist
                  </h3>
                  <p className="mt-3 text-[var(--bb-champagne)] leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Let's get you on board!
                  </p>
                  <div className="pt-4">
                    <a href="/portal-access" className="inline-block bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-6 py-3 font-medium uppercase tracking-wider transition-colors">
                      Stock Better Being
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#F9E7C9] p-6 md:px-12 md:py-8 border border-[var(--bb-mahogany)]/10 self-start">
              <div className="space-y-6 mb-8">
                <h3 className="text-2xl font-light text-[var(--bb-black-bean)]" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                  Send us a message
                </h3>
                <div className="w-16 h-px bg-[var(--bb-mahogany)]"></div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none"
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none resize-none"
                    placeholder="Tell us about your wellness journey and how we can support you..."
                  />
                </div>
                
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-[var(--bb-mahogany)] hover:bg-[var(--bb-black-bean)] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 hover:transform hover:scale-105"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Social Media Wall */}
      <SocialMediaWall handle="betterbeing" />
    </div>
  );
}
