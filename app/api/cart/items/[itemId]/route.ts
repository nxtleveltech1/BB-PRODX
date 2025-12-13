import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { transaction } from "@/lib/db/client-node"
import { cart, products } from "@/lib/db/schema"
import { getCartForUser, getUserIdOr401, type CartResponse } from "../../_cart"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const coerceNonNegativeInt = (value: unknown): number | null => {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return null
  const i = Math.trunc(n)
  return i >= 0 ? i : null
}

const parseItemId = (params: { itemId?: string }): number | null => {
  const n = Number(params.itemId)
  if (!Number.isFinite(n)) return null
  const i = Math.trunc(n)
  return i > 0 ? i : null
}

export async function PUT(
  request: NextRequest,
  context: { params: { itemId: string } }
) {
  const authResult = await getUserIdOr401()
  if (!authResult.ok) return authResult.response

  const itemId = parseItemId(context.params)
  if (!itemId) {
    return NextResponse.json<CartResponse>(
      { success: false, message: "Invalid cart item ID" },
      { status: 400 }
    )
  }

  let body: { quantity?: number }
  try {
    body = (await request.json()) as { quantity?: number }
  } catch {
    return NextResponse.json<CartResponse>(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const quantity = coerceNonNegativeInt(body.quantity)
  if (quantity == null || quantity > 99) {
    return NextResponse.json<CartResponse>(
      { success: false, message: "Quantity must be between 0 and 99" },
      { status: 400 }
    )
  }

  try {
    await transaction(async (tx) => {
      const existing = await tx
        .select({
          id: cart.id,
          productId: cart.productId,
        })
        .from(cart)
        .where(and(eq(cart.id, itemId), eq(cart.userId, authResult.userId)))
        .limit(1)
        .then((rows) => rows[0])

      if (!existing) {
        throw new Error("Cart item not found")
      }

      if (quantity === 0) {
        await tx
          .delete(cart)
          .where(and(eq(cart.id, itemId), eq(cart.userId, authResult.userId)))
        return
      }

      const product = await tx
        .select({
          inStock: products.inStock,
          stockCount: products.stockCount,
        })
        .from(products)
        .where(eq(products.id, existing.productId))
        .limit(1)
        .then((rows) => rows[0])

      if (!product || !product.inStock) {
        throw new Error("Product is out of stock")
      }

      if ((Number(product.stockCount) || 0) < quantity) {
        throw new Error("Insufficient stock")
      }

      await tx
        .update(cart)
        .set({ quantity, updatedAt: new Date() })
        .where(and(eq(cart.id, itemId), eq(cart.userId, authResult.userId)))
    })

    const cartData = await getCartForUser(authResult.userId)

    return NextResponse.json<CartResponse>({
      success: true,
      message: quantity === 0 ? "Item removed from cart" : "Cart updated",
      cart: cartData,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update cart"
    const status =
      message === "Cart item not found" ? 404 : message.includes("stock") ? 400 : 500

    return NextResponse.json<CartResponse>(
      { success: false, message },
      { status }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { itemId: string } }
) {
  const authResult = await getUserIdOr401()
  if (!authResult.ok) return authResult.response

  const itemId = parseItemId(context.params)
  if (!itemId) {
    return NextResponse.json<CartResponse>(
      { success: false, message: "Invalid cart item ID" },
      { status: 400 }
    )
  }

  await transaction(async (tx) => {
    await tx
      .delete(cart)
      .where(and(eq(cart.id, itemId), eq(cart.userId, authResult.userId)))
  })

  const cartData = await getCartForUser(authResult.userId)

  return NextResponse.json<CartResponse>({
    success: true,
    message: "Item removed from cart",
    cart: cartData,
  })
}


