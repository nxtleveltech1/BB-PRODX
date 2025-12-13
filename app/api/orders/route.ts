import { NextRequest, NextResponse } from "next/server"
import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db/client-node"
import { orders } from "@/lib/db/schema"
import {
  createOrderFromCart,
  getUserIdOr401,
  type OrdersApiResponse,
} from "./_orders"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const userIdOrResponse = await getUserIdOr401()
  if (userIdOrResponse instanceof NextResponse) return userIdOrResponse
  const userId = userIdOrResponse

  const searchParams = request.nextUrl.searchParams
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "10")))
  const offset = Math.max(0, Number(searchParams.get("offset") || "0"))
  const status = searchParams.get("status") || undefined

  const baseWhere = status
    ? and(eq(orders.userId, userId), eq(orders.status, status))
    : eq(orders.userId, userId)

  const list = await db
    .select()
    .from(orders)
    .where(baseWhere)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset)

  // Lightweight pagination meta (best-effort)
  const totalCountRow = await db
    .select({ count: sql<number>`count(*)`.as("count") })
    .from(orders)
    .where(baseWhere)
    .then((rows) => rows[0])

  const totalCount = Number(totalCountRow?.count) || list.length

  return NextResponse.json<OrdersApiResponse>({
    success: true,
    orders: list,
    pagination: {
      limit,
      offset,
      totalCount,
    },
  })
}

export async function POST(request: NextRequest) {
  const userIdOrResponse = await getUserIdOr401()
  if (userIdOrResponse instanceof NextResponse) return userIdOrResponse
  const userId = userIdOrResponse

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json<OrdersApiResponse>(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const shippingAddress = body?.shippingAddress
  const billingAddress = body?.billingAddress
  const paymentMethod = typeof body?.paymentMethod === "string" ? body.paymentMethod : undefined
  const customerNotes = typeof body?.customerNotes === "string" ? body.customerNotes : undefined
  const shippingCost = Number(body?.shippingCost ?? 0)

  if (!shippingAddress) {
    return NextResponse.json<OrdersApiResponse>(
      { success: false, message: "shippingAddress is required" },
      { status: 400 }
    )
  }

  if (!Number.isFinite(shippingCost) || shippingCost < 0) {
    return NextResponse.json<OrdersApiResponse>(
      { success: false, message: "shippingCost must be a non-negative number" },
      { status: 400 }
    )
  }

  try {
    const order = await createOrderFromCart({
      userId,
      shippingAddress,
      billingAddress,
      paymentMethod,
      customerNotes,
      shippingCost,
    })

    return NextResponse.json<OrdersApiResponse>(
      { success: true, message: "Order created", order },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order"
    const status =
      message === "Cart is empty" ? 400 : message.toLowerCase().includes("stock") ? 400 : 500
    return NextResponse.json<OrdersApiResponse>(
      { success: false, message },
      { status }
    )
  }
}


