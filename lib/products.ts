export const PRODUCTS = [
  {
    id: 'lexa-plus-monthly',
    name: 'Lexa Plus',
    description: 'Consultas ilimitadas con orientación legal basada en fuentes organizadas.',
    priceInCents: 1499,
    interval: 'month' as const,
  },
] as const

export type Product = (typeof PRODUCTS)[number]
