"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import Script from "next/script";

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://www.instagram.com/the.betterbeing/";
const FACEBOOK_URL = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://facebook.com/betterbeing";
const LINKEDIN_URL = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com/company/betterbeing";

export default function Footer() {
  return (
    <footer className="relative">
      <div className="relative bg-[#F9E7C9]">
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: "url('/Platform%20Graphics/Web%20Footer.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
          }}
        />

        <div className="absolute inset-0 bg-black/15" aria-hidden="true" />

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 w-full">
                <FooterColumn title="Products Store">
                  <FooterLink href="/products">All Products</FooterLink>
                </FooterColumn>

                <FooterColumn title="Company Links">
                  <FooterLink href="/about">About Us</FooterLink>
                </FooterColumn>

                <FooterColumn title="Support">
                  <FooterLink href="/faq">FAQ</FooterLink>
                </FooterColumn>

                <FooterColumn title="Contact Us">
                  <FooterLink href="/contact">Get In Touch</FooterLink>
                </FooterColumn>
              </div>

              <div className="w-full lg:w-auto lg:ml-16 mt-8 lg:mt-0">
                <h4
                  className="text-[#7a7771] text-base font-semibold mb-4 uppercase tracking-wider md:text-lg"
                  style={{ fontFamily: "League Spartan, sans-serif" }}
                >
                  Stay Connected
                </h4>
                <p
                  className="text-[#7a7771] text-base mb-4 md:text-lg"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Subscribe for wellness tips and exclusive offers
                </p>
                <NewsletterForm />

                <div className="flex gap-3 mt-4 text-[#7a7771]">
                  <FooterSocial href={INSTAGRAM_URL} label="Instagram">
                    <InstagramIcon />
                  </FooterSocial>
                  <FooterSocial href={FACEBOOK_URL} label="Facebook">
                    <FacebookIcon />
                  </FooterSocial>
                  <FooterSocial href={LINKEDIN_URL} label="LinkedIn">
                    <LinkedInIcon />
                  </FooterSocial>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[var(--bb-black-bean)]">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-[var(--bb-citron)] flex flex-col sm:flex-row items-center justify-between gap-3 uppercase tracking-wide">
          <span>&copy; {new Date().getFullYear()} BETTER BEING. ALL RIGHTS RESERVED.</span>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/terms" className="hover:text-white transition-colors">
              Term & Condition & Privacy Policy
            </a>
            <a href="/accessibility" className="hover:text-white transition-colors">
              ACCESSIBILITY
            </a>
            <a href="/sitemap" className="hover:text-white transition-colors">
              SITEMAP
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h4
        className="text-[#7a7771] text-base font-semibold mb-4 uppercase tracking-wider md:text-lg"
        style={{ fontFamily: "League Spartan, sans-serif" }}
      >
        {title}
      </h4>
      <ul className="space-y-2" style={{ fontFamily: "Playfair Display, serif" }}>
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-[#7a7771] text-base hover:text-[#b5a642] transition-colors md:text-lg"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        {children}
      </a>
    </li>
  );
}

function FooterSocial({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-[#b5a642] transition-colors">
      {children}
    </a>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [hp, setHp] = useState("");
  const mountedAt = useRef(() => Date.now());
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hp.trim()) {
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      let hcaptchaToken = "";
      if (siteKey) {
        const el = document.querySelector<HTMLTextAreaElement | HTMLInputElement>('textarea[name="h-captcha-response"], input[name="h-captcha-response"]');
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
        toast.error((data as { message?: string })?.message || "Subscription failed.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {siteKey && <Script src="https://hcaptcha.com/1/api.js" strategy="lazyOnload" />}
      <form onSubmit={onSubmit} className="flex w-full max-w-sm">
        <label className="sr-only" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          name="company"
          value={hp}
          onChange={(event) => setHp(event.target.value)}
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
          onChange={(event) => setEmail(event.target.value)}
          className="px-4 py-2 bg-white/70 border border-[#e0ddd6] text-[#7a7771] placeholder-[#b8b5ae] focus:outline-none focus:border-[#b5a642] transition-colors text-sm flex-1"
          aria-label="Email address"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#b5a642] hover:bg-[#a39638] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 text-sm font-medium transition-colors"
        >
          {loading ? "Subscribing…" : "SUBSCRIBE"}
        </button>
        {siteKey && (
          <div className="mt-3">
            <div className="h-captcha" data-sitekey={siteKey} />
          </div>
        )}
      </form>
    </>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.354-2.618-6.782-6.98-6.98-1.28-.059-1.688-.073-4.947-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.768 12 18.768s6.162-2.759 6.162-6.162S15.403 7.838 12 7.838zm0 10.162c-2.208 0-4-1.792-4-4s1.792-4 4-4 4 1.792 4 4-1.792 4-4 4zm6.406-11.845c0 .796-.646 1.441-1.441 1.441-.796 0-1.441-.646-1.441-1.441 0-.796.645-1.441 1.441-1.441.795 0 1.441.645 1.441 1.441z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.676 0H1.326C.594 0 0 .595 0 1.326v21.348C0 23.405.594 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.405 24 22.674V1.326C24 .595 23.406 0 22.676 0z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14C2.238 0 0 2.238 0 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.762-2.238-5-5-5zm-11.5 20H4v-11h3.5v11zM5.75 7.5c-1.104 0-2-.896-2-2s.896-2 2-2c1.105 0 2 .896 2 2s-.895 2-2 2zM20 20h-3.5v-5.5c0-1.379-.028-3.152-1.922-3.152-1.924 0-2.221 1.502-2.221 3.052V20h-3.5v-11H12v1.507h.049c.49-.927 1.69-1.903 3.479-1.903 3.722 0 4.407 2.451 4.407 5.637V20z" />
    </svg>
  );
}
