'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const router = useRouter();

  const priceNum = parseFloat(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
  const originalPriceNum = parseFloat(String(product.originalPrice || "0").replace(/[^0-9.-]+/g, "")) || 0;
  const savePercent = originalPriceNum > 0 ? Math.round((1 - priceNum / originalPriceNum) * 100) : 0;

  return (
    <Card
      className="relative group transition-all duration-300 hover:shadow-lg bg-transparent overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bb-mahogany)] focus-visible:ring-offset-2"
      style={{ animationDelay: `${index * 120}ms`, fontFamily: 'League Spartan, sans-serif' }}
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/products/${product.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(`/products/${product.id}`);
        }
      }}
    >
      {product.popular && (
        <div className="absolute top-3 left-3 bg-[#C1581B] text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          Best Seller
        </div>
      )}

      <CardContent className="p-0">
        {/* Product Image Container */}
        <div className="relative w-full aspect-square bg-[var(--bb-champagne)] flex items-center justify-center">
          {(() => {
            const name = (product.name || '').toLowerCase()
            const isFacialPot = ['skin therapy', 'aloe', 'day', 'night', 'eye']
              .some(k => name.includes(k))
            const scaleClass = isFacialPot ? 'scale-75' : ''
            return (
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-contain p-4 transition-transform ${scaleClass}`}
              />
            )
          })()}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[var(--bb-black-bean)] mb-2 leading-snug group-hover:text-[var(--bb-mahogany)]" style={{ fontFamily: 'League Spartan, sans-serif' }}>{product.name}</h3>
          <p className="text-sm text-[var(--bb-payne-gray)] mb-4 line-clamp-2">{product.description}</p>

          {/* Benefits */}
          <div className="space-y-1.5 mb-4">
            {(product.benefits || []).map((benefit, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs">
                <div className="w-1.5 h-1.5 bg-[#C1581B] rounded-full" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-[#C1581B]">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} className="w-4 h-4 fill-current" />
               ))}
             </div>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviews?.toLocaleString?.() || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-xl font-semibold text-[var(--bb-mahogany)]">{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-[var(--bb-payne-gray)] line-through">{product.originalPrice}</span>
            )}
            {originalPriceNum > 0 && (
              <span className="bg-[var(--bb-mahogany)]/10 text-[var(--bb-mahogany)] px-2 py-0.5 rounded text-xs font-medium">Save {savePercent}%</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-[var(--bb-black-bean)] text-[var(--bb-black-bean)] hover:bg-[var(--bb-black-bean)] hover:text-white"
              onClick={(event) => { event.stopPropagation(); router.push(`/products/${product.id}`) }}
            >
              Read More
            </Button>
            <Button
              className="flex-1 bg-[var(--bb-black-bean)] hover:bg-[var(--bb-black-bean)]/90 text-white"
              onClick={(event) => event.stopPropagation()}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
