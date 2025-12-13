import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db/client-node"
import { cart } from "@/lib/db/schema"
import { getCartForUser, getUserIdOr401, type CartResponse } from "./_cart"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const authResult = await getUserIdOr401()
  if (!authResult.ok) return authResult.response

  const cartData = await getCartForUser(authResult.userId)

  return NextResponse.json<CartResponse>({
    success: true,
    cart: cartData,
  })
}

export async function DELETE() {
  const authResult = await getUserIdOr401()
  if (!authResult.ok) return authResult.response

  await db.delete(cart).where(eq(cart.userId, authResult.userId))

  const cartData = await getCartForUser(authResult.userId)

  return NextResponse.json<CartResponse>({
    success: true,
    message: "Cart cleared",
    cart: cartData,
  })
}


