"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: "Products & Ingredients",
      question: "Are Better Being products natural and safe?",
      answer: "Yes, all Better Being products are formulated with natural ingredients and manufactured to the highest quality standards. We combine evidence-based natural ingredients with scientific research to create effective wellness solutions. However, as with any supplement, we recommend consulting a healthcare professional before use, especially if you are pregnant, nursing, taking medications, or have existing medical conditions."
    },
    {
      category: "Products & Ingredients",
      question: "How do I choose the right product for my needs?",
      answer: "Each product page includes detailed information about the benefits, ingredients, and recommended uses. You can browse by category (Pain Relief, Digestive Health, Skin Care, etc.) or search for specific concerns. If you're unsure which product is right for you, you can use our Store Locator to find a stockist near you for personalized advice, or contact our customer support team for guidance."
    },
    {
      category: "Orders & Shipping",
      question: "How long does delivery take?",
      answer: "Standard delivery within South Africa typically takes 3-7 business days from order confirmation. Delivery times may vary based on your location and courier availability. You will receive a tracking number via email once your order has been dispatched so you can monitor its progress."
    },
    {
      category: "Orders & Shipping",
      question: "What payment methods do you accept?",
      answer: "We accept multiple secure payment methods including: Credit and debit cards (Visa, Mastercard), Electronic Funds Transfer (EFT), Instant EFT, and PayFast. All payments are processed securely through encrypted third-party payment processors, and we do not store your complete credit card details."
    },
    {
      category: "Orders & Shipping",
      question: "Do you offer free shipping?",
      answer: "Shipping costs are calculated at checkout based on your delivery location and order weight. We occasionally offer free shipping promotions for orders above a certain amount. Sign up for our newsletter to stay informed about special offers and promotions."
    },
    {
      category: "Returns & Refunds",
      question: "What is your return and refund policy?",
      answer: "In accordance with the Consumer Protection Act, you have the right to cancel your order within 7 business days of receipt without providing a reason. Products must be returned unopened, unused, and in original packaging. If you receive a defective or damaged product, please contact us within 48 hours of delivery, and we will arrange collection and provide a full refund or replacement at no additional cost. Approved refunds are processed within 14 business days using your original payment method."
    },
    {
      category: "Returns & Refunds",
      question: "Can I exchange a product if I'm not satisfied?",
      answer: "Yes, within the 7-day cooling-off period, you can return products for a refund or exchange, provided they are unopened and in original packaging. For defective or damaged products, we offer replacements at no cost. Please note that you are responsible for return shipping costs unless the product is defective. Contact our customer service team to initiate a return or exchange."
    },
    {
      category: "Usage & Safety",
      question: "How should I take/use Better Being supplements?",
      answer: "Each product has specific usage instructions on the label and product page. Generally, supplements should be taken as directed, with food or water as recommended. Do not exceed the recommended dosage unless advised by a healthcare professional. For topical products like our pain relief creams and skin care range, apply to clean skin as directed. Always read the label carefully before use."
    },
    {
      category: "Usage & Safety",
      question: "Are there any side effects or interactions I should be aware of?",
      answer: "Better Being products are formulated with natural ingredients and are generally well-tolerated. However, individual responses may vary. Some people may experience mild digestive changes when starting probiotics, or skin sensitivity with topical products. If you are taking prescription medications, pregnant, nursing, or have existing health conditions, consult your healthcare provider before using any supplements. Discontinue use and seek medical attention if you experience adverse reactions."
    },
    {
      category: "Stockists & Retail",
      question: "Where can I buy Better Being products in-store?",
      answer: "Better Being products are available at select retail stores across South Africa. Use our Store Locator feature to find the nearest stockist in your area. If you're a retail store interested in stocking our products, visit our Portal Access page to apply. We work with wellness stores, pharmacies, and health shops that share our commitment to quality natural products."
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white/80">
            Find answers to common questions about our products and services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <p className="text-lg leading-relaxed text-[var(--bb-black-bean)]">
              Have questions about Better Being products, shipping, or our policies? We've compiled answers to the most common questions below. If you don't find what you're looking for, feel free to <a href="/contact" className="text-[var(--bb-mahogany)] hover:underline font-medium">contact us</a>.
            </p>
          </div>

          {/* FAQ Accordion by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-10">
              <h2
                className="text-2xl font-semibold text-[var(--bb-black-bean)] mb-6 pb-3 border-b-2 border-[var(--bb-mahogany)]/30"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                {category}
              </h2>

              <div className="space-y-4">
                {faqs
                  .filter(faq => faq.category === category)
                  .map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={globalIndex}
                        className="bg-white/60 backdrop-blur-sm rounded-lg border border-[var(--bb-mahogany)]/10 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)]/50 rounded-lg"
                          aria-expanded={isOpen}
                        >
                          <span className="text-lg font-medium text-[var(--bb-black-bean)] pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-6 h-6 text-[var(--bb-mahogany)] flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-6 pb-5 pt-2">
                            <p className="text-base leading-relaxed text-[var(--bb-payne-gray)]">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Still Have Questions CTA */}
          <div className="mt-16 bg-gradient-to-r from-[var(--bb-mahogany)]/10 to-[var(--bb-citron)]/10 rounded-2xl p-8 md:p-12 text-center border border-[var(--bb-mahogany)]/20">
            <h2
              className="text-3xl font-light text-[var(--bb-black-bean)] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Still Have Questions?
            </h2>
            <p className="text-lg text-[var(--bb-payne-gray)] mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our customer support team is here to help you with any inquiries about our products, orders, or wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[var(--bb-mahogany)] hover:bg-[var(--bb-black-bean)] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
              <a
                href="/store-locator"
                className="inline-flex items-center justify-center gap-2 bg-[var(--bb-citron)] hover:bg-[var(--bb-black-bean)] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Find a Store
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <a
              href="/privacy"
              className="bg-white/40 rounded-lg p-6 border border-[var(--bb-mahogany)]/10 hover:border-[var(--bb-mahogany)]/30 transition-all group"
            >
              <h3 className="text-lg font-semibold text-[var(--bb-black-bean)] mb-2 group-hover:text-[var(--bb-mahogany)] transition-colors">
                Privacy Policy
              </h3>
              <p className="text-sm text-[var(--bb-payne-gray)]">
                Learn how we protect your personal information
              </p>
            </a>

            <a
              href="/terms"
              className="bg-white/40 rounded-lg p-6 border border-[var(--bb-mahogany)]/10 hover:border-[var(--bb-mahogany)]/30 transition-all group"
            >
              <h3 className="text-lg font-semibold text-[var(--bb-black-bean)] mb-2 group-hover:text-[var(--bb-mahogany)] transition-colors">
                Terms of Service
              </h3>
              <p className="text-sm text-[var(--bb-payne-gray)]">
                Review our terms and conditions
              </p>
            </a>

            <a
              href="/products"
              className="bg-white/40 rounded-lg p-6 border border-[var(--bb-mahogany)]/10 hover:border-[var(--bb-mahogany)]/30 transition-all group"
            >
              <h3 className="text-lg font-semibold text-[var(--bb-black-bean)] mb-2 group-hover:text-[var(--bb-mahogany)] transition-colors">
                Browse Products
              </h3>
              <p className="text-sm text-[var(--bb-payne-gray)]">
                Explore our wellness collection
              </p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
