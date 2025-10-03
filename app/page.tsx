"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import StoreLocator from 'components/locator/StoreLocator';
import TopSixFlip from '@/components/TopSixFlip';

export default function HomePage() {
const [scrollY, setScrollY] = useState(0);
  

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Reduced Size */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-[var(--bb-mahogany)]">
        {/* Hero Background Image - FIXED */}
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
        
        {/* Hero Content */}
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="h-[75vh] pt-24 flex flex-col items-center justify-center text-center">
            <h1 className="text-hero text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6">BETTER BEGINS HERE</h1>
            <p className="text-subhero text-white/90 mb-10">Products that work, principles that hold</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/products" className="btn btn-primary" style={{ backgroundColor: '#BB4500', borderColor: '#BB4500' }}>
                Shop Collection
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 fade-in-up" style={{ animationDelay: '1.8s' }}>
          <div className="flex flex-col items-center text-white/70">
            <span className="text-xs uppercase tracking-wider mb-3 font-medium">Scroll to Explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
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
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Content - Asymmetric 6 columns */}
            <div className="lg:col-span-6 space-y-8">
              <div className="fade-in-up">
                <div className="inline-flex items-center gap-3 px-6 py-3 glass-luxury rounded-full mb-8">
                  <div className="w-2 h-2 bg-[#B5A642] rounded-full luxury-glow"></div>
<span className="text-[#BB4500] text-sm font-bold uppercase tracking-[0.2em]">Experience Wellness</span>
                </div>
                
                <h2 className="text-5xl lg:text-6xl font-light leading-tight text-[#2C2B29] mb-8" 
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your Journey to <span className="text-luxury">Better Being</span>
                </h2>
                
                <div className="w-24 h-px bg-gradient-to-r from-[#8B4513] to-[#B5A642] mb-8"></div>
                
                
                <div className="flex flex-col sm:flex-row gap-6">
<a href="/products" className="btn-premium hover-glow focus-premium group" style={{ backgroundColor: '#BB4500', borderColor: '#BB4500' }}>
                    <span>Explore Collection</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Store Locator block (embedded in the original section container) */}
      <section className="bg-[#F9E7C9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <StoreLocator compact />
        </div>
      </section>


      {/* Stockist Section - Solid Green */}
      <section className="space-luxury relative overflow-hidden bg-[#A7B958]">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-12 fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 border border-[#2C2B29]/20 rounded-full">
              <div className="w-2 h-2 bg-[#2C2B29] rounded-full"></div>
              <span className="text-[#2C2B29] text-sm font-bold uppercase tracking-[0.2em]">Philosophy</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-light text-[#2C2B29] leading-tight" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Become a Better Being <span className="not-italic text-[#BB4500]">Stockist</span>
            </h2>
            <div className="w-24 h-px bg-[#2C2B29] mx-auto"></div>
            <p className="text-xl leading-relaxed text-[#2C2B29]/90 max-w-3xl mx-auto font-light">
              Stock a wellness range your shoppers trust. Clear margins, simple MOQs, fast reorders, and launch/training support—so your shelves move and your team feels confident.
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
                
                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#7A7771]">
                  <div className="trust-signal px-3 py-1 bg-white/20 rounded-full">
                    <span className="text-green-600 text-xs">✓</span>
                    <span className="ml-1">No spam</span>
                  </div>
                  <div className="trust-signal px-3 py-1 bg-white/20 rounded-full">
                    <span className="text-green-600 text-xs">✓</span>
                    <span className="ml-1">Unsubscribe anytime</span>
                  </div>
                  <div className="trust-signal px-3 py-1 bg-white/20 rounded-full">
                    <span className="text-green-600 text-xs">✓</span>
                    <span className="ml-1">Weekly tips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
