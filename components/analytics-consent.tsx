'use client'

import { Analytics } from '@vercel/analytics/next'
import { useEffect, useState } from 'react'

const CONSENT_KEY = 'lexa_cookie_consent'

type Consent = { necessary?: boolean; analytics?: boolean; date?: string }

/**
 * Vercel Analytics solo se carga si el usuario aceptó la medición en el banner
 * de cookies. Sin consentimiento explícito no se inyecta ningún script.
 */
export function AnalyticsWithConsent() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const read = () => {
      try {
        const raw = window.localStorage.getItem(CONSENT_KEY)
        const consent = raw ? (JSON.parse(raw) as Consent) : null
        setAllowed(consent?.analytics === true)
      } catch {
        setAllowed(false)
      }
    }
    read()
    window.addEventListener('lexa:consent', read)
    return () => window.removeEventListener('lexa:consent', read)
  }, [])

  if (!allowed) return null
  return <Analytics />
}
