'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Heart } from "lucide-react";
// Using standard img tags for assets
// Using placeholder image for products showcase
import { getFeaturedProducts } from "@/data/products";
import type { Product } from "@/types/product";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const ProductsSection = () => {
  const router = useRouter();
  const featuredProducts = getFeaturedProducts();

  return (
    <section id="products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-[#C1581B]/10 rounded-full px-5 py-1.5 mb-4">
            <div className="w-6 h-6 rounded-full border border-[#C1581B] flex items-center justify-center">
              <span className="text-[#C1581B] font-bold text-xs">BB</span>
            </div>
            <span className="text-xs font-medium text-[#C1581B]">Better Being Products</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Natural Wellness
            <span className="block text-[#C1581B] text-2xl md:text-3xl">Better Being Solutions</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Each product is meticulously formulated using the finest natural ingredients,
            backed by cutting-edge research and trusted by thousands worldwide.
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative mb-16 animate-scale-in">
          <div className="relative overflow-hidden rounded-3xl shadow-floating">
            <img 
              src="/all_prouct_shots-1.webp" 
              alt="Premium wellness products showcase"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            <div className="absolute bottom-8 left-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-2">Better Being Quality Guaranteed</h3>
              <p className="text-primary-foreground/90">Lab-tested • Third-party verified • Sustainably sourced</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.slice(0, 8).map((product: Product, index: number) => {
            const priceNum = parseFloat(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
            const originalPriceNum = parseFloat(String(product.originalPrice || "0").replace(/[^0-9.-]+/g, "")) || 0;
            const savePercent = originalPriceNum > 0 ? Math.round((1 - priceNum / originalPriceNum) * 100) : 0;

            return (
              <Card
                key={product.id}
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
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 pointer-events-none" />
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
                        className="flex-1 bg-[var(--bb-black-bean)] hover:bg-[var(--bb-black-bean)]/90 text-white"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 border-[var(--bb-mahogany)] text-[var(--bb-mahogany)] hover:bg-[var(--bb-mahogany)]/10"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="ghost" className="border border-[var(--bb-black-bean)] text-[var(--bb-black-bean)] hover:bg-[var(--bb-black-bean)] hover:text-white text-base px-6 py-3">
              View All Better Being Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
