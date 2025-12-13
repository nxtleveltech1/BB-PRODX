import { NextResponse } from "next/server"
import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { auth } from "@/services/auth/auth"
import { db, transaction } from "@/lib/db/client-node"
import { cart, orderItems, orders, products, productSizes } from "@/lib/db/schema"
import { generateOrderNumber } from "@/lib/db/schema/order"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export type OrdersApiResponse =
  | { success: true; message?: string; order?: unknown; orders?: unknown; pagination?: unknown }
  | { success: false; message: string; error?: string }

export const getUserIdOr401 = async () => {
  const session = await auth()
  const rawUserId = session?.user?.id
  const userId = rawUserId ? Number(rawUserId) : NaN

  if (!Number.isFinite(userId) || userId <= 0) {
    return NextResponse.json<OrdersApiResponse>(
      { success: false, message: "Please sign in to continue." },
      { status: 401 }
    )
  }

  return userId
}

export const parseMoney = (value: unknown): number => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const n = Number(value.replace(/[^0-9.]/g, ""))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export const formatMoney = (value: number): string => value.toFixed(2)

export const computeTotals = (subtotal: number, shipping: number) => {
  const tax = subtotal * 0.15
  const total = subtotal + tax + shipping
  return { tax, total }
}

export const getCartLineItemsForOrder = async (
  userId: number,
  dbHandle: typeof db = db
) => {
  const rows = await dbHandle
    .select({
      cartId: cart.id,
      productId: cart.productId,
      quantity: cart.quantity,
      size: cart.size,
      productName: products.name,
      productSku: products.sku,
      productImageUrl: products.imageUrl,
      productInStock: products.inStock,
      productStockCount: products.stockCount,
      unitPrice: sql<string>`COALESCE(${productSizes.price}, ${products.price})`.as("unit_price"),
    })
    .from(cart)
    .innerJoin(products, eq(products.id, cart.productId))
    .leftJoin(
      productSizes,
      and(eq(productSizes.productId, cart.productId), eq(productSizes.size, cart.size))
    )
    .where(eq(cart.userId, userId))
    .orderBy(desc(cart.addedAt))

  return rows.map((r) => ({
    cartId: r.cartId,
    productId: r.productId,
    quantity: Number(r.quantity) || 0,
    size: r.size ?? null,
    unitPrice: parseMoney(r.unitPrice),
    product: {
      name: r.productName ?? "",
      sku: r.productSku ?? "",
      imageUrl: r.productImageUrl ?? undefined,
      inStock: Boolean(r.productInStock),
      stockCount: Number(r.productStockCount) || 0,
    },
  }))
}

export const createOrderFromCart = async (params: {
  userId: number
  shippingAddress: unknown
  billingAddress?: unknown
  paymentMethod?: string
  customerNotes?: string
  shippingCost: number
}) => {
  const { userId, shippingAddress, billingAddress, paymentMethod, customerNotes, shippingCost } =
    params

  return transaction(async (tx) => {
    const cartItems = await getCartLineItemsForOrder(userId, tx)

    if (cartItems.length === 0) {
      throw new Error("Cart is empty")
    }

    for (const item of cartItems) {
      if (!item.product.inStock) {
        throw new Error(`Out of stock: ${item.product.name}`)
      }
      if (item.product.stockCount < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}`)
      }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const { tax, total } = computeTotals(subtotal, shippingCost)
    const orderNumber = generateOrderNumber()

    const [newOrder] = await tx
      .insert(orders)
      .values({
        userId,
        orderNumber,
        status: "pending",
        subtotal: formatMoney(subtotal),
        tax: formatMoney(tax),
        shipping: formatMoney(shippingCost),
        total: formatMoney(total),
        shippingAddress,
        billingAddress: billingAddress ?? shippingAddress,
        paymentMethod: paymentMethod ?? "card",
        paymentStatus: "pending",
        customerNotes: customerNotes ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    await tx.insert(orderItems).values(
      cartItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: formatMoney(item.unitPrice),
        size: item.size,
        discountAmount: "0",
        discountCode: null,
        subtotal: formatMoney(item.unitPrice * item.quantity),
        productSnapshot: {
          name: item.product.name,
          sku: item.product.sku,
          imageUrl: item.product.imageUrl,
        },
        createdAt: new Date(),
      }))
    )

    // Decrement stock
    const productIds = cartItems.map((i) => i.productId)
    const dbProducts = await tx
      .select({ id: products.id, stockCount: products.stockCount })
      .from(products)
      .where(inArray(products.id, productIds))

    const stockById = new Map<number, number>()
    for (const p of dbProducts) {
      stockById.set(p.id, Number(p.stockCount) || 0)
    }

    for (const item of cartItems) {
      const currentStock = stockById.get(item.productId) ?? 0
      const newStock = Math.max(0, currentStock - item.quantity)
      stockById.set(item.productId, newStock)

      await tx
        .update(products)
        .set({
          stockCount: newStock,
          inStock: newStock > 0,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId))
    }

    // Clear cart
    await tx.delete(cart).where(eq(cart.userId, userId))

    return newOrder
  })
}


