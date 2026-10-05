import { Language } from './i18n'

export type RegionCode = 'CO' | 'US' | 'MX' | 'ES'

export type RegionConfig = {
  code: RegionCode
  countryName: string
  currency: string
  symbol: string
  locale: string
  monthlyPrice: number
  priceFormatted: string
}

export const REGIONS: Record<RegionCode, RegionConfig> = {
  CO: {
    code: 'CO',
    countryName: 'Colombia',
    currency: 'COP',
    symbol: '$',
    locale: 'es-CO',
    monthlyPrice: 59000,
    priceFormatted: '$59.000 COP',
  },
  US: {
    code: 'US',
    countryName: 'United States / International',
    currency: 'USD',
    symbol: '$',
    locale: 'en-US',
    monthlyPrice: 14.99,
    priceFormatted: '$14.99 USD',
  },
  MX: {
    code: 'MX',
    countryName: 'México',
    currency: 'MXN',
    symbol: '$',
    locale: 'es-MX',
    monthlyPrice: 280,
    priceFormatted: '$280 MXN',
  },
  ES: {
    code: 'ES',
    countryName: 'España / Eurozona',
    currency: 'EUR',
    symbol: '€',
    locale: 'es-ES',
    monthlyPrice: 13.99,
    priceFormatted: '13,99 € EUR',
  },
}

export function formatCurrency(amount: number, regionCode: RegionCode): string {
  const reg = REGIONS[regionCode] || REGIONS.US
  try {
    const formatted = new Intl.NumberFormat(reg.locale, {
      style: 'currency',
      currency: reg.currency,
      maximumFractionDigits: reg.currency === 'COP' ? 0 : 2,
    }).format(amount)
    return `${formatted} ${reg.currency}`
  } catch {
    return `${reg.symbol}${amount} ${reg.currency}`
  }
}

export function detectDefaultRegion(lang: Language): RegionCode {
  if (typeof window === 'undefined') return lang === 'es' ? 'CO' : 'US'
  
  try {
    const navLang = navigator.language.toLowerCase()
    if (navLang.includes('co')) return 'CO'
    if (navLang.includes('mx')) return 'MX'
    if (navLang.includes('es') || navLang.includes('cl') || navLang.includes('ar')) return 'ES'
    if (navLang.includes('en') || navLang.includes('us')) return 'US'
  } catch {
    // fallback
  }
  return lang === 'es' ? 'CO' : 'US'
}
