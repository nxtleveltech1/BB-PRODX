"use client";

import React from "react";
import Link from "next/link";
import { products as allProducts } from "@/data/products";
import type { Product } from "@/types/product";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

function byTopSix(input: Product[]): Product[] {
  // Priority: popular first, then featured, then by reviews desc
  const withImage = input.filter(p => !!p.image);
  return withImage
    .sort((a, b) => {
      const aScore = (a.popular ? 2 : 0) + (a.featured ? 1 : 0) + (a.reviews || 0) / 1000;
      const bScore = (b.popular ? 2 : 0) + (b.featured ? 1 : 0) + (b.reviews || 0) / 1000;
      return bScore - aScore;
    })
    .slice(0, 6);
}

export default function TopSixFlip({ showBorders = true }: { showBorders?: boolean } = {}) {
  const topSix = React.useMemo(() => byTopSix(allProducts as unknown as Product[]), []);
  const { addItem } = useCart();

  const [api, setApi] = React.useState<any>(null);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      if (!paused) api.scrollNext();
    }, 4500);
    return () => clearInterval(id);
  }, [api, paused]);

  const onAddToCart = (product: Product) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addItem({
        id: Date.now(),
        product_id: product.id,
        quantity: 1,
        product_name: product.name,
        product_description: product.description,
        product_image: product.image || "/placeholder.svg",
        product_price: String((product.price || "").toString().replace(/^R/, "")),
        product_original_price: product.originalPrice ? String(product.originalPrice).replace(/^R/, "") : undefined,
        product_in_stock: product.inStock !== false,
        product_stock_count: product.stockCount || 1,
        category_name: product.categoryId || undefined,
      });
    } catch (_err) {
      // no-op: provider shows toast
    }
  };

  return (
    <section
      className={`bg-[var(--bb-champagne)] ${showBorders ? 'border-t border-b border-[var(--bb-mahogany)]/20' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Heading */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-wide text-[var(--neutral-800)]" style={{ fontFamily: 'League Spartan, sans-serif' }}>
              New and Notable
            </h2>
          </div>
        </div>

        {/* Flip-through carousel */}
        <div className="relative">
          <Carousel setApi={setApi} opts={{ loop: true, align: "start" }}>
            <CarouselContent>
              {topSix.map((p) => (
                <CarouselItem key={p.id}>
                  <article className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left: Image */}
                    <div className="relative aspect-square bg-[var(--bb-champagne)] flex items-center justify-center">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="object-contain w-full h-full p-6"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-[var(--neutral-200)]" />
                      )}
                      {(p.popular || p.featured) && (
                        <div className="absolute top-4 left-4 text-xs uppercase tracking-wide bg-[var(--bb-mahogany)] text-white px-3 py-1">
                          {p.popular ? 'Best Seller' : 'Featured'}
                        </div>
                      )}
                    </div>

                    {/* Right: Details */}
                    <div className="px-1" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                      <Link href={`/products/${p.id}`} className="block">
                        <h3 className="text-2xl md:text-3xl font-semibold uppercase tracking-wide text-[var(--bb-black-bean)] leading-tight">
                          {p.name}
                        </h3>
                      </Link>

                      <p className="mt-3 text-[var(--bb-payne-gray)] text-base leading-relaxed">
                        {p.description}
                      </p>

                      {/* Benefits */}
                      {!!p.benefits?.length && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {p.benefits.slice(0, 4).map((b, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-[var(--bb-mahogany)]/10 text-[var(--bb-mahogany)]">
                              {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Rating */}
                      <div className="mt-5 flex items-center gap-2 text-[var(--bb-mahogany)]">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-[var(--bb-payne-gray)]">
                          {p.rating} ({(p.reviews ?? 0).toLocaleString?.() || p.reviews || 0} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mt-6 flex items-center gap-3">
                        <span className="text-2xl font-semibold text-[var(--bb-mahogany)]">{p.price}</span>
                        {!!p.originalPrice && (
                          <span className="text-sm text-[var(--bb-payne-gray)] line-through">{p.originalPrice}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={onAddToCart(p)}
                          className="bg-[var(--bb-hero-surround)] text-white px-6 py-3 text-sm tracking-wide uppercase hover:bg-[var(--bb-hero-surround)]/90 transition-colors"
                        >
                          Add to Cart
                        </button>
                        <Link
                          href={`/products/${p.id}`}
                          className="border border-[var(--bb-mahogany)] text-[var(--bb-mahogany)] px-6 py-3 text-sm tracking-wide uppercase hover:bg-[var(--bb-mahogany)]/10 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 hover:bg-white" />
            <CarouselNext className="bg-white/90 hover:bg-white" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
