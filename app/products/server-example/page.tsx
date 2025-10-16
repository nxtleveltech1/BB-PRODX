import { Suspense } from "react"
import { getCachedProducts } from "@/lib/cache"
import { logError } from "@/lib/error-logger"

// Set revalidation time for this page (1 hour)
export const revalidate = 3600

// Loading component
const ProductsLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
      ))}
    </div>
  )

// Product card component
const ProductCard = ({ product }: { product: any }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-honey-500">
            ${product.price}
          </span>
          {product.stock !== undefined && (
            <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          )}
        </div>
        {product.category && (
          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {product.category}
          </span>
        )}
      </div>
    </div>
  )

// Products list component (async)
const ProductsList = async () => {
  try {
    const { products } = await getCachedProducts()

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  } catch (error) {
    logError(error, {
      endpoint: "/products/server-example",
      severity: "error",
    })

    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load products</p>
      </div>
    )
  }
}

export default function ProductsServerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products (Server Component)</h1>
      <p className="text-gray-600 mb-6">
        This is an example of a server component using RSC caching with automatic revalidation.
      </p>

      <Suspense fallback={<ProductsLoading />}>
        <ProductsList />
      </Suspense>
    </div>
  )
}