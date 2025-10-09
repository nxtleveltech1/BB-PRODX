"use client";

interface StoreLocatorProps {
  compact?: boolean;
  initialCenter?: [number, number];
  initialRadius?: number;
  initialType?: string;
  initialHighlightId?: string;
  initialQuery?: string;
  edgeToEdge?: boolean;
}

export default function StoreLocator(props: StoreLocatorProps) {
  return (
    <div className="py-16 bg-[#F9E7C9]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-light text-[var(--bb-black-bean)] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Find Better Being Products Near You
        </h2>
        <p className="text-lg text-[var(--bb-payne-gray)] mb-8">
          Store locator functionality coming soon. In the meantime, please contact us to find your nearest stockist.
        </p>
        <a
          href="/contact"
          className="inline-block bg-[var(--bb-mahogany)] hover:bg-[var(--bb-mahogany)]/90 text-white px-8 py-3 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
