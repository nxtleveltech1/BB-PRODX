import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { transaction } from "@/lib/db/client-node"
import { cart, products } from "@/lib/db/schema"
import {
  findExistingCartItemId,
  getCartForUser,
  getUserIdOr401,
  type CartResponse,
} from "../_cart"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type AddItemBody = {
  productId?: number
  quantity?: number
  size?: string
}

const coercePositiveInt = (value: unknown): number | null => {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return null
  const i = Math.trunc(n)
  return i > 0 ? i : null
}

export async function POST(request: NextRequest) {
  const authResult = await getUserIdOr401()
  if (!authResult.ok) return authResult.response

  let body: AddItemBody
  try {
    body = (await request.json()) as AddItemBody
  } catch {
    return NextResponse.json<CartResponse>(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const productId = coercePositiveInt(body.productId)
  const quantity = coercePositiveInt(body.quantity ?? 1)
  const size = typeof body.size === "string" && body.size.trim() ? body.size.trim() : null

  if (!productId) {
    return NextResponse.json<CartResponse>(
      { success: false, message: "Valid productId is required" },
      { status: 400 }
    )
  }

  if (!quantity || quantity < 1 || quantity > 99) {
    return NextResponse.json<CartResponse>(
      { success: false, message: "Quantity must be between 1 and 99" },
      { status: 400 }
    )
  }

  try {
    await transaction(async (tx) => {
      const productRows = await tx
        .select({
          id: products.id,
          inStock: products.inStock,
          stockCount: products.stockCount,
        })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1)
      const product = productRows[0]

      if (!product) {
        throw new Error("Product not found")
      }

      if (!product.inStock) {
        throw new Error("Product is out of stock")
      }

      if ((Number(product.stockCount) || 0) < quantity) {
        throw new Error("Insufficient stock")
      }

      const existing = await findExistingCartItemId({
        userId: authResult.userId,
        productId,
        size,
        tx,
      })

      if (existing) {
        const newQuantity = Math.min(99, (Number(existing.quantity) || 0) + quantity)

        await tx
          .update(cart)
          .set({ quantity: newQuantity, updatedAt: new Date() })
          .where(eq(cart.id, existing.id))
      } else {
        await tx.insert(cart).values({
          userId: authResult.userId,
          productId,
          quantity,
          size,
          addedAt: new Date(),
          updatedAt: new Date(),
        })
      }
    })

    const cartData = await getCartForUser(authResult.userId)

    return NextResponse.json<CartResponse>(
      {
        success: true,
        message: "Item added to cart",
        cart: cartData,
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add item to cart"
    const status = message === "Product not found" ? 404 : message.includes("stock") ? 400 : 500

    return NextResponse.json<CartResponse>(
      { success: false, message },
      { status }
    )
  }
}


