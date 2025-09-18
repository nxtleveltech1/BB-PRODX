"use client";
import { useState, useEffect, useRef } from 'react';

export default function HomePage() {
const [scrollY, setScrollY] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Reduced Size */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-[#4c0c00]">
        {/* Hero Background Image - FIXED */}
        <div className="absolute inset-0 z-0">
          <img
            src="/20250902.png"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
        </div>
          
          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2B29]/40 via-transparent to-transparent z-10 pointer-events-none"></div>
          
          {/* Premium Film Grain */}
          <div className="absolute inset-0 grain-texture opacity-20 z-10 pointer-events-none"></div>
        </div>
        
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
            
            {/* Visual Story Grid - FIXED Layout */}
            <div className="lg:col-span-6 relative">
              <div className="space-y-6">
                {/* Main Story Visual - Full Width */}
                <div className="card-premium overflow-hidden hover-glow parallax-hover fade-in-up rounded-2xl" 
                     style={{ animationDelay: '0.3s' }}>
                  <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-[#F9E7C9] to-[#f5e1b8]">
                    <video 
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      poster="/20250902.png"
                    >
                      <source src="/Home Pg Vid 1.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="glass-luxury p-4 rounded-xl">
                        <h3 className="text-white text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Natural Ingredients
                        </h3>
                        <p className="text-white/90 text-sm font-light">Sourced from nature, powered by science</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Two Column Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="card-premium overflow-hidden hover-glow fade-in-up rounded-xl" 
                       style={{ animationDelay: '0.6s' }}>
<div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#F9E7C9] to-[#f5e1b8]">
                      <img 
                        src="/Promotins/pm2.png" 
                        alt="Top Sellers"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white text-sm font-medium mb-1">Top Sellers</h4>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-premium overflow-hidden hover-glow fade-in-up rounded-xl" 
                       style={{ animationDelay: '0.9s' }}>
<div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#F9E7C9] to-[#f5e1b8]">
                      <img 
                        src="/Promotins/pm3.png" 
                        alt="On Sale"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white text-sm font-medium mb-1">On Sale</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find your closest outlet block */}
      <section className="space-luxury bg-[#F9E7C9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl lg:text-6xl font-light text-[#2C2B29] leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Find your closest outlet
          </h2>
          <p className="text-lg text-[#7A7771] max-w-2xl mx-auto mb-10">Search our growing list of trusted stockists near you.</p>
          <a href="/locator" className="btn btn-primary inline-flex" style={{ backgroundColor: '#BB4500', borderColor: '#BB4500' }}>
            Locator
          </a>
        </div>
      </section>


      {/* Philosophy Section - Rich Background */}
      <section className="space-luxury bg-[#F9E7C9] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B4513] rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#2C2B29] rounded-full blur-2xl transform translate-x-32 translate-y-32"></div>
        </div>
        
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

      {/* Premium Testimonials & Social Proof Section */}
      <section className="space-section bg-[#F9E7C9] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-luxury rounded-full mb-6">
<div className="w-2 h-2 bg-[#BB4500] rounded-full luxury-glow"></div>
              <span className="text-[#BB4500] text-sm font-bold uppercase tracking-[0.2em]">Customer Stories</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-light text-[#2C2B29] leading-tight" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Trusted by Thousands of <span className="text-luxury">Wellness Enthusiasts</span>
            </h2>
          </div>
          
          {/* Testimonials Carousel */}
          <div className="relative mb-20">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
              className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/70 border border-[#E8E2DC] shadow hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2C2B29]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div
              ref={carouselRef}
              className="hide-scrollbar overflow-x-auto snap-x snap-mandatory flex gap-6 px-1"
              role="region"
              aria-label="Testimonials carousel"
            >
              {[
                {
                  name: "Sarah M.",
                  location: "Cape Town",
                  rating: 5,
                  text: "The magnesium oil spray has completely transformed my recovery routine. No more muscle cramps after workouts!",
                  avatar: "SM",
                  verified: true
                },
                {
                  name: "Marcus K.",
                  location: "Johannesburg",
                  rating: 5,
                  text: "Finally found a natural solution that actually works. The quality is outstanding and shipping was super fast.",
                  avatar: "MK",
                  verified: true
                },
                {
                  name: "Lisa R.",
                  location: "Durban",
                  rating: 5,
                  text: "Love the transparency about ingredients. These products have become an essential part of my daily wellness routine.",
                  avatar: "LR",
                  verified: true
                }
              ].map((testimonial, index) => (
                <div key={index} className="snap-center shrink-0 min-w-[280px] sm:min-w-[360px] lg:min-w-[420px]">
                  <div className="card-premium p-8 text-center">
                    <div className="flex justify-center gap-1 mb-6" aria-label={`${testimonial.rating} star rating`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-[#B5A642] text-lg">★</span>
                      ))}
                    </div>
                    <blockquote className="text-[#7A7771] italic leading-relaxed mb-8 text-lg">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#BB4500] to-[#B5A642] rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-[#2C2B29] flex items-center gap-2">
                          {testimonial.name}
                          {testimonial.verified && (
                            <span className="text-green-600 text-sm" aria-label="Verified customer">✓</span>
                          )}
                        </div>
                        <div className="text-sm text-[#7A7771]">{testimonial.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
              className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/70 border border-[#E8E2DC] shadow hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2C2B29]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          
          {/* Premium Stats */}
          <div className="grid md:grid-cols-4 gap-8 fade-in-up" style={{ animationDelay: '1s' }}>
            {[
              { number: "100,000+", label: "Happy Customers" },
              { number: "100%", label: "Natural Ingredients" },
              { number: "5-Star", label: "Average Rating" },
              { number: "48hr", label: "Fast Delivery" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg transition-all duration-300 hover:bg-[#F9E7C9]/30 hover-glow">
                <div className="text-3xl font-light text-[#8B4513] mb-2" 
                     style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stat.number}
                </div>
                <div className="text-sm text-[#7A7771] uppercase tracking-wide font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
