"use client";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import Script from "next/script";

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://instagram.com/betterbeing";
const FACEBOOK_URL = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://facebook.com/betterbeing";
const LINKEDIN_URL = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com/company/betterbeing";

export default function Footer() {
  return (
    <footer className="relative">
      {/* Main Footer with Purple Abstract Background - Exactly as shown */}
      <div className="relative bg-[#F9E7C9]">
        {/* Background Pattern Image */}
        <div 
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url('/Purple\\ Abstract\\ Lintree\\ Background\\ (1366\\ x\\ 768\\ px)\\ (5).png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
              {/* Left Section - Navigation Links with Even Spacing */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 w-full">
                {/* Products Store */}
                <div className="min-w-0">
                  <h4 className="text-[#7a7771] text-sm font-semibold mb-4 uppercase tracking-wider">Products Store</h4>
                  <ul className="space-y-2">
                    <li><a href="/products" className="text-[#7a7771] text-sm hover:text-[#b5a642] transition-colors">All Products</a></li>
                  </ul>
                </div>
                
                {/* Company Links */}
                <div className="min-w-0">
                  <h4 className="text-[#7a7771] text-sm font-semibold mb-4 uppercase tracking-wider">Company Links</h4>
                  <ul className="space-y-2">
                    <li><a href="/about" className="text-[#7a7771] text-sm hover:text-[#b5a642] transition-colors">About Us</a></li>
                  </ul>
                </div>
                
                {/* Support */}
                <div className="min-w-0">
                  <h4 className="text-[#7a7771] text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
                  <ul className="space-y-2">
                    <li><a href="/faq" className="text-[#7a7771] text-sm hover:text-[#b5a642] transition-colors">FAQ</a></li>
                  </ul>
                </div>
                
                {/* Contact Us */}
                <div className="min-w-0">
                  <h4 className="text-[#7a7771] text-sm font-semibold mb-4 uppercase tracking-wider">Contact Us</h4>
                  <ul className="space-y-2">
                    <li><a href="/contact" className="text-[#7a7771] text-sm hover:text-[#b5a642] transition-colors">Get In Touch</a></li>
                  </ul>
                </div>
              </div>
              
              {/* Right Section - Newsletter */}
              <div className="w-full lg:w-auto lg:ml-16 mt-8 lg:mt-0">
                <h4 className="text-[#7a7771] text-sm font-semibold mb-4 uppercase tracking-wider">Stay Connected</h4>
                <p className="text-[#7a7771] text-sm mb-4">Subscribe for wellness tips and exclusive offers</p>
                <NewsletterForm />
                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#7a7771] hover:text-[#b5a642] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                    </svg>
                  </a>
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-[#7a7771] hover:text-[#b5a642] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-[#7a7771] hover:text-[#b5a642] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Copyright Bar */}
          <div className="border-t border-[#e0ddd6]/50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-[#9e9b96]">
                <p>© {new Date().getFullYear()} Better Being. All rights reserved.</p>
                <div className="flex flex-wrap gap-3">
                  <a href="/privacy" className="hover:text-[#7a7771] transition-colors">Privacy Policy</a>
                  <span>•</span>
                  <a href="/terms" className="hover:text-[#7a7771] transition-colors">Terms of Service</a>
                  <span>•</span>
                  <a href="/accessibility" className="hover:text-[#7a7771] transition-colors">Accessibility</a>
                  <span>•</span>
                  <a href="/sitemap" className="hover:text-[#7a7771] transition-colors">Sitemap</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [hp, setHp] = useState(""); // honeypot
  const mountedAt = useRef<number>(Date.now());
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      let hcaptchaToken = "";
      if (siteKey) {
        const el = (document.querySelector('textarea[name="h-captcha-response"], input[name="h-captcha-response"]') as HTMLTextAreaElement | HTMLInputElement | null);
        hcaptchaToken = el?.value || "";
        if (!hcaptchaToken) {
          toast.error("Please complete the captcha.");
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, hcaptchaToken, ts: mountedAt.current, hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Thanks! You've been subscribed.");
        setEmail("");
      } else if (res.status === 501) {
        toast.error("Subscription service not configured on the server.");
      } else {
        toast.error(data?.message || "Subscription failed.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {siteKey && (
        <Script src="https://hcaptcha.com/1/api.js" strategy="lazyOnload" />
      )}
      <form onSubmit={onSubmit} className="flex w-full max-w-sm">
        {/* Honeypot field: keep hidden from users */}
        <label className="sr-only" htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />
        <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 bg-white/60 border border-[#e0ddd6] text-[#7a7771] placeholder-[#b8b5ae] focus:outline-none focus:border-[#b5a642] transition-colors text-sm flex-1"
        aria-label="Email address"
        required
      />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#b5a642] hover:bg-[#a39638] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 text-sm font-medium transition-colors"
        >
          {loading ? "Subscribing…" : "Subscribe"}
        </button>
        {/* hCaptcha widget (optional) */}
        {siteKey && (
          <div className="mt-3">
            <div className="h-captcha" data-sitekey={siteKey}></div>
          </div>
        )}
      </form>
    </>
  );
}
