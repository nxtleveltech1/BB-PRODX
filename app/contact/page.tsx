
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

      {/* Social Media Section */}
      <section className="py-16 bg-gradient-to-br from-[var(--bb-black-bean)] to-[var(--bb-mahogany)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 right-0 w-72 h-72 bg-[var(--bb-citron)] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-0 w-[28rem] h-[28rem] bg-[var(--bb-champagne)] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 items-start">
            <div className="space-y-8 text-left text-white">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60" style={{ fontFamily: 'League Spartan, sans-serif' }}>@dotbetterbeing</p>
                <h3 className="text-4xl font-light leading-tight" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                  Stay connected with the Better Being community
                </h3>
                <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Follow <span className="text-[var(--bb-citron)] font-semibold">@dotbetterbeing</span> for daily nervous system practices, behind-the-scenes studio moments and education you can save for your personal protocol library.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {connectionPrompts.map(prompt => {
                  const Icon = prompt.icon;
                  return (
                    <div key={prompt.id} className="p-4 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[var(--bb-citron)]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold tracking-wide uppercase text-white" style={{ fontFamily: 'League Spartan, sans-serif' }}>{prompt.title}</p>
                        <p className="text-sm text-white/70 leading-relaxed">{prompt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="https://www.instagram.com/dotbetterbeing/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[var(--bb-citron)] text-[var(--bb-black-bean)] px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-[var(--bb-citron)]/90 transition-all"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  <Instagram className="w-4 h-4" />
                  Follow @dotbetterbeing
                </a>
                <a
                  href="mailto:hello@betterbeing.co.za?subject=Social%20media%20collaboration"
                  className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-all"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  <Share2 className="w-4 h-4" />
                  Submit a feature idea
                </a>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {socialHighlights.map(highlight => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.id}
                    className={`relative rounded-3xl border border-white/10 bg-gradient-to-br ${highlight.accent} p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col gap-4 h-full`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.4em] text-white/70" style={{ fontFamily: 'League Spartan, sans-serif' }}>{highlight.label}</span>
                    </div>
                    <h4 className="text-xl font-light text-white leading-snug" style={{ fontFamily: 'Prata, Georgia, serif' }}>{highlight.title}</h4>
                    <p className="text-sm text-white/80 leading-relaxed">{highlight.description}</p>
                    <div className="pt-2 mt-auto">
                      <a
                        href={highlight.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors"
                        style={{ fontFamily: 'League Spartan, sans-serif' }}
                      >
                        Open on Instagram
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
