# Caching Strategy Guide

## Overview
This guide documents the caching patterns implemented in the BB-PRODX application using React Server Components (RSC) and Next.js caching mechanisms.

## Table of Contents
1. [Caching Patterns](#caching-patterns)
2. [When to Use Each Pattern](#when-to-use-each-pattern)
3. [Cache Invalidation](#cache-invalidation)
4. [Common Scenarios](#common-scenarios)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Caching Patterns

### 1. React `cache()` - Request Deduplication
```typescript
import { cache } from 'react'

export const getCachedUser = cache(async (userId: string) => {
  // This function is memoized per request
  return await db.query.users.findFirst({
    where: eq(users.id, userId)
  })
})
```

**When to use:**
- Multiple components need the same data in a single request
- Preventing duplicate database queries during SSR
- Data that doesn't need persistence between requests

**Characteristics:**
- Caches for the duration of a single request
- Automatically deduplicates function calls
- No manual invalidation needed
- Perfect for user-specific data

### 2. `unstable_cache()` - Persistent Caching
```typescript
import { unstable_cache } from 'next/cache'

export const getCachedProducts = unstable_cache(
  async (category?: string) => {
    return await db.query.products.findMany({
      where: category ? eq(products.category, category) : undefined
    })
  },
  ['products'], // Cache key parts
  {
    revalidate: 3600, // Revalidate after 1 hour
    tags: ['products'] // Tags for manual invalidation
  }
)
```

**When to use:**
- Data that changes infrequently
- Public data shared across users
- Heavy computations or expensive queries
- Need manual cache invalidation

**Characteristics:**
- Persists across requests
- Supports time-based revalidation
- Supports tag-based invalidation
- Cached at the Data Cache layer

### 3. Page-level `revalidate` - Static Regeneration
```typescript
// app/products/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsList products={products} />
}
```

**When to use:**
- Entire pages that can be statically generated
- Content that updates on a predictable schedule
- Marketing pages, product catalogs

**Characteristics:**
- Regenerates the entire page
- Works with ISR (Incremental Static Regeneration)
- Simple time-based invalidation
- Best for static content

### 4. `revalidateTag()` - Targeted Invalidation
```typescript
import { revalidateTag } from 'next/cache'

// In a Server Action or Route Handler
export async function updateProduct(id: string, data: ProductUpdate) {
  await db.update(products).set(data).where(eq(products.id, id))

  // Invalidate all caches tagged with 'products'
  revalidateTag('products')
  // Invalidate specific product cache
  revalidateTag(`product-${id}`)
}
```

**When to use:**
- After mutations (create, update, delete)
- Invalidating related data sets
- Fine-grained cache control

**Characteristics:**
- Immediate invalidation
- Can target multiple caches at once
- Works across the application
- More efficient than path revalidation

### 5. `revalidatePath()` - Route Invalidation
```typescript
import { revalidatePath } from 'next/cache'

export async function createProduct(data: ProductInput) {
  const product = await db.insert(products).values(data).returning()

  // Invalidate the products listing page
  revalidatePath('/products')
  // Invalidate the new product's page
  revalidatePath(`/products/${product[0].id}`)
  // Invalidate all nested routes
  revalidatePath('/products', 'layout')
}
```

**When to use:**
- After content updates affecting specific routes
- Invalidating dynamic segments
- Clearing layout caches

**Characteristics:**
- Invalidates Full Route Cache
- Can target specific paths or layouts
- More heavy-handed than tag invalidation
- Good for page-wide updates

## When to Use Each Pattern

### Decision Tree

```
Is the data user-specific?
├── YES → Use cache() for request deduplication
└── NO → Is it frequently accessed?
    ├── YES → Does it change often?
    │   ├── YES → Use short revalidate time (60-300s)
    │   └── NO → Use unstable_cache with tags
    └── NO → Is it a full page?
        ├── YES → Use page-level revalidate
        └── NO → Consider not caching
```

### Common Scenarios

#### User Profile Data
```typescript
// Request-level caching for user data
export const getCurrentUser = cache(async (userId: string) => {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { profile: true }
  })
})
```

#### Product Catalog
```typescript
// Persistent caching with tags
export const getProducts = unstable_cache(
  async (filters?: ProductFilters) => {
    return await db.query.products.findMany({
      where: buildWhereClause(filters),
      orderBy: [desc(products.createdAt)]
    })
  },
  ['products'],
  {
    revalidate: CACHE_TIMES.PRODUCTS, // 1 hour
    tags: ['products', 'catalog']
  }
)
```

#### Dashboard Statistics
```typescript
// Short-lived cache for dynamic data
export const getDashboardStats = unstable_cache(
  async () => {
    const [users, orders, revenue] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(orders),
      db.select({ sum: sum(orders.total) }).from(orders)
    ])
    return { users, orders, revenue }
  },
  ['dashboard-stats'],
  {
    revalidate: 300, // 5 minutes
    tags: ['stats']
  }
)
```

## Cache Invalidation

### Invalidation Strategies

#### 1. Time-based (TTL)
```typescript
// Automatically revalidates after specified seconds
{ revalidate: 3600 } // 1 hour
```

#### 2. On-demand (Tags)
```typescript
// Manually invalidate when data changes
revalidateTag('products')
```

#### 3. Path-based
```typescript
// Invalidate specific routes
revalidatePath('/products')
```

#### 4. Hybrid Approach
```typescript
// Combine time-based with on-demand
export const getCachedData = unstable_cache(
  fetchData,
  ['data-key'],
  {
    revalidate: 3600, // Fallback TTL
    tags: ['data'] // For immediate invalidation
  }
)
```

### Invalidation Patterns

#### After Create
```typescript
export async function createItem(data: ItemInput) {
  const item = await db.insert(items).values(data).returning()

  // Invalidate list caches
  revalidateTag('items')
  // Invalidate aggregate caches
  revalidateTag('stats')
  // Invalidate the listing page
  revalidatePath('/items')

  return item[0]
}
```

#### After Update
```typescript
export async function updateItem(id: string, data: ItemUpdate) {
  const item = await db.update(items).set(data).where(eq(items.id, id))

  // Invalidate specific item
  revalidateTag(`item-${id}`)
  // Invalidate lists that might include this item
  revalidateTag('items')
  // Invalidate the item's page
  revalidatePath(`/items/${id}`)

  return item
}
```

#### After Delete
```typescript
export async function deleteItem(id: string) {
  await db.delete(items).where(eq(items.id, id))

  // Invalidate everything related
  revalidateTag('items')
  revalidateTag(`item-${id}`)
  revalidateTag('stats')
  revalidatePath('/items', 'layout')
}
```

## Best Practices

### 1. Use Appropriate Cache Times
```typescript
export const CACHE_TIMES = {
  STATIC: 86400,      // 24 hours - rarely changes
  PRODUCTS: 3600,     // 1 hour - moderate updates
  USER_PROFILE: 600,  // 10 minutes - user-specific
  STATS: 300,         // 5 minutes - frequently updated
  REALTIME: 30,       // 30 seconds - near real-time
} as const
```

### 2. Combine Multiple Patterns
```typescript
// Use cache() for request deduplication
const getUser = cache(async (id: string) => {
  // Use unstable_cache for persistence
  return getCachedUser(id)
})

const getCachedUser = unstable_cache(
  async (id: string) => db.query.users.findFirst({ where: eq(users.id, id) }),
  ['user'],
  { revalidate: 600, tags: [`user-${id}`] }
)
```

### 3. Parallel Data Fetching
```typescript
export default async function DashboardPage() {
  // Fetch all data in parallel
  const [user, stats, recentActivity] = await Promise.all([
    getCurrentUser(),
    getDashboardStats(),
    getRecentActivity()
  ])

  return <Dashboard user={user} stats={stats} activity={recentActivity} />
}
```

### 4. Error Handling in Cached Functions
```typescript
export const getCachedData = unstable_cache(
  async () => {
    try {
      return await fetchDataFromDB()
    } catch (error) {
      logError(error, { endpoint: 'getCachedData' })
      // Return fallback or throw based on requirements
      return { data: [], error: 'Failed to fetch data' }
    }
  },
  ['data-key'],
  { revalidate: 300 }
)
```

### 5. Cache Warming
```typescript
// Warm critical caches on deployment
export async function warmCache() {
  await Promise.all([
    getCachedProducts(),
    getCachedCategories(),
    getDashboardStats()
  ])
}

// Call in instrumentation.ts or on startup
if (process.env.NODE_ENV === 'production') {
  warmCache().catch(console.error)
}
```

## Troubleshooting

### Cache Not Working

#### In Development
- Next.js disables some caching in development
- Use `next build && next start` to test production caching
- Check `NODE_ENV=production`

#### In Production
- Verify `revalidate` export is a number
- Check cache tags are strings
- Ensure async/await is properly used
- Review Next.js cache headers in response

### Cache Not Invalidating

#### Common Issues
1. **Wrong tag name**: Ensure tags match exactly
2. **Missing await**: `await revalidateTag('products')`
3. **Wrong context**: Only works in Server Actions/Route Handlers
4. **Race conditions**: Add small delay after invalidation

#### Debug Strategy
```typescript
// Add logging to track cache behavior
export const getCachedData = unstable_cache(
  async () => {
    console.log('[CACHE] Fetching fresh data')
    const data = await fetchData()
    console.log('[CACHE] Data fetched:', data.length, 'items')
    return data
  },
  ['data-key'],
  { revalidate: 300, tags: ['data'] }
)

// In mutation
export async function updateData() {
  console.log('[CACHE] Invalidating tag: data')
  revalidateTag('data')
  console.log('[CACHE] Tag invalidated')
}
```

### Performance Issues

#### Over-caching
- Too long cache times → stale data
- Solution: Reduce revalidate times or use tags

#### Under-caching
- Too short cache times → excessive DB queries
- Solution: Increase revalidate times

#### Cache Stampede
- Many requests after cache expiry
- Solution: Use stale-while-revalidate pattern

```typescript
// Prevent stampede with SWR pattern
export const getCachedData = unstable_cache(
  fetchData,
  ['data'],
  {
    revalidate: 300,
    tags: ['data'],
    // Return stale data while revalidating
    revalidate: false // Use on-demand only
  }
)
```

## Monitoring

### Key Metrics
- Cache hit rate
- Cache miss rate
- Revalidation frequency
- Query response times
- Database load

### Add Monitoring
```typescript
export const getCachedData = unstable_cache(
  async () => {
    const start = performance.now()
    const data = await fetchData()
    const duration = performance.now() - start

    // Log to monitoring service
    logMetric('cache.miss', { key: 'data', duration })

    return data
  },
  ['data'],
  { revalidate: 300 }
)
```

## Summary

### Quick Reference

| Pattern | Use Case | Invalidation | Persistence |
|---------|----------|--------------|-------------|
| `cache()` | Request deduplication | Automatic | Per request |
| `unstable_cache()` | Shared data caching | Tags/Time | Across requests |
| Page `revalidate` | Static pages | Time-based | Until revalidate |
| `revalidateTag()` | Targeted invalidation | Manual | Immediate |
| `revalidatePath()` | Route invalidation | Manual | Immediate |

### Cache Time Guidelines

| Content Type | Suggested Time | Example |
|--------------|----------------|---------|
| Static content | 24 hours | About pages |
| Product catalog | 1 hour | Product listings |
| User content | 10 minutes | User profiles |
| Analytics | 5 minutes | Dashboard stats |
| Real-time | 30 seconds | Stock levels |

### Invalidation Checklist

After **CREATE**:
- [ ] Invalidate list/collection tags
- [ ] Invalidate aggregate/stats tags
- [ ] Revalidate listing paths

After **UPDATE**:
- [ ] Invalidate specific item tag
- [ ] Invalidate parent collection tags
- [ ] Revalidate item and listing paths

After **DELETE**:
- [ ] Invalidate all related tags
- [ ] Revalidate affected paths
- [ ] Clear dependent caches

## Additional Resources

- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [React cache() API](https://react.dev/reference/react/cache)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)
- [ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)