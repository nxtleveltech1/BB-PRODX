"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, ShoppingCart, User, Menu, X, Search, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/useAuth";

export default function Header() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { user, isLoading: isUserLoading, logout } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const showUserState = isClient && !isUserLoading;

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-colors duration-200 ${
        scrolled ? 'bg-black/85 backdrop-blur-sm shadow-[0_6px_16px_rgba(0,0,0,0.25)]' : 'bg-gradient-to-b from-black/90 via-black/70 to-transparent'
      }`}
      data-scrolled={scrolled}
    >
      <div className="header-grid-container">
        <div className="header-logo-zone">
          <Link href="/" className="logo-container group" aria-label="Better Being - Home">
            <img
              src="/Untitled%20design%20(1).png"
              alt="Better Being Logo"
              className="header-logo"
              loading="eager"
            />
          </Link>
        </div>

        <div className="header-nav-zone">
          <nav className="desktop-nav" role="navigation" aria-label="Main navigation">
            <Link href="/products" className="nav-link uppercase tracking-[0.32em]">
              Shop
            </Link>
            <Link href="/about" className="nav-link uppercase tracking-[0.32em]">
              About
            </Link>
            <Link href="/contact" className="nav-link uppercase tracking-[0.32em]">
              Contact Us
            </Link>
            <Link href="/portal-access" className="nav-link uppercase tracking-[0.32em]">
              Stock Better Being
            </Link>
          </nav>

          <div className="header-actions">
            <Link href="/search" className="header-icon-button" aria-label="Search">
              <Search className="w-4 h-4" />
            </Link>
            <Link href="/wishlist" className="header-icon-button" aria-label="Wishlist">
              <Heart className="w-4 h-4" />
            </Link>

            <Link href="/cart" className="cart-link group" aria-label={`Shopping cart ${cartCount > 0 ? `with ${cartCount} items` : "empty"}`}>
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Sign in/account moved to the end */}
            <div className="account-dropdown-container">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="account-button group uppercase tracking-[0.32em]"
                aria-expanded={showAccountMenu}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <User className="w-4 h-4" />
                <span className="account-text">
                  {showUserState && user ? user.name || user.email?.split("@")[0] || "Sign In" : "Sign In"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAccountMenu ? "rotate-180" : ""}`} />
              </button>

              {showAccountMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)} aria-hidden="true" />
                  <div className="account-dropdown" role="menu">
                    {!showUserState || !user ? (
                      <>
                        <Link href="/auth/login" className="dropdown-item" role="menuitem" onClick={() => setShowAccountMenu(false)}>
                          Sign In
                        </Link>
                        <Link href="/auth/register" className="dropdown-item" role="menuitem" onClick={() => setShowAccountMenu(false)}>
                          Register
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/account" className="dropdown-item" role="menuitem" onClick={() => setShowAccountMenu(false)}>
                          Account Dashboard
                        </Link>
                        <Link href="/account/history" className="dropdown-item" role="menuitem" onClick={() => setShowAccountMenu(false)}>
                          Orders
                        </Link>
                        <button
                          onClick={async () => {
                            await logout().catch(() => {});
                            setShowAccountMenu(false);
                          }}
                          className="dropdown-item w-full text-left"
                          role="menuitem"
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              className="mobile-menu-button lg:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-expanded={showMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <>
          <div className="mobile-overlay" onClick={closeMobileMenu} aria-hidden="true" />
          <div className="mobile-menu" role="navigation" aria-label="Mobile navigation">
            <div className="mobile-menu-content">
              <nav className="mobile-nav">
                <Link href="/products" className="mobile-nav-link" onClick={closeMobileMenu}>
                  Shop
                </Link>
                <Link href="/about" className="mobile-nav-link" onClick={closeMobileMenu}>
                  About
                </Link>
                <Link href="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>
                  Contact Us
                </Link>
                <Link href="/portal-access" className="mobile-nav-link mobile-nav-highlight" onClick={closeMobileMenu}>
                  Stock Better Being
                </Link>
              </nav>

              <div className="mobile-actions">
                <Link href="/cart" className="mobile-action-link" onClick={closeMobileMenu}>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                </Link>

                {!showUserState || !user ? (
                  <>
                    <Link href="/auth/login" className="mobile-action-link" onClick={closeMobileMenu}>
                      <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link href="/auth/register" className="mobile-action-link" onClick={closeMobileMenu}>
                      <User className="w-5 h-5" />
                      <span>Register</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/account" className="mobile-action-link" onClick={closeMobileMenu}>
                      <User className="w-5 h-5" />
                      <span>Account</span>
                    </Link>
                    <button
                      onClick={async () => {
                        await logout().catch(() => {});
                        closeMobileMenu();
                      }}
                      className="mobile-action-link w-full text-left"
                    >
                      <User className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
