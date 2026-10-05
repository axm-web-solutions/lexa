'use client'

import { CookiesConsent, LegalDocId, LegalFooter, LegalDocModal } from '@/components/legal-info'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, CalendarDays, Check, CheckCircle2, ChevronRight, CircleHelp, Clock, DollarSign, FileText, Gavel, Globe, LockKeyhole, Menu, Phone, Scale, ShieldCheck, Sparkles, User, Volume2, VolumeX, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Language, translations } from '@/lib/i18n'
import { detectDefaultRegion, formatCurrency, REGIONS, RegionCode } from '@/lib/pricing'
import { dictionary, fallbackAnswersByLang } from '@/lib/dictionary'

// Horarios disponibles
const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

type ApptForm = { name: string; phone: string; date: string; time: string; reason: string; consent: boolean }
type QuoteForm = { name: string; phone: string; caseType: string; description: string; urgency: string; consent: boolean }
type FormStatus = 'idle' | 'sending' | 'done'

type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
  area?: string
  streaming?: boolean
}
type ChatPhase = 'idle' | 'thinking' | 'writing'

// ——— Hook TTS Multilingüe (Web Speech API) ———
function useSpeech(lang: Language) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [speakingId, setSpeakingId] = useState<number | null>(null)

  const speak = useCallback((text: string, id: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang === 'en' ? 'en-US' : 'es-CO'
    utter.rate = 0.95
    utter.pitch = 1.0

    const voices = window.speechSynthesis.getVoices()
    const targetVoice = voices.find((v) =>
      lang === 'en' ? v.lang.startsWith('en') : v.lang.startsWith('es')
    )
    if (targetVoice) utter.voice = targetVoice

    utter.onstart = () => setSpeakingId(id)
    utter.onend = () => setSpeakingId(null)
    utter.onerror = () => setSpeakingId(null)
    utteranceRef.current = utter
    window.speechSynthesis.speak(utter)
  }, [lang])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
    }
  }, [])

  return { speak, stop, speakingId }
}

function LawyerHeroPhoto({ lang }: { lang: Language }) {
  const t = translations[lang]
  return (
    <motion.div
      className="lawyer-hero-photo"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div className="lawyer-photo-frame">
        <Image
          src="/dr-alejandro-vargas.jpg"
          alt={t.character.name}
          width={340}
          height={340}
          className="lawyer-photo-img"
          priority
        />
        <div className="lawyer-photo-glow" />
      </div>
      <div className="lawyer-hero-badge">
        <span className="status-dot" />
        <span>{t.character.status}</span>
      </div>
      <div className="lawyer-hero-name">
        <strong>{t.character.name}</strong>
        <span>{t.character.role}</span>
        <small className="ai-character-tag"><Sparkles size={11} /> {t.character.disclaimerBadge}</small>
      </div>
    </motion.div>
  )
}

