export default function DirectSalesAgentPage() {
  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section */}
      <section className="relative min-h-[var(--hero-min-h-tablet)] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Platform Graphics/outlet hero banner.png"
            alt="Direct Sales Agent hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
        
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
              DIRECT SALES AGENT
            </h1>
            <p className="text-subhero text-white/90">Application Form</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-[var(--bb-mahogany)]/10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--bb-mahogany)]/10 to-[var(--bb-citron)]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--bb-mahogany)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-light text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Form Coming Soon
            </h2>
            <p className="text-lg text-[var(--bb-payne-gray)] leading-relaxed mb-8">
              We're preparing a streamlined application process for Direct Sales Agents. The form will be available shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/portal-access"
                className="inline-block bg-[var(--bb-mahogany)] hover:bg-[var(--bb-mahogany)]/90 text-white px-8 py-3 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
              >
                Back to Options
              </a>
              <a
                href="/contact"
                className="inline-block bg-white border-2 border-[var(--bb-mahogany)] text-[var(--bb-mahogany)] hover:bg-[var(--bb-mahogany)] hover:text-white px-8 py-3 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
