import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { REGIONS, RegionCode } from '@/lib/pricing'

export async function POST(request: Request) {
  try {
    const { regionCode } = (await request.json()) as { regionCode?: RegionCode }
    const region = (regionCode && REGIONS[regionCode]) ? REGIONS[regionCode] : REGIONS.US

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: 'Stripe no está configurado todavía.' }, { status: 503 })
    }

    const stripe = new Stripe(secretKey)
    const origin = request.headers.get('origin') ?? 'http://localhost:3000'

    // Convert decimal amounts to smallest currency unit (cents/centavos)
    const unitAmount = Math.round(region.monthlyPrice * (region.currency === 'COP' ? 1 : 100))

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: region.currency.toLowerCase(),
            product_data: {
              name: 'Lexa Plus — Suscripción Legal',
              description: 'Orientación jurídica automatizada e ilimitada por texto y voz.',
            },
            unit_amount: unitAmount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?subscription=success`,
      cancel_url: `${origin}/?subscription=cancelled`,
      integration_identifier: `lexa_${Math.random().toString(36).slice(2, 10)}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: 'No se pudo iniciar el checkout.', details: errorMsg }, { status: 500 })
  }
}
