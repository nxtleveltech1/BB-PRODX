import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db/client-node"
import { orderItems, orders } from "@/lib/db/schema"
import { getUserIdOr401, type OrdersApiResponse } from "../_orders"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const parseOrderId = (value: string | undefined): number | null => {
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  const i = Math.trunc(n)
  return i > 0 ? i : null
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  const userIdOrResponse = await getUserIdOr401()
  if (userIdOrResponse instanceof NextResponse) return userIdOrResponse
  const userId = userIdOrResponse

  const { orderId: orderIdParam } = await context.params
  const orderId = parseOrderId(orderIdParam)
  if (!orderId) {
    return NextResponse.json<OrdersApiResponse>(
      { success: false, message: "Invalid order ID" },
      { status: 400 }
    )
  }

  const orderRows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1)
  const order = orderRows[0]

  if (!order) {
    return NextResponse.json<OrdersApiResponse>(
      { success: false, message: "Order not found" },
      { status: 404 }
    )
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))

  return NextResponse.json<OrdersApiResponse>({
    success: true,
    order: {
      ...order,
      items,
    },
  })
}


