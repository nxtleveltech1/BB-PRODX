import { NextResponse } from "next/server"
import { getCartForUser, getUserIdOr401, type CartResponse } from "../_cart"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const authResult = await getUserIdOr401()
  if (!authResult.ok) return authResult.response

  const cartData = await getCartForUser(authResult.userId)

  return NextResponse.json<CartResponse>({
    success: true,
    summary: cartData.summary,
  })
}


