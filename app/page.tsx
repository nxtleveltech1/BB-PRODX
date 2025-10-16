"use client";
import { useState, useEffect } from 'react';
import TopSixFlip from '@/components/TopSixFlip';
import SocialMediaWall from '@/components/SocialMediaWall';
import StoreLocator from '@/components/locator/StoreLocator';

export default function HomePage() {
const [scrollY, setScrollY] = useState(0);
  

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Canonical Reference */}
      <section className="relative min-h-[var(--hero-min-h-desktop)] md:min-h-[var(--hero-min-h-tablet)] sm:min-h-[var(--hero-min-h-mobile)] flex items-center justify-center overflow-hidden bg-[var(--bb-mahogany)]">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/20250902.png"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
        </div>
          
          {/* Overlay (solid) covering full hero */}
          <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
          
          {/* Premium Film Grain */}
          <div className="absolute inset-0 grain-texture opacity-20 z-10 pointer-events-none"></div>
        
        {/* Hero Content - Centered with proper spacing */}
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="min-h-[var(--hero-min-h-desktop)] md:min-h-[var(--hero-min-h-tablet)] sm:min-h-[var(--hero-min-h-mobile)] flex flex-col items-center justify-center text-center py-24">
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
              BETTER BEGINS HERE
            </h1>
            <p className="text-subhero text-white/90 mb-10">Products that work, principles that hold</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/products" className="btn btn-primary" style={{ backgroundColor: '#BB4500', borderColor: '#BB4500' }}>
                Shop Collection
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sophisticated Story Section - Modern Layout */}
      <section className="space-section bg-[#F9E7C9] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-[#F9E7C9]/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-r from-[#8B4513]/10 to-transparent rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <div className="space-y-8 fade-in-up">
              <div className="inline-flex items-center gap-3 px-6 py-3 glass-luxury rounded-full">
                <div className="w-2 h-2 bg-[#B5A642] rounded-full luxury-glow"></div>
                <span className="text-[#BB4500] text-sm font-bold uppercase tracking-[0.2em]">Experience Wellness</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-light leading-tight text-[#2C2B29]" 
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Journey to <span className="text-luxury">Better Being</span>
              </h2>
              
              <div className="w-24 h-px bg-gradient-to-r from-[#8B4513] to-[#B5A642]"></div>
            </div>
            
            {/* Right Content - Button Area */}
            <div className="flex items-center justify-center lg:justify-end fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg border border-[#BB4500]/10 hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#BB4500]/10 to-[#B5A642]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-[#BB4500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light text-[#2C2B29]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Discover Our Collection
                  </h3>
                  <p className="text-[#7A7771] leading-relaxed max-w-xs mx-auto">
                    Explore premium wellness products designed to support your journey to better being.
                  </p>
                  <a 
                    href="/products" 
                    className="inline-flex items-center gap-3 bg-[#BB4500] hover:bg-[#2C2B29] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg group-hover:gap-4"
                    style={{ fontFamily: 'League Spartan, sans-serif' }}
                  >
                    <span>Explore Collection</span>
                    <svg className="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rotating Product Section - no borders between sections */}
      <TopSixFlip showBorders={false} />

      {/* Store Locator */}
      <StoreLocator compact />


      {/* Stockist Section - Solid Green */}
      <section className="space-luxury relative overflow-hidden bg-[#B5A642]">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-12 fade-in-up">
            <h2 className="text-5xl lg:text-6xl font-light text-[#2C2B29] leading-tight" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Become a Better Being <span className="not-italic text-[#BB4500]">Stockist</span>
            </h2>
            <div className="w-24 h-px bg-[#2C2B29] mx-auto"></div>
            <p className="text-xl leading-relaxed text-[#2C2B29]/90 max-w-3xl mx-auto font-light">
              Stock a wellness range your shoppers trust. Clear margins, simple MOQs, fast reorders, and launch/training support — so that products fly off of your shelves and your team feels confident.
            </p>
            <div className="pt-8">
              <a href="/portal-access" className="btn btn-primary" style={{ backgroundColor: '#BB4500', borderColor: '#BB4500' }}>
                Outlet Application
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Newsletter Signup Section */}
      <section className="space-section bg-[#F9E7C9] relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8 fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-luxury rounded-full">
              <div className="w-2 h-2 bg-[#8B4513] rounded-full luxury-glow"></div>
              <span className="text-[#8B4513] text-sm font-bold uppercase tracking-[0.2em]">Join Our Community</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-light text-[#8B4513] leading-tight" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Stay Connected to Your <span className="text-luxury">Wellness Journey</span>
            </h2>
            
            <p className="text-lg text-[#7A7771] max-w-2xl mx-auto leading-relaxed">
              Get exclusive access to wellness tips, new product launches, and special offers. 
              Join thousands who trust us for their daily wellness rituals.
            </p>
            
            {/* Premium Newsletter Form */}
            <div className="mt-12">
              <div className="max-w-md mx-auto">
                <div className="flex gap-3 bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-[#8B4513]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent border-none outline-none text-[#2C2B29] placeholder-[#7A7771] px-3 py-2"
                  />
                  <button className="btn btn-primary px-6 py-2 text-sm" style={{ backgroundColor: '#BB4500', borderColor: '#BB4500' }}>
                    Subscribe
                  </button>
                </div>
                <p className="mt-3 text-xs text-[#7A7771]">No spam—unsubscribe any time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Wall */}
      <SocialMediaWall handle="the.betterbeing" />

    </div>
  );
}
