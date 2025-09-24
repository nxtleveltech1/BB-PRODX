"use client";

export default function AboutPage() {
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
            <h1 className="text-hero text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6">BETTER BEGINS HERE</h1>
            <p className="text-subhero text-white/90 mb-10">Products that earn their place in your day</p>
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
              What We <em className="text-[var(--bb-mahogany)]">Stand For</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: "🌱",
                title: "Thoughtfully Sourced",
                description: "Every ingredient is carefully selected from ethical suppliers who share our values.",
                bgColor: "bg-[var(--bb-mahogany)]",
                textColor: "text-white",
                accentColor: "text-[var(--bb-citron)]"
              },
              {
                icon: "🔬",
                title: "Science-Backed", 
                description: "Traditional wisdom meets modern research. We choose what works, backed by evidence.",
                bgColor: "bg-[var(--bb-black-bean)]",
                textColor: "text-white",
                accentColor: "text-[var(--bb-champagne)]"
              },
              {
                icon: "🏔️",
                title: "Pure & Potent",
                description: "No fillers, no shortcuts. Just pure, potent ingredients at therapeutic dosages.",
                bgColor: "bg-[var(--bb-citron)]",
                textColor: "text-[var(--bb-black-bean)]",
                accentColor: "text-[var(--bb-mahogany)]"
              },
              {
                icon: "📖",
                title: "Story-Driven",
                description: "Each product has a story. We share the journey from source to shelf transparently.",
                bgColor: "bg-[var(--bb-payne-gray)]",
                textColor: "text-white",
                accentColor: "text-[var(--bb-citron)]"
              }
            ].map((value, index) => (
              <div key={index} className={`${value.bgColor} p-8 group hover:scale-105 transition-all duration-500 relative overflow-hidden`}>
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto bg-white/10 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300">
                    <span className="text-3xl">{value.icon}</span>
                  </div>
                  <div className="space-y-4">
                    <h3 className={`text-xl font-light ${value.textColor} group-hover:${value.accentColor} transition-colors duration-300`} style={{ fontFamily: 'Prata, Georgia, serif' }}>
                      {value.title}
                    </h3>
                    <p className={`${value.textColor} opacity-90 leading-relaxed text-sm`}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Section - Split Background with Payne Gray */}
      <section className="py-0">
        <div className="grid lg:grid-cols-2 min-h-[60vh] md:min-h-[70vh]">
          {/* Image Side with Payne Gray */}
          <div className="bg-[var(--bb-payne-gray)] relative overflow-hidden flex items-center justify-center">
            <img 
              src="/assets_task_01k41a33mcfmnbrtp0g4gzy59e_1756685796_img_0.webp"
              alt="Tree of life - Better Being wellness philosophy"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets_task_01k3pzrsb6fjmt46d7c18qp9zt_1756339480_img_0.webp';
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bb-black-bean)]/30 to-[var(--bb-mahogany)]/20"></div>
            
            {/* Badge */}
            <div className="absolute top-8 left-8 bg-[var(--bb-citron)] text-[var(--bb-black-bean)] px-4 py-2 text-sm uppercase tracking-wider font-medium">
              Creator-Led Approach
            </div>
          </div>

          {/* Content Side with Mahogany Background */}
          <div className="bg-gradient-to-br from-[var(--bb-mahogany)] to-[var(--bb-black-bean)] flex items-center text-white">
            <div className="p-8 md:p-16 space-y-8 md:space-y-10 max-w-lg">
              <div className="space-y-8">
                <p className="text-[var(--bb-citron)] text-sm font-medium uppercase tracking-[0.2em] opacity-90">Creator-Led</p>
                <h2 className="text-3xl md:text-5xl font-light leading-tight" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                  Personal <em className="text-[var(--bb-citron)]">Curation</em>
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-[var(--bb-citron)]"></div>
                  <div className="w-12 h-px bg-[var(--bb-champagne)]"></div>
                </div>
                <div className="space-y-6 text-lg leading-relaxed text-[var(--bb-champagne)] font-light">
                  <p>
                    Better Being isn't just a brand—it's a personal practice shared. Every product 
                    we offer is something we use ourselves, test thoroughly, and believe in completely.
                  </p>
                  <p>
                    This isn't mass-market wellness. It's intimate curation by people who understand 
                    that true wellness is deeply personal and requires products that actually work.
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a href="/contact" className="bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-10 py-4 font-medium uppercase tracking-wider transition-all duration-300 hover:transform hover:scale-105">
                  Connect With Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
