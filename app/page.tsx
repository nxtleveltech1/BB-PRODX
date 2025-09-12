"use client";
import { useState, useEffect } from 'react';
import FeaturedRowAesop from "@/components/FeaturedRowAesop";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Cinematic Fullscreen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image - FIXED */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat ken-burns"
            style={{
              backgroundImage: 'url("/20250902.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />
          
          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2B29]/40 via-transparent to-transparent z-10 pointer-events-none"></div>
          
          {/* Premium Film Grain */}
          <div className="absolute inset-0 grain-texture opacity-20 z-10 pointer-events-none"></div>
        </div>
        
        {/* Hero Content - Asymmetric Layout */}
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-center min-h-screen pt-24">
            {/* Content - Left Aligned, 8 columns */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Dramatic Headlines */}
              <div className="space-y-4 fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h1 className="text-white leading-none" 
                    style={{ 
                      fontSize: 'clamp(2.25rem, 8vw, 6rem)', 
                      fontFamily: 'League Spartan, sans-serif', 
                      fontWeight: '900', 
                      lineHeight: '0.95', 
                      letterSpacing: '0.02em',
                      textShadow: '0 6px 24px rgba(0,0,0,0.6)'
                    }}>
                  <div className="block">TRANSFORM</div>
                  <div className="block text-[#B5A642] ml-4">YOUR WELLNESS</div>
                  <div className="block text-white/80 text-2xl lg:text-4xl font-light mt-4" 
                       style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.05em' }}>
                    Journey to Better Being
                  </div>
                </h1>
              </div>
              
              {/* Elegant Description */}
              <p className="text-white/85 text-xl lg:text-2xl max-w-2xl leading-relaxed fade-in-up"
                 style={{ 
                   fontFamily: 'Playfair Display, serif', 
                   fontWeight: '300',
                   textShadow: '0 4px 16px rgba(0,0,0,0.5)',
                   animationDelay: '0.6s'
                 }}>
                Discover nature's most powerful adaptogens, minerals, and superfoods. 
                Transform your daily rituals with products that actually work.
              </p>
              
              {/* Premium CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 fade-in-up" style={{ animationDelay: '0.9s' }}>
                <a href="/products" className="btn-premium hover-glow focus-premium group">
                  <span>Shop Collection</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a href="/about" 
                   className="px-8 py-4 border-2 border-white/30 text-white font-medium uppercase tracking-wider text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-500 backdrop-blur-sm focus-premium group">
                  <span>Our Story</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:rotate-45 transition-transform inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              
              {/* Trust Indicators removed per request */}
            </div>
            
            {/* Right Side - Floating Product Preview */}
            <div className="lg:col-span-4 flex justify-end items-center">
              <div className="relative float-animation" style={{ animationDelay: '1.5s' }}>
                <div className="w-80 h-80 lg:w-96 lg:h-96 relative">
                  {/* Glowing Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B5A642]/20 to-[#8B4513]/20 rounded-full blur-3xl animate-pulse"></div>
                  
                  {/* Product Image Container */}
                  <div className="relative z-10 w-full h-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 group">
                    <img 
                      src="/magnesium-oil-spray.png"
                      alt="Premium Wellness Products"
                      className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute -top-4 -right-4 bg-[#B5A642] text-[#2C2B29] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-xl">
                      Featured
                    </div>
                  </div>
                </div>
              </div>
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
      <section className="space-section bg-white relative overflow-hidden">
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
                  <span className="text-[#8B4513] text-sm font-bold uppercase tracking-[0.2em]">Experience Wellness</span>
                </div>
                
                <h2 className="text-5xl lg:text-6xl font-light leading-tight text-[#2C2B29] mb-8" 
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your Journey to <span className="text-luxury">Better Being</span>
                </h2>
                
                <div className="w-24 h-px bg-gradient-to-r from-[#8B4513] to-[#B5A642] mb-8"></div>
                
                <p className="text-xl text-[#7A7771] leading-relaxed mb-10 font-light" 
                   style={{ fontFamily: 'Crimson Text, serif' }}>
                  Discover how our carefully sourced ingredients transform daily wellness rituals. 
                  From ancient adaptogens to essential minerals, every product tells a story of 
                  <em className="text-[#8B4513] font-medium">quality and care</em>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <a href="/products" className="btn-premium hover-glow focus-premium group">
                    <span>Explore Collection</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a href="/about" className="inline-flex items-center text-[#8B4513] hover:text-[#B5A642] transition-colors group">
                    <span className="font-medium uppercase tracking-wide text-sm">Our Philosophy</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
                      <source src="/assets_task_01jnj3ddn7fbevcf6g12sq2qfb_task_01jnj3ddn7fbevcf6g12sq2qfb_genid_fcd586c1-15c5-49bd-8e56-78da1fa6d64d_25_03_05_02_51_368972_videos_00000_325496847_md.mp4" type="video/mp4" />
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
                      <video 
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        poster="/magnesium-oil-spray.png"
                      >
                        <source src="/assets_task_01jsr14121ehrvxkn77ds0ws3x_task_01jsr14121ehrvxkn77ds0ws3x_genid_cd56b6aa-1366-4ce8-81b2-6e9697b76ac4_25_04_26_03_09_529526_videos_00000_642864038_source.mp4" type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white text-sm font-medium mb-1">Daily Rituals</h4>
                        <p className="text-white/80 text-xs">Transform routines</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-premium overflow-hidden hover-glow fade-in-up rounded-xl" 
                       style={{ animationDelay: '0.9s' }}>
                    <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#F9E7C9] to-[#f5e1b8]">
                      <video 
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        poster="/magnesium-oil-spray.png"
                      >
                        <source src="/assets_task_01jsxgta9xe24apma9csdbte35_task_01jsxgta9xe24apma9csdbte35_genid_cb1e1ba9-b1f0-4d29-8a51-8f15cd9ed07e_25_04_28_06_20_442219_videos_00000_409075772_source.mp4" type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2B29]/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white text-sm font-medium mb-1">Proven Results</h4>
                        <p className="text-white/80 text-xs">Feel the difference</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Categories - Modern Masonry Layout */}
      <section className="space-luxury bg-[#F9E7C9] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#8B4513]/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 fade-in-up">
            <div className="inline-flex items-center gap-3 px-8 py-4 glass-luxury rounded-full mb-8">
              <div className="w-2 h-2 bg-[#8B4513] rounded-full luxury-glow"></div>
              <span className="text-[#8B4513] text-sm font-bold uppercase tracking-[0.2em]">Wellness Essentials</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-light text-[#2C2B29] max-w-5xl mx-auto leading-tight mb-6" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Carefully curated products for <span className="text-luxury">modern wellness</span>
            </h2>
            
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#8B4513] to-transparent mx-auto"></div>
          </div>
          
          {/* Sophisticated Product Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Adaptogens - Hero Card */}
            <a href="/products" 
               className="card-premium group overflow-hidden hover-glow parallax-hover fade-in-up focus-premium rounded-2xl"
               style={{ animationDelay: '0.2s' }}>
              <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-[#F9E7C9] to-[#f5e1b8]">
                <img 
                  src="/assets_task_01jyyj4jt3e9atxgmk5jjt6s6n_1751224862_img_0.webp"
                  alt="Premium Adaptogens Collection"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/magnesium-oil-spray.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Floating badge */}
                <div className="badge-premium">
                  Most Popular
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white text-3xl font-light mb-4" 
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                    Adaptogens
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-6 font-light" 
                     style={{ fontFamily: 'Crimson Text, serif' }}>
                    Balance stress and restore calm with ancient botanical wisdom that modern science validates.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#B5A642] group-hover:text-white transition-colors">
                      <span className="text-sm uppercase tracking-wide font-bold">Explore Collection</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="text-white/60 text-sm">12 Products</div>
                  </div>
                </div>
              </div>
            </a>

            {/* Minerals - Compact Card */}
            <a href="/products" 
               className="card-premium group overflow-hidden hover-glow fade-in-up focus-premium rounded-2xl"
               style={{ animationDelay: '0.4s' }}>
              <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-[#F9E7C9] to-[#f5e1b8]">
                <img 
                  src="/assets_task_01k41a33mcfmnbrtp0g4gzy59e_1756685796_img_0.webp"
                  alt="Essential Minerals Collection"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/magnesium-oil-spray.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/70 via-[#8B4513]/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white text-2xl font-light mb-3" 
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                    Essential Minerals
                  </h3>
                  <p className="text-white/90 text-base leading-relaxed mb-4 font-light" 
                     style={{ fontFamily: 'Crimson Text, serif' }}>
                    Replenish essentials for daily energy and vitality.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#B5A642] group-hover:text-white transition-colors">
                      <span className="text-xs uppercase tracking-wide font-bold">Shop Now</span>
                      <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="text-white/60 text-sm">8 Products</div>
                  </div>
                </div>
              </div>
            </a>

            {/* Superfoods - Square Card */}
            <a href="/products" 
               className="card-premium group overflow-hidden hover-glow fade-in-up focus-premium rounded-2xl"
               style={{ animationDelay: '0.6s' }}>
              <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-[#F9E7C9] to-[#f5e1b8]">
                <img 
                  src="/assets_task_01k3pzrsb6fjmt46d7c18qp9zt_1756339480_img_0.webp"
                  alt="Nutrient-Dense Superfoods"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/magnesium-oil-spray.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2B29]/70 via-[#2C2B29]/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white text-2xl font-light mb-3" 
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                    Superfoods
                  </h3>
                  <p className="text-white/90 text-base leading-relaxed mb-4 font-light" 
                     style={{ fontFamily: 'Crimson Text, serif' }}>
                    Simple nutrition, thoughtfully sourced from nature.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#B5A642] group-hover:text-white transition-colors">
                      <span className="text-xs uppercase tracking-wide font-bold">Discover</span>
                      <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="text-white/60 text-sm">6 Products</div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products - Aesop inspired row */}
      {/** Using real data and a simple, refined layout similar to the provided reference **/}
      <FeaturedRowAesop />

      {/* Philosophy Section - Rich Background */}
      <section className="space-luxury bg-gradient-to-br from-[#B5A642] to-[#a49637] relative overflow-hidden">
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
              Wellness without the <span className="not-italic text-[#8B4513]">noise</span>
            </h2>
            <div className="w-24 h-px bg-[#2C2B29] mx-auto"></div>
            <p className="text-xl leading-relaxed text-[#2C2B29]/90 max-w-3xl mx-auto font-light">
              In a world of endless supplements and complex regimens, we chose a different path. 
              Products with purpose. Rituals that ground you. Stories that inspire.
            </p>
            <div className="pt-8">
              <a href="/about" className="btn-premium hover-glow focus-premium bg-[#2C2B29] hover:bg-[#8B4513]">
                Read Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Newsletter Signup Section */}
      <section className="space-section bg-gradient-to-br from-[#F9E7C9] via-[#F9E7C9] to-[#f5e1b8] relative overflow-hidden">
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
                  <button className="btn-premium px-6 py-2 text-sm hover-glow focus-premium">
                    Subscribe
                  </button>
                </div>
                
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
      <section className="space-section bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-luxury rounded-full mb-6">
              <div className="w-2 h-2 bg-[#8B4513] rounded-full luxury-glow"></div>
              <span className="text-[#8B4513] text-sm font-bold uppercase tracking-[0.2em]">Customer Stories</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-light text-[#2C2B29] leading-tight" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Trusted by Thousands of <span className="text-luxury">Wellness Enthusiasts</span>
            </h2>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
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
              <div key={index} className="card-premium p-8 text-center fade-in-up float-animation hover-glow" 
                   style={{ animationDelay: `${0.2 + index * 0.2}s` }}>
                {/* Star Rating */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#B5A642] text-lg">★</span>
                  ))}
                </div>
                
                <blockquote className="text-[#7A7771] italic leading-relaxed mb-8 text-lg">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B4513] to-[#B5A642] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[#2C2B29] flex items-center gap-2">
                      {testimonial.name}
                      {testimonial.verified && (
                        <span className="text-green-600 text-sm">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-[#7A7771]">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Premium Stats */}
          <div className="grid md:grid-cols-4 gap-8 fade-in-up" style={{ animationDelay: '1s' }}>
            {[
              { number: "10,000+", label: "Happy Customers" },
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
