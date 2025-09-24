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
            <p className="text-[var(--bb-citron)] text-sm font-medium uppercase tracking-[0.2em] opacity-90">Portal Access</p>
            <h1 className="text-5xl md:text-6xl font-light leading-[0.95] text-white" style={{ fontFamily: 'Prata, Georgia, serif' }}>
              Choose Your <span className="text-[var(--bb-citron)]">Path</span>
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-[var(--bb-citron)] to-transparent mx-auto"></div>
            <p className="text-xl leading-relaxed text-[var(--bb-champagne)] max-w-3xl mx-auto font-light">
              Select your access type to continue to the Better Being platform
            </p>
            
            {/* Path Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-16">
              {/* Agent Distributor Path */}
              <div className="group relative bg-gradient-to-br from-[var(--bb-citron)] via-[var(--bb-citron)]/90 to-[var(--bb-citron)]/80 p-12 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center space-y-8">
                  <div className="w-20 h-20 mx-auto bg-[var(--bb-black-bean)]/20 group-hover:bg-[var(--bb-black-bean)]/30 rounded-full flex items-center justify-center transition-all duration-300">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-3xl font-light text-[var(--bb-black-bean)]" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                      Agent Distributor
                    </h2>
                    <p className="text-[var(--bb-black-bean)]/80 leading-relaxed">
                      Access the distributor portal to manage your Better Being business, view commission reports, and access exclusive wholesale pricing.
                    </p>
                    <div className="pt-4">
                      <a 
                        href="/agent-portal" 
                        className="inline-block bg-[var(--bb-black-bean)] hover:bg-[var(--bb-mahogany)] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 hover:transform hover:scale-105"
                      >
                        Agent Sign In
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retail Customer Path */}
              <div className="group relative bg-gradient-to-br from-[var(--bb-payne-gray)] via-[var(--bb-black-bean)] to-[var(--bb-mahogany)] p-12 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl text-white">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center space-y-8">
                  <div className="w-20 h-20 mx-auto bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300">
                    <span className="text-4xl">🛍️</span>
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-3xl font-light text-white" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                      Retail <span className="text-[var(--bb-citron)]">Customer</span>
                    </h2>
                    <p className="text-[var(--bb-champagne)] leading-relaxed">
                      Shop our curated selection of wellness products, manage your orders, and access your customer account for a personalized experience.
                    </p>
                    <div className="pt-4 space-y-3">
                      <div>
                        <a 
                          href="/auth/login" 
                          className="inline-block bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 hover:transform hover:scale-105 mr-4"
                        >
                          Sign In
                        </a>
                      </div>
                      <div className="text-sm">
                        <span className="text-[var(--bb-champagne)]/70">New customer? </span>
                        <a 
                          href="/auth/register" 
                          className="text-[var(--bb-citron)] hover:text-white transition-colors duration-300 underline"
                        >
                          Create Account
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
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