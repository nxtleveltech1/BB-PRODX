"use client";
import React from "react";
import { getFeaturedProducts } from "@/data/products";

// A minimal Aesop-like featured row used on homepage and products page
// Uses simple Tailwind classes already present in the project brand system
export default function FeaturedRowAesop({ title = "New and notable", subtitle = "Explore a collection of long‑standing formulations and recent additions to the range." }: { title?: string; subtitle?: string }) {
  const featured = getFeaturedProducts().slice(0, 3);

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
          {featured.map((p, idx) => (
            <article key={p.id} className="group">
              {/* Image */}
              <div className="relative aspect-[4/5] bg-[var(--neutral-50)] border border-[var(--neutral-300)]/70 flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="object-contain w-full h-full p-6 transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[var(--neutral-200)]" />
                )}
              </div>

              {/* Meta above title (small label like "Beloved formulation" / "New addition") */}
              <div className="text-[var(--bb-mahogany)] text-sm font-medium mt-3">{idx === 1 ? 'New addition' : 'Beloved formulation'}</div>

              {/* Title */}
              <h3 className="mt-4 text-lg md:text-xl text-[var(--neutral-800)] font-medium">{p.name}</h3>
              {/* Description */}
              <p className="mt-2 text-[var(--neutral-600)] text-sm">{p.description}</p>


              {/* Price + Add to cart */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[var(--neutral-800)] text-lg font-medium">{p.price}</div>
                <button className="bg-[var(--neutral-800)] text-white px-6 py-3 text-sm tracking-wide hover:bg-black transition-colors">Add to cart</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
