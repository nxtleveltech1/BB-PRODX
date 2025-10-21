"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, X } from "lucide-react";

// Product type definition
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  in_stock?: boolean;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams?.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      return products;
    }

    const lowerQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery) ||
        product.category?.toLowerCase().includes(lowerQuery)
    );
  }, [query, products]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-[#F5F1EC] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Search Header */}
        <div className="mb-8">
          <h1
            className="text-4xl lg:text-5xl font-light text-[#2C2B29] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Search Products
          </h1>
          <p className="text-[#7A7771] mb-6">
            Find your perfect wellness products
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-6 py-4 pr-24 rounded-full border-2 border-[#E8E2DC] bg-white text-[#2C2B29] placeholder-[#B5AFA6] focus:outline-none focus:border-[#BB4500] transition-colors"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-[#7A7771] hover:text-[#BB4500] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#BB4500] text-white px-6 py-2 rounded-full hover:bg-[#A03D00] transition-colors flex items-center gap-2"
                aria-label="Search"
              >
                <SearchIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BB4500] border-r-transparent"></div>
              <p className="mt-4 text-[#7A7771]">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6 text-[#7A7771]">
                {query ? (
                  <p>
                    Found <strong className="text-[#2C2B29]">{filteredProducts.length}</strong>{" "}
                    {filteredProducts.length === 1 ? "result" : "results"} for "{query}"
                  </p>
                ) : (
                  <p>
                    Showing <strong className="text-[#2C2B29]">{filteredProducts.length}</strong>{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}
                  </p>
                )}
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-[#7A7771] mb-4">
                    {query ? `No products found for "${query}"` : "No products available"}
                  </p>
                  {query && (
                    <button
                      onClick={clearSearch}
                      className="btn btn-primary"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group bg-white rounded-2xl border border-[#E8E2DC] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-[#F5F1EC] overflow-hidden">
                        <img
                          src={product.image_url || "/placeholder-product.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!product.in_stock && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {product.category && (
                          <p className="text-xs uppercase tracking-wider text-[#BB4500] mb-2">
                            {product.category}
                          </p>
                        )}
                        <h3 className="font-semibold text-[#2C2B29] mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-[#7A7771] mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <p className="text-lg font-bold text-[#BB4500]">
                          R{product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
