export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
                Better Being ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our products.
              </p>
              <p className="text-lg leading-relaxed text-[var(--bb-black-bean)]">
                This policy complies with the Protection of Personal Information Act (POPIA) of South Africa and the European Union's General Data Protection Regulation (GDPR).
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                1. Information We Collect
              </h2>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Personal Information</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)] mb-4">
                <li>Name and contact details (email address, phone number, physical address)</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Order history and purchase preferences</li>
                <li>Account credentials (username and password)</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-[var(--bb-black-bean)] mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                2. How We Use Your Information
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li><strong>Order Processing:</strong> To process and fulfill your orders, including shipping and customer service</li>
                <li><strong>Communication:</strong> To send order confirmations, shipping updates, and respond to inquiries</li>
                <li><strong>Marketing:</strong> To send promotional emails and newsletters (with your consent)</li>
                <li><strong>Improvement:</strong> To improve our website, products, and customer experience</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent transactions</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                3. Legal Basis for Processing (GDPR/POPIA)
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We process your personal information based on the following legal grounds:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li><strong>Consent:</strong> You have given explicit consent for specific processing activities</li>
                <li><strong>Contract Performance:</strong> Processing is necessary to fulfill our contract with you (order processing)</li>
                <li><strong>Legal Obligation:</strong> We must process your data to comply with the law</li>
                <li><strong>Legitimate Interests:</strong> Processing is in our legitimate business interests (fraud prevention, service improvement)</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li><strong>Service Providers:</strong> Third-party vendors who assist with payment processing, shipping, email delivery, and analytics</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific disclosures</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                5. Your Rights
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                Under POPIA and GDPR, you have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to processing of your information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications at any time</li>
                <li><strong>Complaint:</strong> Lodge a complaint with the Information Regulator (South Africa) or your local data protection authority</li>
              </ul>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mt-4">
                To exercise any of these rights, please contact us at <a href="mailto:privacy@betterbeing.co.za" className="text-[var(--bb-mahogany)] hover:underline">privacy@betterbeing.co.za</a>
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                6. Data Security
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                We implement appropriate technical and organizational measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                7. Data Retention
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Order information is retained for 7 years to comply with South African tax and accounting requirements.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                8. Cookies and Tracking Technologies
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                We use cookies and similar technologies to enhance your browsing experience. You can control cookie settings through your browser preferences. Types of cookies we use:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--bb-payne-gray)]">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                9. Third-Party Links
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                10. Children's Privacy
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                11. Changes to This Policy
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-12 p-6 bg-[var(--bb-champagne)] rounded-lg border border-[var(--bb-mahogany)]/20">
              <h2 className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-4" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Contact Us
              </h2>
              <p className="text-base leading-relaxed text-[var(--bb-payne-gray)] mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-base text-[var(--bb-payne-gray)]">
                <p><strong>Better Being</strong></p>
                <p>Email: <a href="mailto:privacy@betterbeing.co.za" className="text-[var(--bb-mahogany)] hover:underline">privacy@betterbeing.co.za</a></p>
                <p>Address: 171 Blaauwberg Rd, Table View, Cape Town 7441, South Africa</p>
                <p className="mt-4 text-sm">
                  <strong>Information Regulator (South Africa):</strong><br />
                  JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001<br />
                  Email: inforeg@justice.gov.za
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
