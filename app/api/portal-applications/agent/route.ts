import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    // Basic validation
    const required = ['fullName', 'surname', 'cellphone', 'email']
    for (const k of required) {
      if (!data?.[k]) return NextResponse.json({ ok: false, error: `Missing field: ${k}` }, { status: 400 })
    }
    // Log to server logs for now (can be replaced with DB/email/zapier integration)
    console.log('[Agent Application]', JSON.stringify({
      at: new Date().toISOString(),
      ...data,
    }))
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Invalid payload' }, { status: 400 })
  }
}

