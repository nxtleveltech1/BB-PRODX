export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-lg text-white/80">
            Last Updated: January 2025
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
                These Terms of Service ("Terms") govern your use of the Better Being website and the purchase of our wellness products. By accessing our website or making a purchase, you agree to be bound by these Terms.
              </p>
              <p className="text-lg leading-relaxed text-[var(--bb-black-bean)]">
                These Terms comply with the Electronic Communications and Transactions Act, 2002 (ECTA) and the Consumer Protection Act, 2008 (CPA) of South Africa.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                1. Acceptance of Terms
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                By using this website, you confirm that you are at least 18 years old or have parental/guardian consent. You agree to use our services only for lawful purposes and in accordance with these Terms.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                2. Company Information
              </h2>
              <div className="text-base text-[var(--bb-payne-gray)] space-y-2">
                <p><strong>Company Name:</strong> Better Being (Pty) Ltd</p>
                <p><strong>Physical Address:</strong> 171 Blaauwberg Rd, Table View, Cape Town 7441, South Africa</p>
                <p><strong>Email:</strong> info@betterbeing.co.za</p>
                <p><strong>Registration Number:</strong> [To be inserted]</p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                3. Products and Services
              </h2>
              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Product Information</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We make every effort to display our products and their specifications accurately. However, we do not warrant that product descriptions, images, or other content is accurate, complete, or error-free.
              </p>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Health and Safety Disclaimer</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                Our wellness products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Results may vary between individuals. Always consult a healthcare professional before using any supplement, especially if you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>Are pregnant, nursing, or planning pregnancy</li>
                <li>Have existing medical conditions</li>
                <li>Are taking prescription medications</li>
                <li>Are under 18 years of age (unless approved by a healthcare provider)</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                4. Pricing and Payment
              </h2>
              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Pricing</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                All prices are displayed in South African Rand (ZAR) and include VAT unless otherwise stated. We reserve the right to change prices at any time without prior notice. Prices applicable at the time of order placement will apply.
              </p>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Payment Methods</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We accept the following payment methods:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>Credit and debit cards (Visa, Mastercard)</li>
                <li>Electronic Funds Transfer (EFT)</li>
                <li>Instant EFT</li>
                <li>PayFast and other secure payment gateways</li>
              </ul>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mt-4">
                Payment information is processed securely through third-party payment processors. We do not store your complete credit card details.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                5. Orders and Order Confirmation
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                When you place an order:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>You will receive an email acknowledging receipt of your order</li>
                <li>Order acceptance and confirmation occur when we dispatch the products</li>
                <li>We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspected fraud</li>
                <li>In case of cancellation, any payment already made will be refunded</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                6. Delivery and Shipping
              </h2>
              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Delivery Timeframes</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                Standard delivery within South Africa typically takes 3-7 business days from order confirmation. Delivery times may vary based on location and courier availability.
              </p>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Shipping Costs</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                Shipping costs are calculated at checkout based on delivery location and order weight. Free shipping may be available for orders above a specified amount.
              </p>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Risk and Ownership</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                Risk of loss and title for products pass to you upon delivery to the courier. We are not responsible for delays caused by courier services or circumstances beyond our control.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                7. Returns, Refunds, and Cancellations
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                In accordance with the Consumer Protection Act, you have the right to:
              </p>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Cooling-Off Period</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                You may cancel your order within 7 business days of receipt without reason. Products must be returned unopened, unused, and in original packaging. You are responsible for return shipping costs unless the product is defective.
              </p>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Defective or Damaged Products</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                If you receive a defective or damaged product, please contact us within 48 hours of delivery. We will arrange for collection and provide a full refund or replacement at no additional cost.
              </p>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Refund Processing</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                Approved refunds will be processed within 14 business days using the original payment method.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                8. Warranties and Limitations
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                Our products are manufactured to high quality standards. However:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>We do not guarantee specific health outcomes or results</li>
                <li>Products are sold "as is" except for defects in materials or workmanship</li>
                <li>We are not liable for any indirect, consequential, or special damages</li>
                <li>Our maximum liability is limited to the purchase price of the product</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                9. Intellectual Property
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                All content on this website, including text, graphics, logos, images, and software, is the property of Better Being and is protected by South African and international copyright laws. You may not reproduce, distribute, or use any content without our written permission.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                10. User Accounts
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>Provide accurate and complete information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                11. Prohibited Uses
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>Use our website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Transmit viruses or malicious code</li>
                <li>Engage in fraudulent activities</li>
                <li>Impersonate any person or entity</li>
                <li>Resell our products without authorization</li>
              </ul>
            </div>

            {/* Section 12 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                12. Dispute Resolution
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                If you have a complaint, please contact us first to resolve the issue amicably. If we cannot resolve the dispute internally:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>You may refer the matter to the Consumer Goods and Services Ombud or the National Consumer Commission</li>
                <li>These Terms are governed by the laws of South Africa</li>
                <li>The courts of South Africa have exclusive jurisdiction</li>
              </ul>
            </div>

            {/* Section 13 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                13. Changes to Terms
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the website after changes constitutes acceptance of the modified Terms.
              </p>
            </div>

            {/* Section 14 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                14. Severability
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-12 p-6 bg-[var(--bb-champagne)] rounded-lg border border-[var(--bb-mahogany)]/20">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Contact Us
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                For questions about these Terms or to report issues, please contact:
              </p>
              <div className="space-y-2 text-base text-[var(--bb-payne-gray)]">
                <p><strong>Better Being (Pty) Ltd</strong></p>
                <p>Email: <a href="mailto:info@betterbeing.co.za" className="text-[var(--bb-mahogany)] hover:underline">info@betterbeing.co.za</a></p>
                <p>Address: 171 Blaauwberg Rd, Table View, Cape Town 7441, South Africa</p>
                <p className="mt-4 text-sm">
                  <strong>Consumer Protection Resources:</strong><br />
                  National Consumer Commission: 0860 003 600<br />
                  Consumer Goods and Services Ombud: 0860 000 272
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
