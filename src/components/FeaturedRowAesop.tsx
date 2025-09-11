"use client";
import React from "react";
import { getFeaturedProducts, products as allProducts } from "@/data/products";

// A minimal Aesop-like featured row used on homepage and products page
// Ensures three items are shown; backfills if the third is missing.
export default function FeaturedRowAesop({
  title = "New and notable",
  subtitle = "Explore a collection of long‑standing formulations and recent additions to the range.",
}: {
  title?: string;
  subtitle?: string;
}) {
  // Prefer featured items that have images, then backfill from catalog
  const preferred = getFeaturedProducts().filter((p) => !!p.image);
  const take = preferred.slice(0, 3);
  if (take.length < 3) {
    const chosen = new Set(take.map((p) => p.id));
    for (const p of allProducts) {
      if (take.length >= 3) break;
      if (!p.image) continue;
      if (chosen.has(p.id)) continue;
      take.push(p);
      chosen.add(p.id);
    }
  }

  return (
    <section className="bg-[var(--neutral-100)] border-t border-b border-[var(--neutral-300)]/60">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-[var(--neutral-800)]" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
          <p className="mt-4 text-[var(--neutral-600)] max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {/* Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {take.map((p, idx) => (
            <article key={p.id} className="group flex flex-col h-full" style={{ fontFamily: 'League Spartan, sans-serif' }}>
              {/* Image: use champagne background to match site */}
              <div className="relative aspect-[4/5] bg-[var(--bb-champagne)] flex items-center justify-center">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="object-contain w-full h-full p-6 transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[var(--neutral-200)]" />
                )}
              </div>

              {/* Meta label */}
              <div className="text-[var(--bb-mahogany)] text-sm font-medium mt-3">{idx === 1 ? 'New addition' : 'Beloved formulation'}</div>

              {/* Title */}
              <h3 className="mt-4 text-lg md:text-xl text-[var(--neutral-800)] font-medium text-center" style={{ fontFamily: 'League Spartan, sans-serif' }}>{p.name}</h3>
              {/* Description */}
              <p className="mt-2 text-[var(--neutral-600)] text-sm text-center" style={{ fontFamily: 'League Spartan, sans-serif' }}>{p.description}</p>

              {/* Price + Add to cart centered */}
              <div className="mt-4 flex flex-col items-center gap-3 mt-auto">
                <div className="text-[var(--neutral-800)] text-lg font-medium" style={{ fontFamily: 'League Spartan, sans-serif' }}>{p.price}</div>
                <button className="w-full bg-[var(--bb-black-bean)] text-white px-6 py-3 text-sm tracking-wide hover:bg-[var(--bb-black-bean)]/90 transition-colors" style={{ fontFamily: 'League Spartan, sans-serif' }}>Add to cart</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
