import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function OrdersLegacyPage() {
  redirect("/account/orders")
}