function App() {
  const [lang, setLang] = useState<Language>('es')
  const [regionCode, setRegionCode] = useState<RegionCode>('CO')
  const t = translations[lang]

  useEffect(() => {
    const defaultReg = detectDefaultRegion(lang)
    setRegionCode(defaultReg)
  }, [lang])

  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [used, setUsed] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocId | null>(null)

  // Set initial message according to language
  useEffect(() => {
    setMessages([
      {
        id: 0,
        role: 'assistant',
        text: t.chat.initialGreeting,
        area: t.chat.areaInitial,
      },
    ])
  }, [lang, t.chat.initialGreeting, t.chat.areaInitial])

  // Appointment form state
  const [apptForm, setApptForm] = useState<ApptForm>({ name: '', phone: '', date: '', time: '', reason: '', consent: false })
  const [apptStatus, setApptStatus] = useState<FormStatus>('idle')

  // Quote form state
  const [quoteForm, setQuoteForm] = useState<QuoteForm>({ name: '', phone: '', caseType: '', description: '', urgency: 'normal', consent: false })
  const [quoteStatus, setQuoteStatus] = useState<FormStatus>('idle')
  const [quotedPrice, setQuotedPrice] = useState('')

  const submitAppt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!apptForm.name || !apptForm.phone || !apptForm.date || !apptForm.time || !apptForm.consent) return
    setApptStatus('sending')
    setTimeout(() => setApptStatus('done'), 1800)
  }

  const submitQuote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quoteForm.name || !quoteForm.phone || !quoteForm.caseType || !quoteForm.consent) return
    setQuoteStatus('sending')
    const found = t.quote.caseTypes.find(c => c.value === quoteForm.caseType)
    const baseVal = regionCode === 'CO' ? (found?.baseCOP ?? 0) : (found?.baseUSD ?? 0)
    let finalAmount = baseVal
    if (quoteForm.urgency === 'urgent') finalAmount = Math.round(baseVal * 1.3)
    if (quoteForm.urgency === 'express') finalAmount = Math.round(baseVal * 1.6)

    const formatted = baseVal > 0 ? formatCurrency(finalAmount, regionCode) : 'A consultar'
    setQuotedPrice(formatted)
    setTimeout(() => setQuoteStatus('done'), 2000)
  }

  const [showPricing, setShowPricing] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [phase, setPhase] = useState<ChatPhase>('idle')
  const timers = useRef<number[]>([])
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const { speak, stop, speakingId } = useSpeech(lang)

  const MAX_QUESTIONS = 7

  useEffect(() => () => { timers.current.forEach((timer) => window.clearTimeout(timer)) }, [])

  useEffect(() => {
    const node = chatBodyRef.current
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' })
  }, [messages, phase])

  const queue = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay))
  }

  const writeRacha = (full: string, start: number, msgId: number) => {
    const chunkSize = 10 + Math.random() * 14
    const end = Math.min(full.length, start + chunkSize)
    setMessages((current) =>
      current.map((message) =>
        message.id === msgId ? { ...message, text: full.slice(0, end) } : message
      )
    )
    if (end >= full.length) {
      setMessages((current) =>
        current.map((message) =>
          message.id === msgId ? { ...message, streaming: false } : message
        )
      )
      setUsed((current) => current + 1)
      setPhase('idle')
      return
    }
    const lastChar = full[end - 1]
    const pause = /[.!?]/.test(lastChar) ? 500 : /[,;:]/.test(lastChar) ? 180 : 90
    queue(() => { writeRacha(full, end, msgId) }, pause)
  }

  const ask = (text = query) => {
    if (!text.trim() || phase !== 'idle') return
    if (used >= MAX_QUESTIONS) { setShowPricing(true); return }

    const normalized = text.toLowerCase()
    const match = dictionary.find((entry) =>
      entry.keywords[lang].some((keyword) => normalized.includes(keyword))
    )

    const fallbackList = fallbackAnswersByLang[lang]
    const answer = match
      ? match.answer[lang]
      : fallbackList[Math.floor(Math.random() * fallbackList.length)]

    const area = match ? match.area[lang] : t.chat.areaGeneral

    const userMsgId = nextId.current++
    setMessages((current) => [...current, { id: userMsgId, role: 'user', text, area: '' }])
    setQuery('')
    setPhase('thinking')

    queue(() => {
      const assistantId = nextId.current++
      setMessages((current) => [
        ...current,
        { id: assistantId, role: 'assistant', text: '', area, streaming: true },
      ])
      setPhase('writing')
      writeRacha(answer, 0, assistantId)
    }, 800 + Math.random() * 400)
  }

  const checkout = async () => {
    try {
      setCheckoutLoading(true)
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regionCode }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Error al iniciar checkout.')
      }
    } catch {
      alert('Ocurrió un error al conectar con la pasarela de pago.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleVoiceClick = (msg: Message) => {
    if (speakingId === msg.id) {
      stop()
    } else {
      speak(msg.text, msg.id)
    }
  }

  return (
    <>
      <div className="courtroom-media" aria-hidden="true">
        <video className="courtroom-video video-judge" autoPlay muted loop playsInline preload="auto" poster="/courtroom-poster-judge.jpg">
          <source src="/courtroom-judge.mp4" type="video/mp4" />
        </video>
        <video className="courtroom-video video-gavel" autoPlay muted loop playsInline preload="auto" poster="/courtroom-poster.jpg">
          <source src="/courtroom-gavel.mp4" type="video/mp4" />
        </video>
        <div className="courtroom-grain" />
      </div>
      <div className="courtroom-overlay" aria-hidden="true" />

      <main className="app-shell">
        {/* ——— Navbar ——— */}
        <nav className="topbar">
          <a className="brand" href="#inicio">
            <span className="brand-mark"><Scale size={17} strokeWidth={1.5} /></span>
            <span>{t.common.brand}</span>
          </a>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#como-funciona">{t.common.nav.howItWorks}</a>
            <a href="#consulta">{t.common.nav.consultation}</a>
            <a href="#agendar">{t.common.nav.appointment}</a>
            <a href="#cotizacion">{t.common.nav.quote}</a>
            
            {/* Language & Region Selectors */}
            <div className="i18n-selectors">
              <button
                type="button"
                className="lang-toggle"
                onClick={() => setLang(l => (l === 'es' ? 'en' : 'es'))}
                title="Cambiar idioma / Change language"
              >
                <Globe size={13} />
                <span>{lang.toUpperCase()}</span>
              </button>
              <select
                className="region-select"
                value={regionCode}
                onChange={e => setRegionCode(e.target.value as RegionCode)}
                aria-label="Seleccionar región / Moneda"
              >
                {Object.values(REGIONS).map(reg => (
                  <option key={reg.code} value={reg.code}>
                    {reg.code} ({reg.currency})
                  </option>
                ))}
              </select>
            </div>

            <button className="nav-cta" onClick={() => setShowPricing(true)}>
              {t.common.nav.viewPlanes} <ArrowUpRight size={15} />
            </button>
          </div>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* ——— Hero ——— */}
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {t.hero.title1}<br />
              <em>{t.hero.title2}</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {t.hero.subtitle}
            </motion.p>
            <div className="hero-actions">
              <a href="#consulta" className="primary-button">
                {t.hero.ctaPrimary} <ChevronRight size={16} />
              </a>
              <a href="#como-funciona" className="text-button">
                {t.hero.ctaSecondary} <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="trust-row">
              <span><ShieldCheck size={15} /> {t.hero.trust1}</span>
              <span><BookOpen size={15} /> {t.hero.trust2}</span>
            </div>
          </div>
          <LawyerHeroPhoto lang={lang} />
        </section>

        {/* ——— Disclaimer jurídico banner ——— */}
        <div className="legal-banner-wrapper">
          <div className="legal-banner">
            <CircleHelp size={16} className="banner-icon" />
            <p>{t.legalDisclaimer.bannerText}</p>
          </div>
        </div>

        {/* ——— Consulta ——— */}
        <section className="consultation" id="consulta">
          <div className="section-label">01 / {t.common.nav.consultation}</div>
          <div className="consultation-grid">
            <div className="intro-panel">
              <p className="kicker">{t.chat.kicker}</p>
              <h2>
                {t.chat.heading1}<br />
                <span>{t.chat.heading2}</span>
              </h2>
              <p>{t.chat.subheading}</p>
              <div className="usage">
                <div>
                  <span>{t.chat.availableQueries}</span>
                  <strong>
                    {Math.max(0, MAX_QUESTIONS - used)} <small>/ {MAX_QUESTIONS}</small>
                  </strong>
                </div>
                <div className="usage-bar">
                  <span style={{ width: `${Math.min(100, (used / MAX_QUESTIONS) * 100)}%` }} />
                </div>
              </div>

              <div className="lawyer-panel-photo">
                <Image src="/dr-alejandro-vargas.jpg" alt={t.character.name} width={56} height={56} className="lawyer-panel-img" />
                <div>
                  <strong>{t.character.name}</strong>
                  <span>{t.character.role}</span>
                </div>
              </div>
            </div>

            {/* ——— Chat Card ——— */}
            <div className="chat-card">
              <div className="chat-header">
                <div className={`lawyer-avatar-wrap ${speakingId !== null ? 'speaking' : ''}`}>
                  <Image src="/dr-alejandro-vargas.jpg" alt={t.character.name} width={38} height={38} className="lawyer-avatar-img" />
                  {speakingId !== null && <span className="speaking-ring" />}
                </div>
                <div>
                  <strong>
                    {t.character.name} <span className="online-dot" />
                  </strong>
                  <span>{t.character.role}</span>
                </div>
                <span className="chat-lock"><LockKeyhole size={14} /> {t.chat.sessionPrivate}</span>
              </div>

              <div className="chat-body" ref={chatBodyRef}>
                {messages.map((message) => (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={message.id} className={`message ${message.role === 'user' ? 'user-message' : ''}`}>
                    {message.role === 'assistant' && (
                      <div className="message-label">
                        {t.common.brand} {message.area && <span>{message.area}</span>}
                        {message.streaming && <span className="label-typing">{t.chat.typingText}</span>}
                      </div>
                    )}
                    <p>
                      {message.text}
                      {message.streaming && <span className="caret" />}
                    </p>
                    {message.role === 'assistant' && !message.streaming && message.text && (
                      <button className={`voice-btn ${speakingId === message.id ? 'is-speaking' : ''}`} onClick={() => handleVoiceClick(message)}>
                        {speakingId === message.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        <span>{speakingId === message.id ? t.chat.stopBtn : t.chat.listenBtn}</span>
                      </button>
                    )}
                  </motion.div>
                ))}

                {phase === 'thinking' && (
                  <motion.div className="message typing-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="message-label">{t.common.brand} <span>{t.chat.thinkingText}</span></div>
                    <div className="typing-dots"><i /><i /><i /></div>
                  </motion.div>
                )}

                {used >= MAX_QUESTIONS && (
                  <button className="limit-card" onClick={() => setShowPricing(true)}>
                    <Sparkles size={16} />
                    <span>
                      <strong>{t.chat.limitReachedTitle}</strong>
                      <small>{t.chat.limitReachedSub}</small>
                    </span>
                    <ArrowUpRight size={16} />
                  </button>
                )}
              </div>

              <div className="composer">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) ask() }}
                  placeholder={phase === 'thinking' ? t.chat.thinkingPlaceholder : phase === 'writing' ? t.chat.writingPlaceholder : t.chat.inputPlaceholder}
                  aria-label={t.chat.inputPlaceholder}
                />
                <button onClick={() => ask()} disabled={phase !== 'idle'} className={phase !== 'idle' ? 'is-busy' : ''} aria-label={t.chat.sendBtn}>
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <div className="disclaimer">
                <CircleHelp size={13} /> {t.legalDisclaimer.chatbotFooter}
              </div>
            </div>
          </div>
        </section>

        {/* ——— Agendar cita presencial ——— */}
        <section className="booking-section" id="agendar">
          <div className="section-label">{t.booking.sectionLabel}</div>
          <div className="booking-grid">
            <div className="booking-info">
              <p className="kicker">{t.booking.kicker}</p>
              <h2>{t.booking.heading1}<br /><em>{t.booking.heading2}</em></h2>
              <p>{t.booking.description}</p>
              <ul className="booking-perks">
                {t.booking.perks.map((p, i) => <li key={i}><CheckCircle2 size={15} /> {p}</li>)}
              </ul>
              <div className="booking-meta">
                <span><Clock size={13} /> {t.booking.schedule}</span>
                <span><Phone size={13} /> {t.booking.phone}</span>
              </div>
            </div>

            <div className="booking-form-card">
              {apptStatus === 'done' ? (
                <div className="form-success">
                  <div className="form-success-icon"><CalendarDays size={28} /></div>
                  <h3>{t.booking.successTitle}</h3>
                  <p>{t.booking.successMsg}</p>
                  <button className="form-reset-btn" onClick={() => { setApptStatus('idle'); setApptForm({ name: '', phone: '', date: '', time: '', reason: '', consent: false }) }}>
                    {t.booking.resetBtn}
                  </button>
                </div>
              ) : (
                <form className="booking-form" onSubmit={submitAppt} id="form-agendar">
                  <div className="form-header"><CalendarDays size={16} /><span>{t.booking.formTitle}</span></div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="appt-name"><User size={12} /> {t.booking.nameLabel}</label>
                      <input id="appt-name" type="text" placeholder={t.booking.namePlaceholder} value={apptForm.name} onChange={e => setApptForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-field">
                      <label htmlFor="appt-phone"><Phone size={12} /> {t.booking.phoneLabel}</label>
                      <input id="appt-phone" type="tel" placeholder={t.booking.phonePlaceholder} value={apptForm.phone} onChange={e => setApptForm(f => ({ ...f, phone: e.target.value }))} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="appt-date"><CalendarDays size={12} /> {t.booking.dateLabel}</label>
                      <input id="appt-date" type="date" min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} value={apptForm.date} onChange={e => setApptForm(f => ({ ...f, date: e.target.value }))} required />
                    </div>
                    <div className="form-field">
                      <label htmlFor="appt-time"><Clock size={12} /> {t.booking.timeLabel}</label>
                      <select id="appt-time" value={apptForm.time} onChange={e => setApptForm(f => ({ ...f, time: e.target.value }))} required>
                        <option value="">{t.booking.timeDefault}</option>
                        {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot} hrs</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="appt-reason"><FileText size={12} /> {t.booking.reasonLabel}</label>
                    <textarea id="appt-reason" placeholder={t.booking.reasonPlaceholder} rows={3} value={apptForm.reason} onChange={e => setApptForm(f => ({ ...f, reason: e.target.value }))} />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="consent-checkbox-wrap">
                    <label htmlFor="appt-consent" className="consent-label">
                      <input id="appt-consent" type="checkbox" checked={apptForm.consent} onChange={e => setApptForm(f => ({ ...f, consent: e.target.checked }))} required />
                      <span>{t.legalDisclaimer.consentCheck} <button type="button" className="inline-legal-link" onClick={() => setActiveLegalDoc('tratamiento')}>{t.legalDisclaimer.dataPolicyLink}</button>.</span>
                    </label>
                  </div>

                  <button type="submit" className={`form-submit-btn ${apptStatus === 'sending' ? 'is-loading' : ''}`} disabled={apptStatus === 'sending' || !apptForm.consent}>
                    {apptStatus === 'sending' ? t.booking.submittingBtn : <>{t.booking.submitBtn} <ArrowUpRight size={16} /></>}
                  </button>
                  <p className="form-note"><LockKeyhole size={11} /> {t.booking.privacyNote}</p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ——— Cotización ——— */}
        <section className="quote-section" id="cotizacion">
          <div className="section-label">{t.quote.sectionLabel}</div>
          <div className="quote-grid">
            <div className="quote-form-card">
              {quoteStatus === 'done' ? (
                <div className="form-success">
                  <div className="form-success-icon quote-success-icon"><DollarSign size={28} /></div>
                  <h3>{t.quote.successTitle}</h3>
                  <div className="quote-result">
                    <span className="quote-result-label">{t.quote.successPriceLabel}</span>
                    <span className="quote-result-price">{quotedPrice}</span>
                  </div>
                  <p>{t.quote.successMsg}</p>
                  <button className="form-reset-btn" onClick={() => { setQuoteStatus('idle'); setQuoteForm({ name: '', phone: '', caseType: '', description: '', urgency: 'normal', consent: false }) }}>
                    {t.quote.resetBtn}
                  </button>
                </div>
              ) : (
                <form className="booking-form" onSubmit={submitQuote} id="form-cotizacion">
                  <div className="form-header"><DollarSign size={16} /><span>{t.quote.formTitle}</span></div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="quote-name"><User size={12} /> {t.quote.nameLabel}</label>
                      <input id="quote-name" type="text" placeholder={t.quote.namePlaceholder} value={quoteForm.name} onChange={e => setQuoteForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-field">
                      <label htmlFor="quote-phone"><Phone size={12} /> {t.quote.phoneLabel}</label>
                      <input id="quote-phone" type="tel" placeholder={t.quote.phonePlaceholder} value={quoteForm.phone} onChange={e => setQuoteForm(f => ({ ...f, phone: e.target.value }))} required />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="quote-type"><Scale size={12} /> {t.quote.caseTypeLabel}</label>
                    <select id="quote-type" value={quoteForm.caseType} onChange={e => setQuoteForm(f => ({ ...f, caseType: e.target.value }))} required>
                      <option value="">{t.quote.caseTypeDefault}</option>
                      {t.quote.caseTypes.map(c => {
                        const priceVal = regionCode === 'CO' ? c.baseCOP : c.baseUSD
                        const formatted = priceVal > 0 ? formatCurrency(priceVal, regionCode) : 'A consultar'
                        return <option key={c.value} value={c.value}>{c.label} — {formatted}</option>
                      })}
                    </select>
                  </div>

                  <div className="form-field">
                    <label><Clock size={12} /> {t.quote.urgencyLabel}</label>
                    <div className="urgency-options">
                      {t.quote.urgencyOpts.map(opt => (
                        <label key={opt.value} className={`urgency-opt ${quoteForm.urgency === opt.value ? 'selected' : ''}`}>
                          <input type="radio" name="urgency" value={opt.value} checked={quoteForm.urgency === opt.value} onChange={e => setQuoteForm(f => ({ ...f, urgency: e.target.value }))} />
                          <span className="urgency-label">{opt.label}</span>
                          <span className="urgency-sub">{opt.sub}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="quote-desc"><FileText size={12} /> {t.quote.descLabel}</label>
                    <textarea id="quote-desc" placeholder={t.quote.descPlaceholder} rows={4} value={quoteForm.description} onChange={e => setQuoteForm(f => ({ ...f, description: e.target.value }))} />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="consent-checkbox-wrap">
                    <label htmlFor="quote-consent" className="consent-label">
                      <input id="quote-consent" type="checkbox" checked={quoteForm.consent} onChange={e => setQuoteForm(f => ({ ...f, consent: e.target.checked }))} required />
                      <span>{t.legalDisclaimer.consentCheck} <button type="button" className="inline-legal-link" onClick={() => setActiveLegalDoc('tratamiento')}>{t.legalDisclaimer.dataPolicyLink}</button>.</span>
                    </label>
                  </div>

                  <button type="submit" className={`form-submit-btn ${quoteStatus === 'sending' ? 'is-loading' : ''}`} disabled={quoteStatus === 'sending' || !quoteForm.consent}>
                    {quoteStatus === 'sending' ? t.quote.submittingBtn : <>{t.quote.submitBtn} <ArrowUpRight size={16} /></>}
                  </button>
                  <p className="form-note"><LockKeyhole size={11} /> {t.quote.freeNote}</p>
                </form>
              )}
            </div>

            <div className="quote-info">
              <p className="kicker">{t.quote.transparencyTitle}</p>
              <h2>{t.quote.heading1}<br /><em>{t.quote.heading2}</em></h2>
              <p>{t.quote.transparencyDesc}</p>
              <div className="price-table">
                {t.quote.caseTypes.filter(c => c.value !== 'otro').map(c => {
                  const val = regionCode === 'CO' ? c.baseCOP : c.baseUSD
                  return (
                    <div key={c.value} className="price-row">
                      <span>{c.label}</span>
                      <strong>{formatCurrency(val, regionCode)}</strong>
                    </div>
                  )
                })}
              </div>
              <p className="price-disclaimer"><CircleHelp size={12} /> {t.quote.disclaimer}</p>
            </div>
          </div>
        </section>

        {/* ——— Rediseño Modal de cobro (Checkout Modal) ——— */}
        <AnimatePresence>
          {showPricing && (
            <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPricing(false)}>
              <motion.div className="pricing-modal premium-checkout-modal" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onClick={(event) => event.stopPropagation()}>
                <button className="close-modal" onClick={() => setShowPricing(false)} aria-label={t.checkoutModal.close}>
                  <X />
                </button>

                <div className="modal-top-header">
                  <div className="pricing-lawyer-head">
                    <Image src="/dr-alejandro-vargas.jpg" alt={t.character.name} width={52} height={52} className="pricing-lawyer-img" />
                    <div>
                      <strong>{t.character.name}</strong>
                      <span>{t.common.brand} — {t.checkoutModal.eyebrow}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-body-content">
                  <span className="eyebrow"><Sparkles size={13} /> {t.checkoutModal.eyebrow}</span>
                  <h2>{t.checkoutModal.title1}<br /><em>{t.checkoutModal.title2}</em></h2>
                  <p>{t.checkoutModal.subtitle}</p>

                  <div className="region-picker-box">
                    <label>{t.checkoutModal.regionLabel}:</label>
                    <select value={regionCode} onChange={e => setRegionCode(e.target.value as RegionCode)}>
                      {Object.values(REGIONS).map(r => (
                        <option key={r.code} value={r.code}>{r.countryName} — {r.priceFormatted}</option>
                      ))}
                    </select>
                  </div>

                  <div className="price-display-card">
                    <div className="price">
                      <strong>{formatCurrency(REGIONS[regionCode].monthlyPrice, regionCode)}</strong>
                      <span>/ mes</span>
                    </div>
                    <p className="price-subtext">{t.checkoutModal.priceNote}</p>
                  </div>

                  <ul className="checkout-perks-list">
                    {t.checkoutModal.perks.map((perk, idx) => (
                      <li key={idx}><Check size={15} /> {perk}</li>
                    ))}
                  </ul>

                  <button className="primary-button full checkout-cta-btn" onClick={checkout} disabled={checkoutLoading}>
                    {checkoutLoading ? t.checkoutModal.processing : <>{t.checkoutModal.cta} <ArrowUpRight size={16} /></>}
                  </button>
                  <small className="secure-note"><LockKeyhole size={12} /> {t.checkoutModal.secureNote}</small>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <LegalFooter lang={lang} onOpenDoc={(doc) => setActiveLegalDoc(doc)} />
      <CookiesConsent lang={lang} onOpenDoc={(doc) => setActiveLegalDoc(doc)} />

      <AnimatePresence>
        {activeLegalDoc && <LegalDocModal key={activeLegalDoc} doc={activeLegalDoc} lang={lang} onClose={() => setActiveLegalDoc(null)} />}
      </AnimatePresence>
    </>
  )
}

export default function Page() {
  return <App />
}
