import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db/client-node"
import { orderItems, orders } from "@/lib/db/schema"
import { dynamic, getUserIdOr401, runtime, type OrdersApiResponse } from "../_orders"

export { runtime, dynamic }

const parseOrderId = (value: string | undefined): number | null => {
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  const i = Math.trunc(n)
  return i > 0 ? i : null
}

export async function GET(
  _request: NextRequest,
  context: { params: { orderId: string } }
) {
  const userIdOrResponse = await getUserIdOr401()
  if (userIdOrResponse instanceof NextResponse) return userIdOrResponse
  const userId = userIdOrResponse

  const orderId = parseOrderId(context.params.orderId)
  if (!orderId) {
    return NextResponse.json<OrdersApiResponse>(
      { success: false, message: "Invalid order ID" },
      { status: 400 }
    )
  }

  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1)
    .then((rows) => rows[0])

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


