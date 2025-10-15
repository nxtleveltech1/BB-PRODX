"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface WLItem {
  id: number;
  product_id: number;
  name: string;
  image: string;
  price: string | number;
}

const LS_KEY = "betterBeing_wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState<WLItem[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (next: WLItem[]) => {
    setItems(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  const remove = (product_id: number) => {
    save(items.filter(i => i.product_id !== product_id));
  };

  const moveToCart = (it: WLItem) => {
    addItem({
      id: Date.now(),
      product_id: it.product_id,
      quantity: 1,
      product_name: it.name,
      product_description: "",
      product_image: it.image || "/placeholder.svg",
      product_price: typeof it.price === 'string' ? it.price.replace(/^R/, '') : String(it.price),
      product_in_stock: true,
      product_stock_count: 1,
    });
    remove(it.product_id);
  };

  return (
    <div className="min-h-screen bg-[var(--bb-champagne)]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--bb-black-bean)]/10 border border-[var(--bb-black-bean)]/20 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-7 h-7 text-[var(--bb-black-bean)]" />
          </div>
          <h1 className="text-3xl font-light text-[var(--bb-black-bean)]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Wishlist
          </h1>
          <p className="text-[var(--bb-payne-gray)] mt-2">Save items you love and move them to your cart anytime.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white/70 border border-[var(--bb-mahogany)]/20 rounded-xl p-10 text-center">
            <p className="text-[var(--bb-payne-gray)] mb-6">You haven't added any items to your wishlist yet.</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--bb-mahogany)] text-white hover:bg-[var(--bb-mahogany)]/90">
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((it) => (
              <div key={it.product_id} className="bg-white rounded-xl overflow-hidden border border-[var(--bb-mahogany)]/20 flex flex-col">
                <div className="aspect-square bg-[var(--bb-champagne)]">
                  <img src={it.image} alt={it.name} className="w-full h-full object-contain p-4" />
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold text-[var(--bb-black-bean)] line-clamp-2" style={{ fontFamily: 'League Spartan, sans-serif' }}>{it.name}</h3>
                  <div className="mt-1 text-[var(--bb-mahogany)] font-semibold">{typeof it.price === 'string' ? it.price : `R${it.price}`}</div>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                    <button onClick={() => remove(it.product_id)} className="px-3 py-2 text-xs border border-[var(--bb-black-bean)]/20 rounded hover:bg-[var(--bb-champagne)]/50">Remove</button>
                    <button onClick={() => moveToCart(it)} className="px-3 py-2 text-xs bg-[var(--bb-black-bean)] text-white rounded hover:bg-[var(--bb-mahogany)]">Move to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
