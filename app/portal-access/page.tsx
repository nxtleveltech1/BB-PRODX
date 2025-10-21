"use client";
import GradientCard from '@/components/GradientCard';

export default function PortalAccessPage() {
  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Canonical Format */}
      <section className="relative min-h-[var(--hero-min-h-tablet)] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Platform Graphics/outlet hero banner.png"
            alt="Stock Better Being hero"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
        
        {/* Hero Content */}
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
              LETS GET YOU ON BOARD
            </h1>
            {/* Subtitle removed per spec */}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p 
            className="leading-relaxed text-[var(--bb-payne-gray)] text-lg md:text-2xl font-light"
          >
            You know your community; we'll meet you with the right backing to make it work—clear communication, easy onboarding, fast reorders.
          </p>
        </div>
      </section>

      {/* Path Selection Section */}
      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GradientCard
              icon="/Platform Graphics/Agent.png"
              title="Direct Sales Agent"
              subtitle="Two minutes here, a helpful call from us after."
              ctaText="Get Started"
              href="/stock/direct-sales-agent"
            />
            <GradientCard
              icon="/Platform Graphics/Retail .png"
              title="Retail Store"
              subtitle="Two minutes here, a helpful call from us after."
              ctaText="Get Started"
              href="/stock/retail-store"
            />
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
