export default function RetailStorePage() {
  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section */}
      <section className="relative min-h-[var(--hero-min-h-tablet)] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Platform Graphics/outlet hero banner.png"
            alt="Retail Store hero"
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
              RETAIL STORE
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-light text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Form Coming Soon
            </h2>
            <p className="text-lg text-[var(--bb-payne-gray)] leading-relaxed mb-8">
              We're preparing a streamlined application process for Retail Stores. The form will be available shortly.
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
