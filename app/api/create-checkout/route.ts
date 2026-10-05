import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PRODUCTS } from '@/lib/products'

export async function POST(request: Request) {
  try {
    const { productId } = (await request.json()) as { productId?: string }
    const product = PRODUCTS.find((item) => item.id === productId)

    if (!product) {
      return NextResponse.json({ error: 'Producto no válido.' }, { status: 400 })
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ error: 'Stripe no está configurado todavía.' }, { status: 503 })
    }

    const stripe = new Stripe(secretKey)
    const origin = request.headers.get('origin') ?? 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: product.name, description: product.description },
            unit_amount: product.priceInCents,
            recurring: { interval: product.interval },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?subscription=success`,
      cancel_url: `${origin}/?subscription=cancelled`,
      integration_identifier: `lexa_${Math.random().toString(36).slice(2, 10)}`,
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'No se pudo iniciar el checkout.' }, { status: 500 })
  }
}
