
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bb-champagne)] to-[var(--bb-champagne)]/90">
      {/* Hero Section - Dramatic Brand Colors */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-[var(--bb-black-bean)] via-[var(--bb-payne-gray)] to-[var(--bb-mahogany)]/90 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--bb-citron)] rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--bb-champagne)] rounded-full blur-2xl transform translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex items-center min-h-[70vh]">
          <div className="max-w-4xl space-y-12">
            <p className="text-[var(--bb-citron)] text-sm font-medium uppercase tracking-[0.2em] opacity-90">Get In Touch</p>
            <h1 className="text-6xl md:text-7xl font-light leading-[0.95]" style={{ fontFamily: 'Prata, Georgia, serif' }}>
              Connect With<br />
              <span className="text-[var(--bb-citron)]">Better Being</span>
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-[var(--bb-citron)] to-transparent"></div>
            <p className="text-xl leading-relaxed text-[var(--bb-champagne)] max-w-2xl font-light">
              Have questions about our products? Need personalized wellness guidance? 
              We're here to support your journey to better being.
            </p>
          </div>
        </div>
        
        {/* Header needs padding for absolute positioning */}
        <div className="h-20"></div>
      </section>

      {/* Contact Form Section - Citron Background */}
      <section className="py-32 bg-[var(--bb-citron)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            {/* Contact Information */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-4xl font-light text-[var(--bb-black-bean)] leading-tight" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                  Let's Start a <em className="text-[var(--bb-mahogany)]">Conversation</em>
                </h2>
                <p className="text-lg text-[var(--bb-black-bean)] opacity-80 leading-relaxed font-light">
                  Whether you're new to wellness or a seasoned practitioner, we believe in meeting you exactly where you are in your journey.
                </p>
              </div>
              
              <div className="space-y-8">
                {[
                  {
                    title: "Product Consultation",
                    description: "Get personalized recommendations based on your wellness goals and lifestyle.",
                    icon: "🌱"
                  },
                  {
                    title: "Ingredient Questions", 
                    description: "Deep dive into sourcing, potency, and the science behind our formulations.",
                    icon: "🔬"
                  },
                  {
                    title: "Wellness Guidance",
                    description: "Connect with our practitioners for holistic wellness support and guidance.",
                    icon: "✨"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-6 p-6 bg-[var(--bb-black-bean)] text-white rounded-none hover:bg-[var(--bb-mahogany)] transition-all duration-300 group">
                    <div className="w-12 h-12 bg-[var(--bb-citron)] rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[var(--bb-black-bean)] transition-all duration-300">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-light group-hover:text-[var(--bb-citron)] transition-colors" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                        {item.title}
                      </h3>
                      <p className="text-[var(--bb-champagne)] leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[var(--bb-champagne)] p-12 border border-[var(--bb-mahogany)]/10">
              <div className="space-y-6 mb-8">
                <h3 className="text-2xl font-light text-[var(--bb-black-bean)]" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                  Send us a message
                </h3>
                <div className="w-16 h-px bg-[var(--bb-mahogany)]"></div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none"
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">How can we help?</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none"
                  >
                    <option value="Product recommendations">Product recommendations</option>
                    <option value="Ingredient questions">Ingredient questions</option>
                    <option value="Wellness consultation">Wellness consultation</option>
                    <option value="Partnership inquiry">Partnership inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--bb-black-bean)] uppercase tracking-wider">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-[var(--bb-payne-gray)]/20 focus:border-[var(--bb-mahogany)] bg-white text-[var(--bb-black-bean)] transition-colors duration-300 outline-none resize-none"
                    placeholder="Tell us about your wellness journey and how we can support you..."
                  />
                </div>
                
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-[var(--bb-mahogany)] hover:bg-[var(--bb-black-bean)] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 hover:transform hover:scale-105"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Location & Hours Section - Mahogany Background */}
      <section className="py-32 bg-gradient-to-r from-[var(--bb-mahogany)] to-[var(--bb-black-bean)] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--bb-citron)] rounded-full blur-2xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--bb-champagne)] rounded-full blur-3xl transform -translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-12">
            <h3 className="text-4xl font-light text-white leading-tight" style={{ fontFamily: 'Prata, Georgia, serif' }}>
              Visit Our <em className="text-[var(--bb-citron)]">Wellness Studio</em>
            </h3>
            <div className="grid md:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-light text-[var(--bb-citron)]" style={{ fontFamily: 'Prata, Georgia, serif' }}>Location</h4>
                  <p className="text-white/80 leading-relaxed">
                    123 Wellness Way<br />
                    Natural District<br />
                    Cape Town, 8001<br />
                    South Africa
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-light text-[var(--bb-citron)]" style={{ fontFamily: 'Prata, Georgia, serif' }}>Studio Hours</h4>
                  <p className="text-white/80 leading-relaxed">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed<br />
                    <span className="text-[var(--bb-champagne)] text-sm">Consultations by appointment</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-8">
              <a href="mailto:hello@betterbeing.co.za" className="bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-10 py-4 font-medium uppercase tracking-wider transition-all duration-300 hover:transform hover:scale-105">
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
