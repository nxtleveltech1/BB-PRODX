"use client";
import { useRef } from 'react';

export default function AboutPage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Image background stretched to fit */}
      <section className="relative min-h-[80vh] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Platform Graphics/About - Hero Banner.png"
            alt="About hero"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        {/* Hero Text (matching home page style) */}
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="min-h-[80vh] pt-24 flex flex-col items-center justify-center text-center">
            <h1 className="text-hero text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6">PRODUCTS THAT EARN THEIR PLACE IN YOUR DAY</h1>
          </div>
        </div>
        {/* Keep a spacer for absolute header overlap */}
        <div className="h-20"></div>
      </section>

      {/* Story Section - Champagne Background with Brand Imagery */}
      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-[var(--bb-black-bean)] text-sm font-medium uppercase tracking-[0.2em] opacity-80">Philosophy</p>
                <h2 className="text-3xl md:text-5xl font-light text-[var(--bb-black-bean)] leading-tight" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                  Born from a Simple Conviction
                </h2>
                <div className="w-16 h-px bg-[var(--bb-mahogany)]"></div>
                <div className="space-y-6 text-lg leading-relaxed text-[var(--bb-black-bean)] font-light">
                  <p>
                    Better Being was born from a simple conviction: wellness should work, feel honest, and be
                    accessible to all. We care—about lives, truth, and impact—and we show it in the way we
                    source, formulate, and speak. We make products that work and hold to principles that don’t
                    bend. Built on care. Driven by success.
                  </p>
                  <p>
                    We exist to remove the noise between people and what helps them feel better. No theatrics, no
                    shortcuts—just thoughtful making, clear language, and products that earn their place in your
                    day.
                  </p>
                  <p className="italic">- Better Being Founding Team</p>
                </div>
              </div>
            </div>
            
            <div className="aspect-[4/5] relative overflow-hidden">
              <img 
                src="/Platform Graphics/About Philosophy.png"
                alt="About philosophy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets_task_01k3pzrsb6fjmt46d7c18qp9zt_1756339480_img_0.webp';
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bb-mahogany)]/40 to-transparent pointer-events-none"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-[var(--bb-champagne)] text-[var(--bb-black-bean)] px-4 py-2 text-sm uppercase tracking-wider font-medium">
                Natural Wellness
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Champagne Background with Individual Color Cards */}
      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <p className="text-[var(--bb-payne-gray)] text-sm font-medium uppercase tracking-[0.2em] mb-6">Our Commitment</p>
            <h2 className="text-3xl md:text-5xl font-light text-[var(--bb-black-bean)] max-w-2xl mx-auto leading-tight" style={{ fontFamily: 'Prata, Georgia, serif' }}>
              How we think (and make)
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: "/Platform Graphics/lab meets nature icon.png",
                title: "Lab-meets-nature",
                description: "We start with evidence, learn from nature, and iterate until the result is both effective and ethical.",
              },
              {
                icon: "/Platform Graphics/good only icon.png",
                title: "Good only",
                description: "If it doesn’t meet our standard, it doesn’t make the shelf—ingredients, partners, and practices included.",
              },
              {
                icon: "/Platform Graphics/deep thinkers bold doers icon.png",
                title: "Deep thinkers. Bold doers",
                description: "We ask harder questions, make the brave call, and build what doesn’t exist—then we stand behind the results.",
              },
              {
                icon: "/Platform Graphics/accessible by design icon.png",
                title: "Accessible by design",
                description: "We build what works and price it with integrity—no hype tax, no bloated margins—so wellness isn’t a luxury; it’s everyday",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col items-start text-left space-y-4">
                  <img src={item.icon} alt={`${item.title} icon`} className="w-12 h-12 object-contain" />
                  <h3 className="text-xl font-semibold tracking-wide" style={{ fontFamily: 'League Spartan, sans-serif', color: 'var(--bb-black-bean)' }}>
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--bb-payne-gray)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonials & Social Proof Section (moved from Home) */}
      <section className="space-section bg-[#F9E7C9] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-luxury rounded-full mb-6">
              <div className="w-2 h-2 bg-[#BB4500] rounded-full luxury-glow"></div>
              <span className="text-[#BB4500] text-sm font-bold uppercase tracking-[0.2em]">Customer Stories</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-light text-[#2C2B29] leading-tight" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Voices from the Community
            </h2>
            <p className="mt-4 text-[#7A7771] max-w-3xl mx-auto">
              Reflections from the people who keep the mission moving every day. We keep our faces off the front so the community can lead. These voices keep us honest and our standards high.
            </p>
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
                  name: "Suré Tredoux",
                  location: "",
                  rating: 5,
                  text: "Being part of the Better Being community feels uplifting and authentic. The products are 100% natural, and I’ve experienced for myself that it really and truly works. What I love most is that it’s more than just products, it’s a space where people share, support, and inspire each other to live in a healthier, more natural way.",
                  avatar: "ST",
                  verified: true
                },
                {
                  name: "Chelsea Kruser",
                  location: "",
                  rating: 5,
                  text: "What I really appreciate about Better Being is how genuinely committed the company is to people’s health and well-being. The products are 100% natural, and that makes a real difference in a world where so many options are full of chemicals. The team behind it all is passionate, thoughtful, and truly cares about creating something that helps people and supports the community.",
                  avatar: "CK",
                  verified: true
                },
                {
                  name: "Elna Flawn",
                  location: "",
                  rating: 5,
                  text: "It's a privilege being part of the Better Being team—a really positive & dynamic environment to be around, continually innovating with new products. I look forward to everyday, assisting in getting our all natural products to our customers, and getting positive feedback on how it made a difference in their lives.",
                  avatar: "EF",
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

      {/* What we aim to (and continue to) achieve */}
      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-[var(--bb-black-bean)] max-w-3xl mx-auto leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              What we aim to (and continue to) achieve
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                title: 'Trust at scale',
                description: 'Products people return to because they work.'
              },
              {
                title: 'Access without compromise',
                description: 'Ethical, effective wellness within reach.'
              },
              {
                title: 'A standard others can adopt',
                description: 'Open, repeatable ways of doing good work.'
              },
              {
                title: 'A community built on care',
                description: 'Small daily actions adding up to better being—for everyone.'
              }
            ].map((block, idx) => (
              <div key={idx} className="bg-[var(--bb-black-bean)] p-8 transition-shadow duration-300">
                <h3 className="text-xl font-semibold tracking-wide mb-3" style={{ fontFamily: 'League Spartan, sans-serif', color: 'var(--bb-champagne)' }}>
                  {block.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--bb-champagne)' }}>
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
