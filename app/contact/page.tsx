
'use client';

import { useState } from 'react';
import { Instagram, MessageCircle, BookmarkCheck, Share2, Sparkles, ArrowUpRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Meet your match',
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

  const socialHighlights = [
    {
      id: 'nervous-system',
      label: 'Latest carousel',
      title: 'Nervous system rituals to start your day',
      description: 'Breathwork stacks, magnesium layering and grounding prompts from Dr Mel to stabilise cortisol before your day begins.',
      url: 'https://www.instagram.com/dotbetterbeing/',
      accent: 'from-[var(--bb-mahogany)]/15 via-[var(--bb-champagne)]/80 to-white/90',
      icon: Sparkles,
    },
    {
      id: 'ingredient-lab',
      label: 'Ingredient lab',
      title: 'Saveable deep-dives on MSM, magnesium and adaptogens',
      description: 'Swipe-friendly explainers that demystify each hero ingredient so you feel confident about every product in your stack.',
      url: 'https://www.instagram.com/dotbetterbeing/',
      accent: 'from-white/85 via-[var(--bb-citron)]/25 to-white/90',
      icon: BookmarkCheck,
    },
    {
      id: 'studio-live',
      label: 'Studio live',
      title: 'Behind-the-scenes walkthroughs and weekly Q&A replays',
      description: 'Step inside the Better Being studio, preview upcoming modalities and catch up on Friday community Q&As.',
      url: 'https://www.instagram.com/dotbetterbeing/',
      accent: 'from-[var(--bb-black-bean)]/25 via-[var(--bb-mahogany)]/25 to-[var(--bb-black-bean)]/15',
      icon: Instagram,
    },
  ];

  const connectionPrompts = [
    {
      id: 'dm',
      title: 'DM the care team',
      description: 'Send your protocol questions via Instagram DM and we will route them to the right practitioner within one business day.',
      icon: MessageCircle,
    },
    {
      id: 'share',
      title: 'Share your ritual',
      description: 'Tag @dotbetterbeing when you layer your supplements or visit the studio so we can feature community routines each week.',
      icon: Share2,
    },
    {
      id: 'bookmark',
      title: 'Build your resource library',
      description: 'Tap the bookmark icon on posts to save nervous system resets, gut repair recipes and product layering guides for quick reference.',
      icon: BookmarkCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Image background with overlay + headline */}
      <section className="relative min-h-[60vh] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Platform Graphics/Contact Us banner.png"
            alt="Contact hero"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        {/* Hero Text (matching other pages) */}
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="min-h-[60vh] pt-24 flex flex-col items-center justify-center text-center">
            <h1 className="text-hero text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6">REAL PEOPLE, REAL REPLIES</h1>
          </div>
        </div>
        {/* Spacer to account for absolute header */}
        <div className="h-24"></div>
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
                    Meet your match
                  </h3>
                  <p className="mt-3 text-[var(--bb-champagne)] leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Get personalized recommendations based on your wellness goals and lifestyle.
                  </p>
                </div>
                <div className="p-6 bg-[var(--bb-black-bean)] text-white">
                  <h3 className="text-xl font-semibold uppercase tracking-wide" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                    Ingredient Questions
                  </h3>
                  <p className="mt-3 text-[var(--bb-champagne)] leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Deep dive into any specific ingredient and its role in any of our products
                  </p>
                </div>
                <div className="p-6 bg-[var(--bb-black-bean)] text-white">
                  <h3 className="text-xl font-semibold uppercase tracking-wide" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                    Become a Stockist
                  </h3>
                  <p className="mt-3 text-[var(--bb-champagne)] leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Let’s get you on board!
                  </p>
                  <div className="pt-4">
                    <a href="/portal-access" className="inline-block bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-6 py-3 font-medium uppercase tracking-wider transition-colors">
                      Outlet Application
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
                  <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">How can we help?</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none"
                  >
                    <option value="Meet your match">Meet your match</option>
                    <option value="Ingredient questions">Ingredient questions</option>
                    <option value="Become a Stockist">Become a Stockist</option>
                  </select>
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

      {/* Social Media Section - Redesigned */}
      <section className="py-24 bg-[#F9E7C9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 rounded-full mb-6">
              <Instagram className="w-4 h-4 text-[var(--bb-mahogany)]" />
              <span className="text-[var(--bb-mahogany)] text-sm font-bold uppercase tracking-[0.2em]">@dotbetterbeing</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-light text-[var(--bb-black-bean)] leading-tight mb-6" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Follow Our <span className="italic text-[var(--bb-mahogany)]">Journey</span>
            </h2>
            <div className="w-24 h-px bg-[var(--bb-mahogany)] mx-auto mb-8"></div>
            <p className="text-xl text-[var(--bb-payne-gray)] max-w-3xl mx-auto font-light leading-relaxed">
              Join our community for daily wellness rituals, behind-the-scenes moments, and expert insights you can save and revisit.
            </p>
          </div>

          {/* Featured Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {socialHighlights.map(highlight => {
              const Icon = highlight.icon;
              return (
                <a
                  key={highlight.id}
                  href={highlight.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Gradient Accent Bar */}
                  <div className="h-2 bg-gradient-to-r from-[var(--bb-mahogany)] via-[var(--bb-citron)] to-[var(--bb-mahogany)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--bb-mahogany)]/10 to-[var(--bb-citron)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-[var(--bb-mahogany)]" />
                    </div>
                    
                    {/* Label */}
                    <span className="text-xs uppercase tracking-[0.3em] text-[var(--bb-mahogany)] font-bold mb-3 block">
                      {highlight.label}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-light text-[var(--bb-black-bean)] leading-tight mb-4" 
                        style={{ fontFamily: 'Playfair Display, serif' }}>
                      {highlight.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-[var(--bb-payne-gray)] leading-relaxed mb-6">
                      {highlight.description}
                    </p>
                    
                    {/* Arrow */}
                    <div className="flex items-center gap-2 text-[var(--bb-mahogany)] font-semibold group-hover:gap-4 transition-all duration-300">
                      <span className="text-sm uppercase tracking-wider">View on Instagram</span>
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-[var(--bb-black-bean)] to-[var(--bb-mahogany)] rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--bb-citron)] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--bb-champagne)] rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-light text-white leading-tight mb-4" 
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                Ready to join the community?
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Get daily inspiration, practical wellness tips, and be part of a supportive community committed to better being.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://www.instagram.com/dotbetterbeing/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 bg-[var(--bb-citron)] text-[var(--bb-black-bean)] px-8 py-4 text-base font-bold uppercase tracking-wider hover:bg-[var(--bb-citron)]/90 transition-all rounded-lg hover:scale-105 transform duration-300"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  <Instagram className="w-5 h-5" />
                  Follow @dotbetterbeing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
