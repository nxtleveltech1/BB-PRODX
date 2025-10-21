export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section */}
      <section className="relative min-h-[var(--hero-min-h-desktop)] md:min-h-[var(--hero-min-h-tablet)] sm:min-h-[var(--hero-min-h-mobile)] bg-[var(--bb-black-bean)] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#BB4500]/20 to-transparent"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1
            className="text-4xl lg:text-6xl font-light text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Accessibility Statement
          </h1>
          <p className="text-lg text-white/80">
            Our Commitment to Digital Accessibility
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-[var(--bb-mahogany)]/10">

            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg leading-relaxed text-[var(--bb-black-bean)] mb-4">
                Better Being is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
              <p className="text-lg leading-relaxed text-[var(--bb-black-bean)]">
                Last updated: January 2025
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Our Commitment
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We believe that everyone should be able to access wellness products and information regardless of ability. We are working to ensure our website conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Accessibility Features
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                Our website includes the following accessibility features:
              </p>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Perceivable</h3>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)] mb-4">
                <li>Alternative text for images</li>
                <li>Sufficient color contrast ratios</li>
                <li>Resizable text without loss of content or functionality</li>
                <li>Clear visual focus indicators</li>
                <li>Semantic HTML structure</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Operable</h3>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)] mb-4">
                <li>Full keyboard navigation support</li>
                <li>No keyboard traps</li>
                <li>Sufficient time to read and interact with content</li>
                <li>Clear and consistent navigation</li>
                <li>Skip navigation links</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Understandable</h3>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)] mb-4">
                <li>Clear and simple language</li>
                <li>Predictable navigation and functionality</li>
                <li>Error identification and suggestions</li>
                <li>Labels and instructions for forms</li>
                <li>Consistent design patterns</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Robust</h3>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>Compatible with assistive technologies</li>
                <li>Valid HTML and ARIA attributes</li>
                <li>Cross-browser compatibility</li>
                <li>Responsive design for various devices</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Assistive Technology Compatibility
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                Our website is designed to be compatible with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                <li>Screen magnification software</li>
                <li>Speech recognition software</li>
                <li>Alternative input devices</li>
                <li>Browser accessibility features</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Browser and Device Support
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We support the following technologies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>Chrome (latest version)</li>
                <li>Firefox (latest version)</li>
                <li>Safari (latest version)</li>
                <li>Edge (latest version)</li>
                <li>Mobile browsers on iOS and Android</li>
              </ul>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mt-4">
                For the best experience, we recommend using the latest version of your preferred browser with JavaScript enabled.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Known Limitations
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                Despite our best efforts, some areas of our website may not yet be fully accessible. We are aware of the following limitations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)] mb-4">
                <li>Some third-party content (social media embeds, payment processors) may have accessibility limitations</li>
                <li>PDF documents may not be fully accessible (we are working to provide accessible alternatives)</li>
                <li>Some images may lack detailed alternative text descriptions</li>
              </ul>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                We are actively working to address these issues in upcoming updates.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Accessibility Testing
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We regularly test our website using:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>Automated accessibility testing tools (axe DevTools, WAVE, Lighthouse)</li>
                <li>Manual testing with keyboard navigation</li>
                <li>Screen reader testing (NVDA, JAWS, VoiceOver)</li>
                <li>Real user testing with people with disabilities</li>
                <li>Regular accessibility audits</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Continuous Improvement
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                Accessibility is an ongoing effort. We are committed to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)] mt-4">
                <li>Regular accessibility audits and testing</li>
                <li>Staff training on accessibility best practices</li>
                <li>Incorporating accessibility into our design and development process</li>
                <li>Staying current with WCAG guidelines and best practices</li>
                <li>Listening to user feedback and making improvements</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Alternative Access Options
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                If you experience difficulty using our website, we offer alternative ways to access our products and services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li><strong>Phone:</strong> Call us for assistance with orders and product information</li>
                <li><strong>Email:</strong> Contact us via email for detailed inquiries</li>
                <li><strong>In-Person:</strong> Visit our stockists for hands-on product selection</li>
                <li><strong>Accessible Documents:</strong> Request product information in alternative formats</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Third-Party Content
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                Some content on our website is provided by third-party services (payment processors, social media platforms, analytics tools). While we strive to choose accessible third-party services, we cannot guarantee their accessibility. If you encounter issues with third-party content, please let us know.
              </p>
            </div>

            {/* Feedback Section */}
            <div className="mt-12 p-6 bg-[var(--bb-champagne)] rounded-lg border border-[var(--bb-mahogany)]/20">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Feedback and Contact Information
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers:
              </p>
              <div className="space-y-2 text-base text-[var(--bb-payne-gray)] mb-6">
                <p><strong>Better Being</strong></p>
                <p>Email: <a href="mailto:accessibility@betterbeing.co.za" className="text-[var(--bb-mahogany)] hover:underline">accessibility@betterbeing.co.za</a></p>
                <p>Phone: [To be inserted]</p>
                <p>Address: 171 Blaauwberg Rd, Table View, Cape Town 7441, South Africa</p>
              </div>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                We aim to respond to accessibility feedback within 5 business days and strive to resolve issues within 10 business days.
              </p>
            </div>

            {/* Formal Complaints */}
            <div className="mt-8 p-6 bg-white/40 rounded-lg border border-[var(--bb-mahogany)]/10">
              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3">Formal Complaints</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                If you are not satisfied with our response to your accessibility concerns, you may file a complaint with:
              </p>
              <div className="space-y-2 text-base text-[var(--bb-payne-gray)]">
                <p><strong>South African Human Rights Commission</strong></p>
                <p>Website: <a href="https://www.sahrc.org.za" className="text-[var(--bb-mahogany)] hover:underline" target="_blank" rel="noopener noreferrer">www.sahrc.org.za</a></p>
                <p>Email: complaints@sahrc.org.za</p>
                <p>Phone: 011 877 3600</p>
              </div>
            </div>

            {/* Standards Reference */}
            <div className="mt-8 text-sm text-[var(--bb-payne-gray)]">
              <p>
                <strong>Conformance status:</strong> This website is designed to conform to WCAG 2.1 Level AA. We are continuously working towards full compliance.
              </p>
              <p className="mt-2">
                <strong>Standards:</strong> Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
              </p>
              <p className="mt-2">
                <strong>Additional standards considered:</strong> Section 508 (USA), EN 301 549 (EU), and South African accessibility guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
