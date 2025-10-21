import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/db/queries/products";
import { ProductCard } from "@/components/ProductCard";

export const ProductsSection = async () => {
  const featuredProducts = await getFeaturedProducts();

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
          {featuredProducts.slice(0, 8).map((product: Product, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
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
