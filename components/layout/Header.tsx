"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from '@/lib/useAuth';

export default function Header() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Auth and Cart hooks (must not be conditional)
  const { user, isLoading: isUserLoading, logout } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Don't render user state until client-side hydration is complete
  const showUserState = isClient && !isUserLoading;

  // Close mobile menu when clicking outside or on links
  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      {/* Content-Aware Grid Container */}
      <div className="header-grid-container">
        {/* Logo Section - Positioned to hang 20% over the left side of "TRANSFORM" text */}
        <div className="header-logo-zone">
          <Link 
            href="/" 
            className="logo-container group"
            aria-label="Better Being - Home"
          >
            <img
              src="/better-being-logo.png"
              alt="Better Being"
              className="header-logo"
              loading="eager"
            />
            {/* Subtle logo glow effect */}
            <div className="logo-glow" aria-hidden="true"></div>
          </Link>
        </div>
        
        {/* Navigation Zone - Positioned to hang 20% over the right side of featured products */}
        <div className="header-nav-zone">
          {/* Desktop Navigation */}
          <nav className="desktop-nav" role="navigation" aria-label="Main navigation">
            <Link href="/products" className="nav-link">
              Products
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
            <Link href="/portal-access" className="nav-link nav-link-highlight">
              Agent Application
            </Link>
          </nav>

          {/* Action Items Container */}
          <div className="header-actions">
            {/* Cart Icon with Count */}
            <Link 
              href="/cart" 
              className="cart-link group"
              aria-label={`Shopping cart ${cartCount > 0 ? `with ${cartCount} items` : 'empty'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="cart-badge" aria-hidden="true">
                  {cartCount}
                </span>
              )}
              <div className="action-glow" aria-hidden="true"></div>
            </Link>
            
            {/* My Account Button with Dropdown */}
            <div className="account-dropdown-container">
              <button 
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="account-button group"
                aria-expanded={showAccountMenu}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <User className="w-4 h-4" />
                <span className="account-text">
                  {showUserState && user ? user.displayName || user.primaryEmail?.split('@')[0] || 'Account' : 'My Account'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAccountMenu ? 'rotate-180' : ''}`} />
                <div className="account-button-glow" aria-hidden="true"></div>
              </button>

              {/* Dropdown Menu */}
              {showAccountMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowAccountMenu(false)}
                    aria-hidden="true"
                  ></div>
                  <div className="account-dropdown" role="menu">
                    {!showUserState || !user ? (
                      <>
                        <Link 
                          href="/auth/login" 
                          className="dropdown-item"
                          role="menuitem"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Sign In
                        </Link>
                        <Link 
                          href="/auth/register"
                          className="dropdown-item"
                          role="menuitem"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Register
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link 
                          href="/account" 
                          className="dropdown-item"
                          role="menuitem"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Account Dashboard
                        </Link>
                        <Link 
                          href="/account/order" 
                          className="dropdown-item"
                          role="menuitem"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Orders
                        </Link>
                        <Link 
                          href="/account/history" 
                          className="dropdown-item"
                          role="menuitem"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Order History
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
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-expanded={showMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
            <div className="mobile-button-glow" aria-hidden="true"></div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {showMobileMenu && (
        <>
          <div 
            className="mobile-overlay" 
            onClick={closeMobileMenu}
            aria-hidden="true"
          ></div>
          <div className="mobile-menu" role="navigation" aria-label="Mobile navigation">
            <div className="mobile-menu-content">
              <nav className="mobile-nav">
                <Link href="/products" className="mobile-nav-link" onClick={closeMobileMenu}>
                  Products
                </Link>
                <Link href="/about" className="mobile-nav-link" onClick={closeMobileMenu}>
                  About
                </Link>
                <Link href="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>
                  Contact
                </Link>
                <Link href="/portal-access" className="mobile-nav-link mobile-nav-highlight" onClick={closeMobileMenu}>
                  Agent Application
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
