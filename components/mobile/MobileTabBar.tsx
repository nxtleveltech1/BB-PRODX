"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Search, User, ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

/**
 * MobileTabBar
 * Fixed bottom navigation optimized for mobile with safe-area support.
 * - Highlights active route
 * - Uses brand colors
 * - Respects iOS/Android safe area (notches)
 */
export default function MobileTabBar() {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = typeof getCartCount === "function" ? getCartCount() : 0;

  const isActive = (href: string) => (pathname === href) || (href !== "/" && pathname?.startsWith(href));

  const baseItem =
    "flex flex-col items-center justify-center gap-1 text-[11px] font-medium tracking-wide px-3 py-1.5 rounded-lg transition-colors";

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[60] border-t border-[var(--neutral-200)]/80 bg-[var(--neutral-50)]/95 supports-[backdrop-filter]:backdrop-blur-xl"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom))" }}
      role="navigation"
      aria-label="Primary mobile"
    >
      <div className="max-w-7xl mx-auto">
        <ul className="grid grid-cols-5 items-center justify-between px-2 py-2">
          <li className="flex justify-center">
            <Link
              href="/"
              className={`${baseItem} ${isActive("/") ? "text-[var(--bb-mahogany)]" : "text-[#4A453F]"}`}
              aria-current={isActive("/") ? "page" : undefined}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="flex justify-center">
            <Link
              href="/products"
              className={`${baseItem} ${isActive("/products") ? "text-[var(--bb-mahogany)]" : "text-[#4A453F]"}`}
              aria-current={isActive("/products") ? "page" : undefined}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop</span>
            </Link>
          </li>
          <li className="flex justify-center">
            <Link
              href="/search"
              className={`${baseItem} ${isActive("/search") ? "text-[var(--bb-mahogany)]" : "text-[#4A453F]"}`}
              aria-current={isActive("/search") ? "page" : undefined}
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </Link>
          </li>
          <li className="flex justify-center">
            <Link
              href="/cart"
              className={`${baseItem} ${isActive("/cart") ? "text-[var(--bb-mahogany)]" : "text-[#4A453F]"} relative`}
              aria-current={isActive("/cart") ? "page" : undefined}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full text-[10px] leading-5 text-white text-center" style={{ background: "linear-gradient(135deg, var(--bb-mahogany), #5d2b0c)" }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li className="flex justify-center">
            <Link
              href="/account"
              className={`${baseItem} ${isActive("/account") ? "text-[var(--bb-mahogany)]" : "text-[#4A453F]"}`}
              aria-current={isActive("/account") ? "page" : undefined}
            >
              <User className="w-5 h-5" />
              <span>Account</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}