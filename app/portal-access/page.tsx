"use client";

export default function PortalAccessPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Brand Colors */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-[var(--bb-mahogany)] via-[var(--bb-black-bean)] to-[var(--bb-payne-gray)] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Platform Graphics/outlet hero banner.png"
            alt="Outlet hero"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--bb-citron)] rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--bb-champagne)] rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 flex items-center min-h-[90vh]">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <p className="text-[var(--bb-citron)] text-sm font-medium uppercase tracking-[0.2em] opacity-90">Stock Better Being</p>
            <h1 className="text-5xl md:text-6xl font-light leading-[0.95] text-white" style={{ fontFamily: 'Prata, Georgia, serif' }}>
              Lets get you on board
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-[var(--bb-citron)] to-transparent mx-auto"></div>
            <p className="text-xl leading-relaxed text-[var(--bb-champagne)] max-w-3xl mx-auto font-light">
              You know your community; we’ll meet you with the right backing to make it work—clear communication, easy onboarding, fast reorders.
            </p>
            
            {/* Path Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-16">
              <div className="p-10 bg-[var(--bb-black-bean)] text-white text-center">
                <img
                  src="/Platform Graphics/Agent.png"
                  alt="Direct Sales Agent icon"
                  className="mx-auto w-20 h-20 object-contain"
                />
                <h2 className="mt-6 text-2xl font-semibold uppercase tracking-wide" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                  Direct Sales Agent
                </h2>
                <p className="mt-3 text-[var(--bb-champagne)]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Two minutes here, a helpful call from us after.
                </p>
              </div>

              <div className="p-10 bg-[var(--bb-black-bean)] text-white text-center">
                <img
                  src="/Platform Graphics/Retail .png"
                  alt="Retail Store icon"
                  className="mx-auto w-20 h-20 object-contain"
                />
                <h2 className="mt-6 text-2xl font-semibold uppercase tracking-wide" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                  Retail Store
                </h2>
                <p className="mt-3 text-[var(--bb-champagne)]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Two minutes here, a helpful call from us after.
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-16">
              <p className="text-[var(--bb-champagne)]/60 text-sm">
                Need help choosing? <a href="/contact" className="text-[var(--bb-citron)] hover:text-white transition-colors duration-300 underline">Contact our support team</a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Header needs padding for absolute positioning */}
        <div className="h-20"></div>
      </section>
    </div>
  );
}