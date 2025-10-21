import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const required = ['storeName', 'contactPerson', 'cellphone', 'email', 'address']
    for (const k of required) {
      if (!data?.[k]) return NextResponse.json({ ok: false, error: `Missing field: ${k}` }, { status: 400 })
    }
    console.log('[Store Application]', JSON.stringify({ at: new Date().toISOString(), ...data }))
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Invalid payload' }, { status: 400 })
  }
}

