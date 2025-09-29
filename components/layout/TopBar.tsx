"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "../../contexts/CartContext";

// Elegant, brand-aligned Top Bar for Better Being
// - Luxury neutrals with champagne/gold accents
// - Centered primary nav, actions on the right
// - Accessible, responsive, and lightweight

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
  { href: "/portal-access", label: "Stock Better Being" },
];

export default function TopBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { user, isLoading: isUserLoading, logout } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = useMemo(() => getCartCount?.() ?? 0, [getCartCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close menus on route change
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (pathname === href) || (href !== "/" && pathname?.startsWith(href));

  // Force a solid header background on utility pages where there's no hero
  const forceSolid = useMemo(() => {
    const solidRoutes = [
      "/cart",
      "/checkout",
      "/products",
      "/account",
      "/wishlist",
      "/auth",
      "/portal-access",
      "/outlets",
    ];
    return solidRoutes.some((p) => pathname?.startsWith(p));
  }, [pathname]);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all",
        (scrolled || forceSolid)
          ? "bg-[#280B0B]/70 supports-[backdrop-filter]:backdrop-blur-md border-b border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
          : "bg-transparent border-transparent shadow-none"
      ].join(" ")}
      role="banner"
    >
      {/* Subtle neutral hairline (disabled for transparent header) */}
      <div className="hidden" />

      {/* Background disabled for transparent header */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden" aria-hidden="true">
        {/* Left stretch (stretched edge fill, no blur tint) */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: '26vw',
            backgroundImage: 'url("/hdback.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'left center',
            transform: 'scaleX(1.35)',
            transformOrigin: 'left center',
            opacity: 1,
            WebkitMaskImage: 'linear-gradient(to right, black, transparent)',
            maskImage: 'linear-gradient(to right, black, transparent)',
          }}
        />
        {/* Right stretch (stretched edge fill, no blur tint) */}
        <div
          className="absolute top-0 right-0 h-full"
          style={{
            width: '26vw',
            backgroundImage: 'url("/hdback.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'right center',
            transform: 'scaleX(1.35)',
            transformOrigin: 'right center',
            opacity: 1,
            WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
            maskImage: 'linear-gradient(to left, black, transparent)',
          }}
        />
        {/* Center image, no stretch, centered */}
        <div
          className="absolute inset-0"
          style={{
backgroundImage: 'url("/hdback.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'auto',
            backgroundPosition: 'center center'
          }}
        />
        {/* Gloss highlight (colorless, liquid glass) */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: '100%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0.07) 42%, rgba(255,255,255,0) 68%)' }}
        />
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: '52%', background: 'radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.18), rgba(255,255,255,0.08) 48%, rgba(255,255,255,0) 70%)' }}
        />
        {/* Subtle diagonal sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 48%, rgba(255,255,255,0.06) 55%, transparent 62%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="group inline-flex items-center bg-transparent"
            aria-label="Better Being - Home"
          >
<img src="/headerlogo.png" alt="Better Being" className="h-12 sm:h-14 w-auto object-contain bg-transparent" />
          </Link>

          {/* Primary Nav - centered on desktop */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative px-3 py-2 text-[12.5px] font-medium tracking-[0.2em] uppercase rounded-lg transition-colors hover:text-[#F0EAD9]"
                style={{ color: isActive(href) ? "var(--bb-citron)" : "#EFE7DB" }}
              >
                {label}
                <span
                  className="absolute left-2 right-2 -bottom-0.5 h-px rounded-full transition-all"
                  style={{
                    background: isActive(href) ? "currentColor" : "transparent",
                    opacity: isActive(href) ? 0.6 : 1,
                  }}
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              className="h-12 w-12 grid place-items-center rounded-full text-[#EFE7DB] hover:text-[var(--bb-citron)] hover:bg-[var(--neutral-200)]/30 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/wishlist"
              className="h-10 w-10 grid place-items-center rounded-full text-[#EFE7DB] hover:text-[var(--bb-citron)] hover:bg-[var(--neutral-200)]/30 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Account */}
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="h-12 px-4 inline-flex items-center gap-2 rounded-full text-[#EFE7DB] hover:text-[var(--bb-citron)] hover:bg-[var(--neutral-200)]/30 transition-colors"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-label="Account menu"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-[15px]">
                  {!isUserLoading && user ? user.firstName || "Account" : "Sign In"}
                </span>
                <ChevronDown className="w-5 h-5 hidden sm:inline opacity-70" />
              </button>

              {accountOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 mt-2 w-56 z-50 rounded-xl border bg-[var(--neutral-50)]/95 shadow-xl supports-[backdrop-filter]:backdrop-blur-xl border-[var(--neutral-200)]">
                    <div className="p-2">
                      {!isUserLoading && user ? (
                        <>
                          <div className="px-3 py-2 text-sm border-b border-[var(--neutral-200)] mb-2">
                            <p className="font-medium text-[#2C2B29]">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-[#8B8078] truncate">{user.email}</p>
                          </div>
                          <Link href="/account" className="block px-3 py-2 text-sm rounded-md hover:bg-[var(--neutral-100)]/80 text-[#4A453F]" onClick={() => setAccountOpen(false)}>
                            Account Dashboard
                          </Link>
                          <Link href="/account/orders" className="block px-3 py-2 text-sm rounded-md hover:bg-[var(--neutral-100)]/80 text-[#4A453F]" onClick={() => setAccountOpen(false)}>
                            Orders
                          </Link>
                          <button
                            onClick={async () => {
                              await logout().catch(() => {});
                              setAccountOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--neutral-100)]/80 text-[#8B4513]"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/auth/login" className="block px-3 py-2 text-sm rounded-md hover:bg-[var(--neutral-100)]/80 text-[#4A453F]" onClick={() => setAccountOpen(false)}>
                            Sign In
                          </Link>
                          <Link href="/auth/register" className="block px-3 py-2 text-sm rounded-md hover:bg-[var(--neutral-100)]/80 text-[#4A453F]" onClick={() => setAccountOpen(false)}>
                            Register
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative h-12 px-4 inline-flex items-center gap-2 rounded-full text-[#EFE7DB] hover:text-[var(--bb-citron)] hover:bg-[var(--neutral-200)]/30 transition-colors"
              aria-label={`Cart${cartCount > 0 ? ` with ${cartCount} items` : ''}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-6 min-w-6 px-1 rounded-full text-[12px] leading-6 text-white text-center"
                  style={{ background: "linear-gradient(135deg, var(--bb-mahogany), #5d2b0c)" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden h-12 w-12 grid place-items-center rounded-full text-[#6B635A] hover:text-[var(--bb-mahogany)] hover:bg-[var(--neutral-200)]/40 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-0 h-full w-[86%] sm:w-96 bg-[var(--neutral-50)] shadow-2xl supports-[backdrop-filter]:backdrop-blur-xl border-l border-[var(--neutral-200)] animate-[slideIn_.25s_ease]">
            <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--neutral-200)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg grid place-items-center"
                     style={{ background: "linear-gradient(135deg, var(--bb-mahogany), #6f3610)" }}>
                  <span className="text-white text-xs font-black">BB</span>
                </div>
                <span className="text-sm font-semibold tracking-[0.14em] text-[#2C2B29]">BETTER BEING</span>
              </div>
              <button
                className="h-10 w-10 grid place-items-center rounded-full text-[#6B635A] hover:text-[var(--bb-mahogany)] hover:bg-[var(--neutral-200)]/40 transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-1" aria-label="Mobile">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 rounded-lg text-[15px] font-medium text-[#2C2B29] hover:bg-[var(--neutral-100)]/80"
                >
                  {label}
                </Link>
              ))}

              <div className="pt-2 mt-2 border-t border-[var(--neutral-200)]">
                <Link href="/search" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-[15px] font-medium text-[#2C2B29] hover:bg-[var(--neutral-100)]/80">
                  Search
                </Link>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-[15px] font-medium text-[#2C2B29] hover:bg-[var(--neutral-100)]/80">
                  Wishlist
                </Link>
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-[15px] font-medium text-[#2C2B29] hover:bg-[var(--neutral-100)]/80">
                  Cart {cartCount > 0 ? `(${cartCount})` : ""}
                </Link>
              </div>

              <div className="pt-2 mt-2 border-t border-[var(--neutral-200)]">
                {!isUserLoading && user ? (
                  <>
                    <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-[15px] font-medium text-[#2C2B29] hover:bg-[var(--neutral-100)]/80">
                      My Account
                    </Link>
                    <button
                      onClick={async () => {
                        await logout().catch(() => {});
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 rounded-lg text-[15px] font-medium text-[#8B4513] hover:bg-[var(--neutral-100)]/80"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-[15px] font-medium text-[#2C2B29] hover:bg-[var(--neutral-100)]/80">
                      Sign In
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-[15px] font-medium text-[#2C2B29] hover:bg-[var(--neutral-100)]/80">
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </nav>

            <div className="mt-auto p-4 text-[11px] text-[#8B8078]">
              <p>© {new Date().getFullYear()} Better Being</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0%); } }
      `}</style>
    </header>
  );
}
