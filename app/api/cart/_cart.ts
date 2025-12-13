import { NextResponse } from "next/server"
import { and, desc, eq, isNull, sql } from "drizzle-orm"
import { auth } from "@/services/auth/auth"
import { db } from "@/lib/db/client-node"
import { cart, products, productSizes } from "@/lib/db/schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export type CartSummary = {
  itemCount: number
  quantity: number
  total: number
}

export type CartItemRow = {
  id: number
  product_id: number
  quantity: number
  product_name: string
  product_image: string
  product_price: string
  product_in_stock: boolean
  product_stock_count: number
}

export type CartResponse = {
  success: boolean
  message?: string
  error?: string
  cart?: {
    items: CartItemRow[]
    summary: CartSummary
    isEmpty: boolean
  }
  summary?: CartSummary
}

export const getUserIdOr401 = async (): Promise<
  | { ok: true; userId: number }
  | { ok: false; response: NextResponse<CartResponse> }
> => {
  const session = await auth()
  const rawUserId = session?.user?.id

  const userId = rawUserId ? Number(rawUserId) : NaN
  if (!Number.isFinite(userId) || userId <= 0) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Please sign in to manage your cart.",
          error: "Unauthorized",
        },
        { status: 401 }
      ),
    }
  }

  return { ok: true, userId }
}

const parseMoney = (value: unknown): number => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const n = Number(value.replace(/[^0-9.]/g, ""))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export const getCartForUser = async (userId: number) => {
  const rows = await db
    .select({
      id: cart.id,
      productId: cart.productId,
      quantity: cart.quantity,
      productName: products.name,
      productImage: products.imageUrl,
      productInStock: products.inStock,
      productStockCount: products.stockCount,
      actualPrice: sql<string>`COALESCE(${productSizes.price}, ${products.price})`.as(
        "actual_price"
      ),
    })
    .from(cart)
    .innerJoin(products, eq(products.id, cart.productId))
    .leftJoin(
      productSizes,
      and(eq(productSizes.productId, cart.productId), eq(productSizes.size, cart.size))
    )
    .where(eq(cart.userId, userId))
    .orderBy(desc(cart.addedAt))

  const items: CartItemRow[] = rows.map((r) => ({
    id: r.id,
    product_id: r.productId,
    quantity: Number(r.quantity) || 0,
    product_name: r.productName ?? "",
    product_image: r.productImage ?? "/placeholder.svg",
    product_price: String(r.actualPrice ?? "0"),
    product_in_stock: Boolean(r.productInStock),
    product_stock_count: Number(r.productStockCount) || 0,
  }))

  const summary: CartSummary = {
    itemCount: items.length,
    quantity: items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    total: items.reduce(
      (sum, item) => sum + parseMoney(item.product_price) * (Number(item.quantity) || 0),
      0
    ),
  }

  return {
    items,
    summary,
    isEmpty: items.length === 0,
  }
}

export const findExistingCartItemId = async (params: {
  userId: number
  productId: number
  size?: string | null
  // Allows callers to reuse a transaction-scoped DB instance
  tx?: typeof db
}) => {
  const { userId, productId, size } = params
  const dbHandle = params.tx ?? db

  const whereClause =
    size == null || size === ""
      ? and(eq(cart.userId, userId), eq(cart.productId, productId), isNull(cart.size))
      : and(eq(cart.userId, userId), eq(cart.productId, productId), eq(cart.size, size))

  const existing = await dbHandle
    .select({ id: cart.id, quantity: cart.quantity })
    .from(cart)
    .where(whereClause)
    .limit(1)
    .then((rows) => rows[0])

  return existing ?? null
}


