import { ProductsSection } from '@/components/ProductsSection';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <main>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Shop All Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of premium natural supplements, 
              superfoods, and wellness products.
            </p>
          </div>
          
          <ProductsSection />
        </div>
      </main>
    </div>
  );
}
