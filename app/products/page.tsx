"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiOptimized";
import { products } from "@/data/products";
import FeaturedRowAesop from "@/components/FeaturedRowAesop";
import { useCart } from "../../contexts/CartContext";

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const hasDiscount = product.originalPrice && product.originalPrice !== product.price;
  const price = typeof product.price === 'string' ? product.price : `R${product.price}`;
  const originalPrice = typeof product.originalPrice === 'string' ? product.originalPrice : `R${product.originalPrice}`;
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        product_price: typeof product.price === 'string' ? product.price.replace(/^R/, '') : String(product.price),
        product_original_price: typeof product.originalPrice === 'string' ? product.originalPrice.replace(/^R/, '') : (product.originalPrice ? String(product.originalPrice) : undefined),
        product_in_stock: product.inStock !== false,
        product_stock_count: product.stockCount || 1,
        category_name: product.categoryId || undefined,
      });
    } catch (_err) {
      // no-op: provider shows toast
    }
  };
  
  return (
    <div className="group flex flex-col h-full transition-all duration-300 hover:shadow-lg" style={{ fontFamily: 'League Spartan, sans-serif' }}>
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] bg-[var(--bb-champagne)] overflow-hidden mb-4">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--bb-mahogany)]/20 to-[var(--bb-citron)]/20 flex items-center justify-center">
                <span className="text-3xl">🌿</span>
              </div>
            </div>
          )}
          {/* Stock Status Badge */}
          {!product.inStock && (
            <div className="absolute top-4 left-4">
              <span className="bg-[var(--bb-black-bean)] text-white px-3 py-1 text-xs uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 items-center text-center gap-3 px-2" style={{ fontFamily: 'League Spartan, sans-serif' }}>
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-[var(--bb-black-bean)] group-hover:text-[var(--bb-mahogany)] transition-colors duration-300 leading-tight" style={{ fontFamily: 'League Spartan, sans-serif' }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-[var(--bb-payne-gray)] leading-relaxed line-clamp-2 max-w-[26ch]">
          {product.description}
        </p>
        <div className="pt-2 border-t border-[var(--bb-mahogany)]/10 w-full">
          <div className="flex items-center justify-center gap-3">
            <span className="text-lg font-semibold text-[var(--bb-mahogany)]">{price}</span>
            {hasDiscount && (
              <span className="text-sm text-[var(--bb-payne-gray)] line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
        {/* Add to cart pinned at bottom */}
        <div className="mt-auto w-full">
          <button onClick={handleAddToCart} className="w-full bg-[var(--bb-black-bean)] text-white py-3 text-sm tracking-wide hover:bg-[var(--bb-black-bean)]/90 transition-colors" style={{ fontFamily: 'League Spartan, sans-serif' }}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { limit: 24 }],
    queryFn: () => api.getProducts({ limit: 24 }) as Promise<{ products: any[] }>,
  });

  // Use local data as fallback if API fails
  const displayProducts = data?.products || products.slice(0, 12);

  // Mobile-specific view - using CSS classes instead of JS width check
  return (
    <>
      {/* Mobile View */}
      <div className="min-h-screen bg-white block md:hidden">
        {/* Mobile Header with Menu */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button className="p-2">
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div className="w-full h-0.5 bg-[var(--bb-mahogany)]"></div>
                <div className="w-full h-0.5 bg-[var(--bb-mahogany)]"></div>
                <div className="w-full h-0.5 bg-[var(--bb-mahogany)]"></div>
              </div>
            </button>
            <div className="text-2xl font-light text-[var(--bb-mahogany)]" style={{ fontFamily: 'Prata, Georgia, serif' }}>
              Better Being
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[var(--bb-mahogany)] flex items-center justify-center">
            <span className="text-[var(--bb-mahogany)] font-bold text-sm">BB</span>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-white px-4 py-2 flex gap-2 overflow-x-auto">
          <button className="bg-[var(--bb-black-bean)] text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            SALE!
          </button>
          <button className="bg-[var(--bb-mahogany)] text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            UNDER R250
          </button>
          <button className="bg-[var(--bb-black-bean)] text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            TOP SELLERS
          </button>
          <button className="bg-[var(--bb-mahogany)] text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            SEE ALL
          </button>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-[var(--bb-citron)] text-center py-2 text-black font-bold text-sm">
          FREE DELIVERY FOR ORDERS OVER R800
        </div>

        {/* Featured Products Carousel */}
        <div className="p-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              src="/assets_task_01k3pzrsb6fjmt46d7c18qp9zt_1756339480_img_0.webp" 
              alt="Featured wellness products" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets_task_01jyyj4jt3e9atxgmk5jjt6s6n_1751224862_img_0.webp';
              }}
            />
            <button className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded text-sm">
              More {">"}
            </button>
          </div>
        </div>

        {/* This Week's Highlight */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">This Week's Highlight!</h2>
            <button className="text-sm text-[var(--bb-mahogany)]">See All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto">
            {displayProducts.slice(0, 3).map((product: any, index: number) => {
              const localImages = [
                '/assets_task_01jyyj4jt3e9atxgmk5jjt6s6n_1751224862_img_0.webp',
                '/assets_task_01k41a33mcfmnbrtp0g4gzy59e_1756685796_img_0.webp',
                '/assets_task_01k3rk2604ex79awdqzxk2z4ff_1756393225_img_1.webp'
              ];
              return (
                <div key={product.id} className="flex-shrink-0 w-32" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                  <div className="relative bg-[var(--bb-champagne)] overflow-hidden mb-2">
                    <img 
                      src={product.image || localImages[index]}
                      alt={product.name}
                      className="w-full h-24 object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = localImages[index];
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs font-medium mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm font-bold">R{typeof product.price === 'string' ? product.price.replace('R', '') : product.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Locator */}
        <div className="px-4 mb-4">
          <h3 className="text-base font-medium mb-4">Go look for us at an outlet near you</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">🏪</span>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">takeaLot</span>
            </div>
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">Faithful to Nature</span>
            </div>
            <button className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📍 find your local</span>
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--bb-mahogany)] text-white flex">
          <button className="flex-1 py-4 text-center">
            <div className="text-lg mb-1">🏠</div>
            <div className="text-xs">HOME</div>
          </button>
          <button className="flex-1 py-4 text-center">
            <div className="text-lg mb-1">🛒</div>
            <div className="text-xs">CART</div>
          </button>
          <button className="flex-1 py-4 text-center">
            <div className="text-lg mb-1">🔍</div>
            <div className="text-xs">SEARCH</div>
          </button>
          <button className="flex-1 py-4 text-center">
            <div className="text-lg mb-1">📚</div>
            <div className="text-xs">CATEGORY</div>
          </button>
          <button className="flex-1 py-4 text-center">
            <div className="text-lg mb-1">❓</div>
            <div className="text-xs">HELP</div>
          </button>
        </div>

        {/* Bottom padding for fixed navigation */}
        <div className="h-24"></div>
      </div>

      {/* Desktop View */}
      <div className="min-h-screen hidden md:block">
        {/* Hero Section - Dramatic Brand Colors */}
        <section className="relative min-h-[70vh] bg-gradient-to-br from-[var(--bb-black-bean)] via-[var(--bb-mahogany)]/90 to-[var(--bb-mahogany)] text-white overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--bb-citron)] rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--bb-champagne)] rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex items-center min-h-[60vh]">
            <div className="max-w-4xl space-y-10">
              <p className="text-[var(--bb-citron)] text-sm font-medium uppercase tracking-[0.2em] opacity-90">
                Collection
              </p>
              <h1 className="text-6xl md:text-7xl font-light leading-[0.95]" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                Wellness<br />
                <span className="text-[var(--bb-citron)]">Essentials</span>
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-[var(--bb-citron)] to-transparent"></div>
              <p className="text-xl leading-relaxed text-[var(--bb-champagne)] max-w-2xl font-light">
                Curated wellness products that work. Made with care, driven by integrity. 
                Supporting your journey to better being, naturally.
              </p>
            </div>
          </div>
          
          {/* Header needs padding for absolute positioning */}
          <div className="h-20"></div>
        </section>

        {/* Main Content */}
        <div className="bg-[var(--bb-champagne)]">
          <div className="max-w-7xl mx-auto px-6 py-20">
            {/* Filter Bar - Brand Colors */}
            <div className="flex items-center justify-between mb-16 pb-8 border-b border-[var(--bb-mahogany)]/20">
              <div className="flex items-center gap-6">
                <span className="text-2xl font-light text-[var(--bb-black-bean)]" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                  {displayProducts.length} Products
                </span>
                {isLoading && (
                  <div className="flex items-center gap-3 text-[var(--bb-payne-gray)]">
                    <div className="animate-spin w-4 h-4 border border-[var(--bb-mahogany)] border-t-transparent rounded-full"></div>
                    <span className="text-sm">Loading...</span>
                  </div>
                )}
                {isError && (
                  <div className="text-[var(--bb-payne-gray)] text-sm">
                    Showing curated collection
                  </div>
                )}
              </div>
              
              <div className="hidden md:flex items-center gap-10">
                <button className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--bb-black-bean)] border-b-2 border-[var(--bb-mahogany)] pb-2">
                  All Products
                </button>
                <button className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Adaptogens
                </button>
                <button className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Minerals
                </button>
                <button className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors">
                  Superfoods
                </button>
              </div>
            </div>

            {/* Featured Aesop-style row inside products page */}
            <div className="mb-12 -mx-6">
              <FeaturedRowAesop title="New and notable" subtitle="Explore a collection of long-standing formulations and recent additions to the range." />
            </div>
            
            {/* Products Grid - Rich Brand Layout */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Consultation CTA - Dramatic Background */}
        <section className="py-24 bg-gradient-to-r from-[var(--bb-mahogany)] to-[var(--bb-black-bean)] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--bb-citron)] rounded-full blur-2xl transform -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--bb-champagne)] rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="space-y-10">
              <h3 className="text-4xl font-light text-white leading-tight" style={{ fontFamily: 'Prata, Georgia, serif' }}>
                Need <em className="text-[var(--bb-citron)]">Guidance?</em>
              </h3>
              <p className="text-xl leading-relaxed text-white/80 max-w-2xl mx-auto font-light">
                Our wellness experts are here to help you find the perfect products for your unique journey.
              </p>
              <div className="pt-6">
                <a href="/contact" className="bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-10 py-4 font-medium uppercase tracking-wider transition-all duration-300 hover:transform hover:scale-105">
                  Book Consultation
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}






