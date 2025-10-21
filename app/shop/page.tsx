import { ProductsSection } from '@/components/ProductsSection';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section - Canonical Format (matching other pages) */}
      <section className="relative min-h-[var(--hero-min-h-desktop)] md:min-h-[var(--hero-min-h-tablet)] sm:min-h-[var(--hero-min-h-mobile)] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Untitled design (3).png"
            alt="Shop hero"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        {/* Hero Text (matching home page and about page style) */}
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="min-h-[var(--hero-min-h-desktop)] md:min-h-[var(--hero-min-h-tablet)] sm:min-h-[var(--hero-min-h-mobile)] flex flex-col items-center justify-center text-center py-24">
            <h1
              className="u-hero-title text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6"
              style={{
                fontFamily: 'League Spartan, sans-serif',
                fontWeight: 900,
                fontSize: 'var(--hero-font-size)',
                lineHeight: 'var(--hero-lineheight)',
                letterSpacing: 'var(--hero-letterspacing)'
              }}
            >
              THE BETTER WAY NATURAL,<br />NO COMPROMISE
            </h1>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <ProductsSection />
        </div>
      </main>
    </div>
  );
}
