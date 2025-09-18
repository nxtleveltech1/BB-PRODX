import { ProductsSection } from '@/components/ProductsSection';

export default function ShopPage() {
  return (
<div className="min-h-screen bg-[#F9E7C9] relative">
      {/* Shop Header Background */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="w-full h-[40vh] bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/Untitled design (3).png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="w-full h-[40vh] bg-gradient-to-b from-black/40 via-black/10 to-transparent absolute top-0 left-0" />
      </div>
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
