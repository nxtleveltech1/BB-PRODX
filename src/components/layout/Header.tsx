"use client";
import Link from "next/link";
import { ShoppingBag, Search, User, Heart, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bb-black-bean backdrop-blur-md border-b border-bb-black-bean">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group" aria-label="Better Being Home">
          <div className="w-9 h-9 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-heading font-bold tracking-brand text-white group-hover:text-white/80 transition-colors">
            BETTER BEING
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-white/80 absolute left-1/2 -translate-x-1/2">
          <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 text-white/80">
          <Link href="/search" className="w-9 h-9 flex items-center justify-center hover:text-white" aria-label="Search">
            <Search className="w-4 h-4" />
          </Link>
          <Link href="/account" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center" aria-label="Account">
            <User className="w-4 h-4" />
          </Link>
          <Link href="/wishlist" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center" aria-label="Wishlist">
            <Heart className="w-4 h-4" />
          </Link>
          <Link href="/cart" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center" aria-label="Cart">
            <ShoppingCart className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

