"use client";

export default function PortalAccessPage() {
  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Standard Format */}
      <section className="relative min-h-[60vh] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Platform Graphics/outlet hero banner.png"
            alt="Outlet hero"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="min-h-[60vh] pt-24 flex flex-col items-center justify-center text-center">
            <h1 className="text-hero text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6" style={{ letterSpacing: '0.05em' }}>
              LETS GET YOU ON BOARD
            </h1>
            <p className="text-subhero text-white/90">
              Stock Better Being
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl leading-relaxed text-[var(--bb-payne-gray)] font-light">
            You know your community; we'll meet you with the right backing to make it work—clear communication, easy onboarding, fast reorders.
          </p>
        </div>
      </section>

      {/* Path Selection Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Direct Sales Agent Card */}
            <div className="bg-gradient-to-br from-[var(--bb-black-bean)] to-[var(--bb-mahogany)] text-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                  <img
                    src="/Platform Graphics/Agent.png"
                    alt="Direct Sales Agent icon"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-semibold uppercase tracking-wide mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                  Direct Sales Agent
                </h2>
                <p className="text-[var(--bb-champagne)] leading-relaxed mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Two minutes here, a helpful call from us after.
                </p>
                <button className="bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-8 py-3 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg">
                  Get Started
                </button>
              </div>
            </div>

            {/* Retail Store Card */}
            <div className="bg-gradient-to-br from-[var(--bb-black-bean)] to-[var(--bb-mahogany)] text-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                  <img
                    src="/Platform Graphics/Retail .png"
                    alt="Retail Store icon"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-semibold uppercase tracking-wide mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                  Retail Store
                </h2>
                <p className="text-[var(--bb-champagne)] leading-relaxed mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Two minutes here, a helpful call from us after.
                </p>
                <button className="bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-8 py-3 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12 bg-[#F9E7C9]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[var(--bb-payne-gray)] text-sm">
            Need help choosing? <a href="/contact" className="text-[var(--bb-mahogany)] hover:text-[var(--bb-black-bean)] transition-colors duration-300 underline font-medium">Contact our support team</a>
          </p>
        </div>
      </section>
    </div>
  );
}
