import { cache } from "react"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import db from "@/lib/db"
import { eq, desc, gte } from "drizzle-orm"
import { products, users, orders } from "@/lib/db/schema"
import { logError } from "@/lib/error-logger"

// Cache time constants (in seconds)
export const CACHE_TIMES = {
  PRODUCTS: 3600, // 1 hour
  USER_PROFILE: 600, // 10 minutes
  CATEGORIES: 7200, // 2 hours
  STATS: 300, // 5 minutes
  SHORT: 60, // 1 minute
} as const

// Cache tags for invalidation
export const CACHE_TAGS = {
  PRODUCTS: "products",
  PRODUCT_DETAIL: (id: string) => `product-${id}`,
  USER: (id: string) => `user-${id}`,
  ORDERS: "orders",
  ORDER_DETAIL: (id: string) => `order-${id}`,
  CATEGORIES: "categories",
  STATS: "stats",
  CART: (userId: string) => `cart-${userId}`,
} as const

// Pattern 1: Function-level caching with React cache
export const getCachedUser = cache(async (userId: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(userId, 10)),
    })
    return user
  } catch (error) {
    logError(error, {
      endpoint: "getCachedUser",
      userId,
    })
    return null
  }
})

// Pattern 2: Next.js unstable_cache for persistent caching
export const getCachedProducts = unstable_cache(
  async (options?: {
    limit?: number
    offset?: number
    category?: string
  }) => {
    try {
      const { limit = 10, offset = 0, category } = options || {}

      const allProducts = await db.query.products.findMany({
        limit,
        offset,
        orderBy: [desc(products.createdAt)],
      })

      return {
        products: allProducts,
        total: allProducts.length,
      }
    } catch (error) {
      logError(error, {
        endpoint: "getCachedProducts",
      })
      return {
        products: [],
        total: 0,
      }
    }
  },
  ["products"],
  {
    revalidate: CACHE_TIMES.PRODUCTS,
    tags: [CACHE_TAGS.PRODUCTS],
  }
)

// Pattern 3: Cached product detail with tag-based invalidation
export const getCachedProductById = (productId: string) => unstable_cache(
  async () => {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, parseInt(productId, 10)),
      })
      return product
    } catch (error) {
      logError(error, {
        endpoint: "getCachedProductById",
        extra: { productId },
      })
      return null
    }
  },
  [`product-detail-${productId}`],
  {
    revalidate: CACHE_TIMES.PRODUCTS,
    tags: [CACHE_TAGS.PRODUCT_DETAIL(productId), CACHE_TAGS.PRODUCTS],
  }
)()

// Pattern 4: User orders with user-specific caching
export const getCachedUserOrders = (userId: string) => unstable_cache(
  async () => {
    try {
      const userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, parseInt(userId, 10)),
        orderBy: [desc(orders.createdAt)],
      })
      return userOrders
    } catch (error) {
      logError(error, {
        endpoint: "getCachedUserOrders",
        userId,
      })
      return []
    }
  },
  [`user-orders-${userId}`],
  {
    revalidate: CACHE_TIMES.SHORT,
    tags: [CACHE_TAGS.USER(userId), CACHE_TAGS.ORDERS],
  }
)()

// Pattern 5: Dashboard stats with short cache
export const getCachedStats = unstable_cache(
  async () => {
    try {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const [totalProducts, totalUsers, recentOrders] = await Promise.all([
        db.query.products.findMany().then(p => p.length),
        db.query.users.findMany().then(u => u.length),
        db.query.orders.findMany({
          where: gte(orders.createdAt, thirtyDaysAgo),
        }).then(o => o.length),
      ])

      return {
        totalProducts,
        totalUsers,
        recentOrders,
        lastUpdated: now.toISOString(),
      }
    } catch (error) {
      logError(error, {
        endpoint: "getCachedStats",
      })
      return {
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: 0,
        lastUpdated: new Date().toISOString(),
      }
    }
  },
  ["dashboard-stats"],
  {
    revalidate: CACHE_TIMES.STATS,
    tags: [CACHE_TAGS.STATS],
  }
)

// Cache invalidation functions
export const revalidateProductCache = () => {
  revalidateTag(CACHE_TAGS.PRODUCTS)
}

export const revalidateProductById = (productId: string) => {
  revalidateTag(CACHE_TAGS.PRODUCT_DETAIL(productId))
  revalidateTag(CACHE_TAGS.PRODUCTS)
}

export const revalidateUserCache = (userId: string) => {
  revalidateTag(CACHE_TAGS.USER(userId))
}

export const revalidateOrderCache = (orderId?: string) => {
  revalidateTag(CACHE_TAGS.ORDERS)
  if (orderId) {
    revalidateTag(CACHE_TAGS.ORDER_DETAIL(orderId))
  }
}

export const revalidateStatsCache = () => {
  revalidateTag(CACHE_TAGS.STATS)
}

// Path-based revalidation helpers
export const revalidateProductPage = (productId: string) => {
  revalidatePath(`/products/${productId}`)
  revalidatePath("/products")
}

export const revalidateUserDashboard = (userId: string) => {
  revalidatePath("/dashboard")
  revalidatePath("/profile")
}

export const revalidateHomePage = () => {
  revalidatePath("/")
}

// Batch revalidation for major updates
export const revalidateAll = () => {
  revalidatePath("/", "layout")
}

// Helper to create cached functions with error handling
export const createCachedFunction = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyParts: string[],
  options?: {
    revalidate?: number
    tags?: string[]
  }
) => unstable_cache(
    async (...args: TArgs) => {
      try {
        return await fn(...args)
      } catch (error) {
        logError(error, {
          endpoint: keyParts.join("-"),
        })
        throw error
      }
    },
    keyParts,
    options
  )

// Prefetch helpers for server components
export const prefetchProducts = async () => {
  await getCachedProducts()
}

export const prefetchStats = async () => {
  await getCachedStats()
}

// Cache warming function (useful for deployment)
export const warmCache = async () => {
  try {
    await Promise.all([
      prefetchProducts(),
      prefetchStats(),
    ])
    console.log("Cache warmed successfully")
  } catch (error) {
    logError(error, {
      endpoint: "warmCache",
      severity: "warning",
    })
  }
}