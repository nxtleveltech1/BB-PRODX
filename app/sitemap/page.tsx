export default function SitemapPage() {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" },
        { name: "Shop All Products", url: "/shop" },
        { name: "Products", url: "/products" },
        { name: "Contact Us", url: "/contact" },
      ]
    },
    {
      title: "Product Categories",
      links: [
        { name: "Monthly Favourites", url: "/products#monthly-favourites" },
        { name: "Pain Relief", url: "/products?category=pain-relief" },
        { name: "Digestive Health", url: "/products?category=digestive" },
        { name: "Skin Care", url: "/products?category=skincare" },
        { name: "Respiratory Support", url: "/products?category=respiratory" },
        { name: "General Wellness", url: "/products?category=wellness" },
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Store Locator", url: "/store-locator" },
        { name: "Portal Access", url: "/portal-access" },
        { name: "Become a Stockist", url: "/stock/retail-store" },
        { name: "FAQ", url: "/faq" },
      ]
    },
    {
      title: "Customer Account",
      links: [
        { name: "My Account", url: "/account" },
        { name: "Order History", url: "/account/orders" },
        { name: "Wishlist", url: "/wishlist" },
        { name: "Shopping Cart", url: "/cart" },
      ]
    },
    {
      title: "Legal & Policies",
      links: [
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" },
        { name: "Refund Policy", url: "/refund-policy" },
        { name: "Accessibility", url: "/accessibility" },
      ]
    },
    {
      title: "Connect With Us",
      links: [
        { name: "Instagram", url: "https://www.instagram.com/the.betterbeing/", external: true },
        { name: "Facebook", url: "https://facebook.com/betterbeing", external: true },
        { name: "LinkedIn", url: "https://linkedin.com/company/betterbeing", external: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] bg-[var(--bb-black-bean)] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#BB4500]/20 to-transparent"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1
            className="text-4xl lg:text-6xl font-light text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Sitemap
          </h1>
          <p className="text-lg text-white/80">
            Navigate our complete website structure
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-[var(--bb-mahogany)]/10">

            {/* Introduction */}
            <div className="mb-12 text-center">
              <p className="text-lg leading-relaxed text-[var(--bb-black-bean)]">
                Find all pages and sections of the Better Being website organized for easy navigation.
              </p>
            </div>

            {/* Grid of Sections */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section, index) => (
                <div key={index} className="bg-white/40 rounded-lg p-6 border border-[var(--bb-mahogany)]/10">
                  <h2
                    className="text-xl font-semibold text-[var(--bb-black-bean)] mb-4 pb-3 border-b border-[var(--bb-mahogany)]/20"
                    style={{ fontFamily: 'League Spartan, sans-serif' }}
                  >
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.url}
                          className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors flex items-center group"
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                        >
                          <svg
                            className="w-4 h-4 mr-2 text-[var(--bb-mahogany)] opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {link.name}
                          {link.external && (
                            <svg
                              className="w-3 h-3 ml-1 opacity-50"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Popular Products Section */}
            <div className="mt-12 bg-white/40 rounded-lg p-8 border border-[var(--bb-mahogany)]/10">
              <h2
                className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-6"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Featured Products
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="/products/1" className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Go Go Pain – Intense Pain Reliever
                </a>
                <a href="/products/4" className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Raw Pro-biotic Gut Repair
                </a>
                <a href="/products/5" className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Bronchial Relief
                </a>
                <a href="/products/16" className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Anti-Viral & Bacterial
                </a>
                <a href="/products/2" className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Night Care
                </a>
                <a href="/products/7" className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Eye Repair
                </a>
                <a href="/products/14" className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Premium Collagen
                </a>
                <a href="/products/10" className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Woman's Algorithm
                </a>
              </div>
            </div>

            {/* Search and Contact CTA */}
            <div className="mt-12 bg-gradient-to-r from-[var(--bb-mahogany)]/10 to-[var(--bb-citron)]/10 rounded-lg p-8 text-center">
              <h2
                className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Can't Find What You're Looking For?
              </h2>
              <p className="text-[var(--bb-payne-gray)] mb-6">
                Use our search feature or contact our customer support team for assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--bb-mahogany)] hover:bg-[var(--bb-black-bean)] text-white px-8 py-3 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Website
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--bb-citron)] hover:bg-[var(--bb-black-bean)] text-white px-8 py-3 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </a>
              </div>
            </div>

            {/* XML Sitemap Note */}
            <div className="mt-8 p-4 bg-white/40 rounded-lg border border-[var(--bb-mahogany)]/10 text-sm text-[var(--bb-payne-gray)]">
              <p className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-[var(--bb-mahogany)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>For search engines:</strong> An XML sitemap is available at <a href="/sitemap.xml" className="text-[var(--bb-mahogany)] hover:underline">/sitemap.xml</a> for automated crawling and indexing.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
