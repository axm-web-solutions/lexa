'use client'

import { CookiesConsent, LegalFooter } from '@/components/legal-info'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, CalendarDays, Check, CheckCircle2, ChevronRight, CircleHelp, Clock, DollarSign, FileText, Gavel, LockKeyhole, Menu, Phone, Scale, ShieldCheck, Sparkles, User, Volume2, VolumeX, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

// ——— Tipos de caso para cotización ———
const CASE_TYPES = [
  { value: 'penal', label: 'Derecho Penal', price: 'Desde $150.000' },
  { value: 'civil', label: 'Derecho Civil', price: 'Desde $120.000' },
  { value: 'laboral', label: 'Derecho Laboral', price: 'Desde $130.000' },
  { value: 'familia', label: 'Derecho de Familia', price: 'Desde $100.000' },
  { value: 'inmobiliario', label: 'Derecho Inmobiliario', price: 'Desde $140.000' },
  { value: 'sucesiones', label: 'Sucesiones y Herencias', price: 'Desde $110.000' },
  { value: 'empresarial', label: 'Derecho Empresarial', price: 'Desde $200.000' },
  { value: 'otro', label: 'Otro / No sé', price: 'A consultar' },
]

// Horarios disponibles
const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

type ApptForm = { name: string; phone: string; date: string; time: string; reason: string }
type QuoteForm = { name: string; phone: string; caseType: string; description: string; urgency: string }
type FormStatus = 'idle' | 'sending' | 'done'

// ——— Diccionario jurídico ampliado con respuestas humanas ———
const dictionary = [
  {
    keywords: ['fotos', 'imagen', 'publicar', 'sin consentimiento', 'foto mía'],
    title: 'Uso no autorizado de imagen',
    answer: 'Entiendo lo difícil que puede ser esta situación. Que alguien publique fotos tuyas sin tu permiso vulnera directamente tu derecho a la imagen y a la intimidad, protegido en casi todos los ordenamientos jurídicos latinoamericanos. Lo primero que debes hacer es hacer capturas de pantalla con fecha y hora visible, guardar los enlaces exactos y, si hay mensajes relacionados, conservarlos también. Luego envía una solicitud escrita al usuario o a la plataforma para que retire el contenido. Si la persona se niega o el contenido es íntimo, esto puede constituir un delito. En ese caso, es fundamental que acudas a las autoridades con toda la evidencia reunida. ¿Quieres que te oriente sobre cómo proceder en un país específico?',
    area: 'Privacidad · Derecho Penal'
  },
  {
    keywords: ['amenaza', 'amenazas', 'intimidación', 'me está amenazando'],
    title: 'Amenazas e intimidación',
    answer: 'Esto es serio y quiero que lo tomes con la calma que merece pero también con la firmeza necesaria. Las amenazas son un delito cuando anuncian un daño serio, creíble e inminente. Lo más importante ahora mismo: guarda todos los mensajes, audios o capturas con fecha y hora, apunta los números de teléfono o usuarios involucrados, y si hay testigos, anótalos. Evita responder con agresividad; eso puede complicar tu posición. Una vez tengas todo documentado, preséntate a la autoridad competente —policía o fiscalía según tu país— y lleva toda la evidencia. No esperes a que la situación escale. ¿Tienes ya alguna documentación reunida?',
    area: 'Derecho Penal · Seguridad'
  },
  {
    keywords: ['contrato', 'incumplimiento', 'no me pagaron', 'no cumplió'],
    title: 'Incumplimiento de contrato',
    answer: 'Comprendo tu frustración; un incumplimiento contractual puede generar no solo pérdidas económicas sino también mucho estrés. El primer paso es revisar con cuidado el contrato: ¿qué obligaciones establecía cada parte?, ¿había fechas límite?, ¿existe alguna cláusula de penalización por incumplimiento? Una vez claro eso, reúne todos los comprobantes de pago, correos, mensajes y comunicaciones que prueban que tú cumpliste tu parte. Luego envía un requerimiento formal y por escrito dando un plazo razonable para que la otra parte cumpla. Si persiste el incumplimiento, tendrás una base sólida para una demanda civil. La jurisdicción y el tipo de contrato cambian la estrategia, así que si quieres profundizar, dime más detalles.',
    area: 'Derecho Civil · Contratos'
  },
  {
    keywords: ['despido', 'me despidieron', 'trabajo', 'laboral', 'empleador'],
    title: 'Despido y derechos laborales',
    answer: 'Entiendo que perder el trabajo de forma inesperada es muy difícil, tanto emocionalmente como económicamente. Lo que debes saber primero es si el despido fue con justa causa o sin ella, porque eso cambia completamente tus derechos. Si no te dieron una causa válida por escrito o la causa no está contemplada en la ley laboral de tu país, probablemente tengas derecho a indemnización. Revisa tu contrato y guarda todo: carta de despido, liquidación, mensajes y cualquier comunicación con el empleador. También es importante que reclames tus prestaciones completas —vacaciones pendientes, primas, cesantías según aplique— dentro de los plazos legales. ¿Tienes el documento de despido? Eso me ayuda a orientarte mejor.',
    area: 'Derecho Laboral'
  },
  {
    keywords: ['divorcio', 'separación', 'matrimonio', 'me quiero separar'],
    title: 'Divorcio y separación',
    answer: 'Es una decisión difícil y entiendo que quieras entender bien tus opciones antes de dar cualquier paso. En términos generales, hay dos tipos de divorcio: el de mutuo acuerdo, que es más rápido y menos costoso cuando ambas partes están de acuerdo en los términos; y el contencioso, cuando no hay acuerdo sobre hijos, bienes o alimentos. Lo más urgente es que identifiques si tienen bienes en común, si hay hijos menores y qué régimen económico rige su matrimonio. Con esa información, un abogado puede trazar el camino más conveniente. ¿Hay hijos o bienes que necesiten ser repartidos? Eso define bastante el proceso.',
    area: 'Derecho de Familia'
  },
  {
    keywords: ['herencia', 'testamento', 'sucesión', 'bienes de un familiar'],
    title: 'Herencia y sucesión',
    answer: 'Los temas de herencia suelen surgir en momentos de mucho dolor, y entiendo que quieras claridad. Si el fallecido dejó testamento válido, el proceso de sucesión sigue lo que en él se establece, respetando siempre las porciones que la ley reserva a los herederos forzosos —hijos, cónyuge y a veces padres. Sin testamento, entra la sucesión intestada: la ley determina quién hereda y en qué proporción. En cualquier caso, el proceso requiere un trámite notarial o judicial para transferir los bienes. Reúne el registro de defunción, los títulos de propiedad o cuentas existentes, y los documentos que acrediten el parentesco. ¿Hay testamento o no lo hay en este caso?',
    area: 'Derecho Sucesorio'
  },
  {
    keywords: ['acoso', 'hostigamiento', 'me acosan', 'bullying', 'matoneo'],
    title: 'Acoso y hostigamiento',
    answer: 'Lo que describes es una situación que merece atención inmediata y no debes enfrentarla solo. El acoso —ya sea laboral, escolar o en redes sociales— tiene consecuencias legales para quien lo ejerce. Lo más importante ahora mismo es documentar todo: guarda capturas, mensajes, correos y cualquier evidencia con fecha. Si ocurre en un entorno laboral, debes presentar una queja formal ante recursos humanos o, si no hay respuesta, ante la autoridad laboral competente. Si es en un contexto escolar, la dirección del centro y los padres deben ser informados, y en casos graves la policía. No minimices lo que sientes ni lo que estás viviendo. ¿Dónde está ocurriendo el acoso?',
    area: 'Derecho Penal · Laboral'
  },
  {
    keywords: ['accidente', 'choque', 'tránsito', 'atropello', 'colisión'],
    title: 'Accidente de tránsito',
    answer: 'Espero que estés bien. Después de un accidente de tránsito, los primeros pasos son fundamentales. Primero, asegúrate de que todos estén a salvo y llama a emergencias si hay heridos. Luego llama a la policía de tránsito —aunque el accidente parezca menor— porque el informe oficial es clave para cualquier reclamación. Fotografía la escena, los daños a los vehículos, las placas y cualquier señal relevante. Recaba los datos del otro conductor: nombre, cédula, placa, seguro. No firmes ningún documento ni aceptes acuerdos en el lugar sin leerlos con calma. ¿El accidente fue hoy o ya pasó un tiempo?',
    area: 'Derecho Civil · Seguros'
  },
  {
    keywords: ['deuda', 'cobro', 'deudor', 'me deben dinero', 'préstamo'],
    title: 'Cobro de deudas',
    answer: 'Entiendo lo frustrante que es tener dinero prestado que no te devuelven. Si hay un pagaré, contrato o comprobante de la deuda, estás en una posición mucho más fuerte legalmente. Con eso puedes iniciar un proceso ejecutivo civil para reclamar el pago de forma judicial. Si no hay documento formal, aun así hay opciones: mensajes, transferencias bancarias o testigos pueden servir como prueba. El primer paso recomendado es siempre una carta formal de cobro dando un plazo de 10 a 15 días; esto crea un registro y a veces resuelve el problema sin necesidad de ir a tribunales. ¿Tienes algún documento que respalde la deuda?',
    area: 'Derecho Civil · Financiero'
  },
  {
    keywords: ['robo', 'hurto', 'me robaron', 'me quitaron', 'ladrón'],
    title: 'Robo o hurto',
    answer: 'Lamento mucho que hayas pasado por eso. Lo primero y más urgente es presentar la denuncia ante la policía o fiscalía lo antes posible —dentro de las primeras horas si es posible, ya que esto facilita la investigación. Describe con detalle lo que ocurrió: hora, lugar, descripción del autor si lo viste, bienes sustraídos con su valor aproximado. Guarda cualquier prueba: cámaras cercanas, testigos, recibos de los bienes robados. Si fue con violencia o amenaza de arma, el delito es más grave y la penalidad para el autor es mayor. Para el seguro, si tienes, el reporte policial es indispensable. ¿Ya presentaste la denuncia?',
    area: 'Derecho Penal'
  },
  {
    keywords: ['arrendamiento', 'arrendador', 'inquilino', 'alquiler', 'arriendo'],
    title: 'Arrendamiento e inquilinato',
    answer: 'Los conflictos entre arrendadores e inquilinos son muy comunes y tienen un marco legal claro en la mayoría de países. Si eres inquilino y te quieren sacar sin seguir el procedimiento legal, tienes derechos: generalmente el arrendador debe darte un preaviso por escrito con un tiempo mínimo establecido por ley y solo puede pedirte que salgas por causas justificadas. Si eres arrendador y el inquilino no paga o daña el inmueble, existe el proceso de restitución de inmueble. En cualquier caso, revisa el contrato de arrendamiento —su vigencia, causales de terminación y obligaciones— porque es el documento base. ¿Eres tú el arrendador o el inquilino?',
    area: 'Derecho Civil · Inmobiliario'
  },
  {
    keywords: ['violencia', 'maltrato', 'golpes', 'violencia doméstica', 'agresión'],
    title: 'Violencia doméstica o familiar',
    answer: 'Ante todo quiero que sepas que lo que describes es inaceptable y que tienes derechos que te protegen. La violencia doméstica es un delito en todos los países de la región y existen mecanismos legales diseñados para protegerte. Lo primero es tu seguridad: si estás en peligro inmediato, llama a la línea de emergencias. Si puedes, busca atención médica y pide que quede constancia de las lesiones. Luego denuncia ante la fiscalía, comisaría de familia o autoridad competente según tu país; allí pueden dictar medidas de protección —como orden de alejamiento— de forma rápida. No estás solo o sola en esto. ¿Estás en un lugar seguro ahora mismo?',
    area: 'Derecho Penal · Familia'
  },
]

// Respuestas de fallback cuando no hay coincidencia de keywords
const fallbackAnswers = [
  'Entiendo que tu situación es importante y merece una respuesta adecuada. Para orientarte con precisión, necesitaría un poco más de contexto sobre lo que está ocurriendo. ¿Puedes contarme más detalles? Por ejemplo: ¿qué pasó exactamente?, ¿hay documentos de por medio?, ¿cuándo ocurrió? Con esa información puedo darte una orientación mucho más útil.',
  'Gracias por contarme tu caso. Esta situación puede tener varias aristas legales y quiero asegurarme de orientarte en la dirección correcta. Para hacerlo bien, cuéntame: ¿estás buscando reclamar algo, defenderte de algo o simplemente entender tus derechos? Mientras más detalles me das, mejor puedo ayudarte.',
  'Tu consulta me parece relevante y quiero tomármela con la seriedad que merece. Para darte la orientación más precisa posible, ayúdame con más detalles: ¿en qué país estás? ¿Hay otras personas involucradas? ¿Ya tomaste alguna acción previa? Eso me permitirá orientarte de forma mucho más concreta.',
]

type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
  area?: string
  streaming?: boolean
}
type ChatPhase = 'idle' | 'thinking' | 'writing'

// ——— Hook TTS (Web Speech API) ———
function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [speakingId, setSpeakingId] = useState<number | null>(null)

  const speak = useCallback((text: string, id: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'es-419'
    utter.rate = 0.95
    utter.pitch = 1.0

    // Preferir voz en español
    const voices = window.speechSynthesis.getVoices()
    const esVoice =
      voices.find((v) => v.lang.startsWith('es') && v.lang.includes('419')) ||
      voices.find((v) => v.lang.startsWith('es-MX')) ||
      voices.find((v) => v.lang.startsWith('es-ES')) ||
      voices.find((v) => v.lang.startsWith('es'))
    if (esVoice) utter.voice = esVoice

    utter.onstart = () => setSpeakingId(id)
    utter.onend = () => setSpeakingId(null)
    utter.onerror = () => setSpeakingId(null)
    utteranceRef.current = utter
    window.speechSynthesis.speak(utter)
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
    }
  }, [])

  return { speak, stop, speakingId }
}

// ——— Componente foto abogado en hero ———
function LawyerHeroPhoto() {
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
          alt="Dr. Alejandro Vargas — Abogado"
          width={340}
          height={340}
          className="lawyer-photo-img"
          priority
        />
        <div className="lawyer-photo-glow" />
      </div>
      <div className="lawyer-hero-badge">
        <span className="status-dot" />
        <span>Disponible ahora</span>
      </div>
      <div className="lawyer-hero-name">
        <strong>Dr. Alejandro Vargas</strong>
        <span>Derecho Penal · Civil · Familia</span>
      </div>
    </motion.div>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: 'Buen día, soy el Dr. Alejandro Vargas. Estoy aquí para orientarte en asuntos de derecho penal, civil, laboral y de familia. Cuéntame con confianza, ¿qué situación estás enfrentando?',
      area: 'Orientación inicial',
    },
  ])
  const [used, setUsed] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  // Appointment form state
  const [apptForm, setApptForm] = useState<ApptForm>({ name: '', phone: '', date: '', time: '', reason: '' })
  const [apptStatus, setApptStatus] = useState<FormStatus>('idle')

  // Quote form state
  const [quoteForm, setQuoteForm] = useState<QuoteForm>({ name: '', phone: '', caseType: '', description: '', urgency: 'normal' })
  const [quoteStatus, setQuoteStatus] = useState<FormStatus>('idle')
  const [quotedPrice, setQuotedPrice] = useState('')

  const submitAppt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!apptForm.name || !apptForm.phone || !apptForm.date || !apptForm.time) return
    setApptStatus('sending')
    setTimeout(() => setApptStatus('done'), 1800)
  }

  const submitQuote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quoteForm.name || !quoteForm.phone || !quoteForm.caseType) return
    setQuoteStatus('sending')
    const found = CASE_TYPES.find(c => c.value === quoteForm.caseType)
    const basePrice = found?.price ?? 'A consultar'
    const urgencyMultiplier = quoteForm.urgency === 'urgent' ? ' (urgente +30%)' : quoteForm.urgency === 'express' ? ' (express +60%)' : ''
    setQuotedPrice(basePrice + urgencyMultiplier)
    setTimeout(() => setQuoteStatus('done'), 2000)
  }
  const [showPricing, setShowPricing] = useState(false)
  const [phase, setPhase] = useState<ChatPhase>('idle')
  const timers = useRef<number[]>([])
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const { speak, stop, speakingId } = useSpeech()

  const MAX_QUESTIONS = 7

  useEffect(() => () => { timers.current.forEach((timer) => window.clearTimeout(timer)) }, [])

  useEffect(() => {
    const node = chatBodyRef.current
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' })
  }, [messages, phase])

  // Resume videos
  useEffect(() => {
    const media = document.querySelector('.courtroom-media')
    const clips = Array.from(media?.querySelectorAll('video') ?? []) as HTMLVideoElement[]
    const resume = () => { clips.forEach((clip) => { if (clip.paused) void clip.play().catch(() => undefined) }) }
    resume()
    document.addEventListener('visibilitychange', resume)
    window.addEventListener('focus', resume)
    return () => { document.removeEventListener('visibilitychange', resume); window.removeEventListener('focus', resume) }
  }, [])

  const queue = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay))
  }

  // Escritura por rachas
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
      entry.keywords.some((keyword) => normalized.includes(keyword))
    )

    const answer = match
      ? match.answer
      : fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)]

    const area = match?.area ?? 'Orientación general'

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
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'lexa-plus-monthly' }),
    })
    const data = await response.json()
    if (data.url) window.location.href = data.url
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
        <video
          className="courtroom-video video-judge"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/courtroom-poster-judge.jpg"
        >
          <source src="/courtroom-judge.mp4" type="video/mp4" />
        </video>
        <video
          className="courtroom-video video-gavel"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/courtroom-poster.jpg"
        >
          <source src="/courtroom-gavel.mp4" type="video/mp4" />
        </video>
        <div className="courtroom-grain" />
      </div>
      <div className="courtroom-overlay" aria-hidden="true" />

      <main className="app-shell">
        {/* ——— Navbar ——— */}
        <nav className="topbar">
          <a className="brand" href="#inicio">
            <span className="brand-mark">
              <Scale size={17} strokeWidth={1.5} />
            </span>
            <span>LEXA</span>
          </a>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#consulta">Consulta</a>
            <a href="#agendar">Agendar cita</a>
            <a href="#cotizacion">Cotización</a>
            <button className="nav-cta" onClick={() => setShowPricing(true)}>
              Ver planes <ArrowUpRight size={15} />
            </button>
          </div>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* ——— Hero ——— */}
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
              <span className="status-dot" /> Consultoría legal privada y personal
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Habla con tu<br />
              <em>abogado ahora.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              El Dr. Alejandro Vargas te orienta de forma directa, en lenguaje claro, sin tecnicismos. Hasta 7 preguntas gratuitas. Respuestas escritas y en voz.
            </motion.p>
            <div className="hero-actions">
              <a href="#consulta" className="primary-button">
                Iniciar consulta <ChevronRight size={16} />
              </a>
              <a href="#como-funciona" className="text-button">
                Cómo funciona <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="trust-row">
              <span><ShieldCheck size={15} /> Privado por diseño</span>
              <span><BookOpen size={15} /> Respuestas en voz y texto</span>
            </div>
          </div>
          <LawyerHeroPhoto />
        </section>

        {/* ——— Consulta ——— */}
        <section className="consultation" id="consulta">
          <div className="section-label">01 / Tu consulta</div>
          <div className="consultation-grid">
            <div className="intro-panel">
              <p className="kicker">Habla con el Dr. Vargas</p>
              <h2>
                Tu pregunta merece<br />
                <span>una respuesta clara.</span>
              </h2>
              <p>
                Describe los hechos con tus propias palabras. El Dr. Vargas te orienta sobre el camino legal más adecuado, sin tecnicismos y con empatía.
              </p>
              <div className="usage">
                <div>
                  <span>Consultas disponibles</span>
                  <strong>
                    {Math.max(0, MAX_QUESTIONS - used)} <small>/ {MAX_QUESTIONS}</small>
                  </strong>
                </div>
                <div className="usage-bar">
                  <span style={{ width: `${Math.min(100, (used / MAX_QUESTIONS) * 100)}%` }} />
                </div>
              </div>

              {/* Foto del abogado en el panel */}
              <div className="lawyer-panel-photo">
                <Image
                  src="/dr-alejandro-vargas.jpg"
                  alt="Dr. Alejandro Vargas"
                  width={56}
                  height={56}
                  className="lawyer-panel-img"
                />
                <div>
                  <strong>Dr. Alejandro Vargas</strong>
                  <span>Abogado litigante · 15 años de experiencia</span>
                </div>
              </div>
            </div>

            {/* ——— Chat Card ——— */}
            <div className="chat-card">
              <div className="chat-header">
                <div className={`lawyer-avatar-wrap ${speakingId !== null ? 'speaking' : ''}`}>
                  <Image
                    src="/dr-alejandro-vargas.jpg"
                    alt="Dr. Alejandro Vargas"
                    width={38}
                    height={38}
                    className="lawyer-avatar-img"
                  />
                  {speakingId !== null && <span className="speaking-ring" />}
                </div>
                <div>
                  <strong>
                    Dr. Alejandro Vargas <span className="online-dot" />
                  </strong>
                  <span>Abogado · En consulta</span>
                </div>
                <span className="chat-lock">
                  <LockKeyhole size={14} /> Sesión privada
                </span>
              </div>

              {/* Messages */}
              <div className="chat-body" ref={chatBodyRef}>
                {messages.map((message) => (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={message.id}
                    className={`message ${message.role === 'user' ? 'user-message' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="message-label">
                        Dr. Vargas{' '}
                        {message.area && <span>{message.area}</span>}
                        {message.streaming && <span className="label-typing">escribiendo…</span>}
                      </div>
                    )}
                    <p>
                      {message.text}
                      {message.streaming && <span className="caret" />}
                    </p>
                    {/* Botón de voz — solo en mensajes del asistente que ya terminaron */}
                    {message.role === 'assistant' && !message.streaming && message.text && (
                      <button
                        className={`voice-btn ${speakingId === message.id ? 'is-speaking' : ''}`}
                        onClick={() => handleVoiceClick(message)}
                        aria-label={speakingId === message.id ? 'Detener audio' : 'Escuchar respuesta'}
                        title={speakingId === message.id ? 'Detener' : 'Escuchar'}
                      >
                        {speakingId === message.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        <span>{speakingId === message.id ? 'Detener' : 'Escuchar'}</span>
                      </button>
                    )}
                  </motion.div>
                ))}

                {phase === 'thinking' && (
                  <motion.div
                    className="message typing-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="message-label">
                      Dr. Vargas <span>está pensando</span>
                    </div>
                    <div className="typing-dots" aria-label="El doctor está pensando">
                      <i /><i /><i />
                    </div>
                  </motion.div>
                )}

                {used >= MAX_QUESTIONS && (
                  <button className="limit-card" onClick={() => setShowPricing(true)}>
                    <Sparkles size={16} />
                    <span>
                      <strong>Has usado tus {MAX_QUESTIONS} consultas gratuitas.</strong>
                      <small>Continúa con Lexa Plus para seguir conversando con el Dr. Vargas.</small>
                    </span>
                    <ArrowUpRight size={16} />
                  </button>
                )}
              </div>

              {/* Composer */}
              <div className="composer">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) ask()
                  }}
                  placeholder={
                    phase === 'thinking'
                      ? 'El Dr. Vargas está analizando tu caso…'
                      : phase === 'writing'
                        ? 'El Dr. Vargas te está respondiendo…'
                        : 'Cuéntame tu situación...'
                  }
                  aria-label="Escribe tu consulta legal"
                />
                <button
                  onClick={() => ask()}
                  disabled={phase !== 'idle'}
                  className={phase !== 'idle' ? 'is-busy' : ''}
                  aria-label="Enviar consulta"
                >
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <div className="disclaimer">
                <CircleHelp size={13} /> El Dr. Vargas ofrece orientación general y no sustituye la asesoría jurídica formal.
              </div>
            </div>
          </div>
        </section>

        {/* ——— Cómo funciona ——— */}
        <section className="principles" id="como-funciona">
          <div className="section-label">02 / El método</div>
          <div className="principles-heading">
            <h2>
              La claridad también<br />
              <em>es una forma de justicia.</em>
            </h2>
            <p>
              El Dr. Vargas te ayuda a entender tu situación antes de que des el siguiente paso. Sin promesas imposibles. Solo orientación honesta y directa.
            </p>
          </div>
          <div className="principle-grid">
            <article>
              <span>01</span>
              <Gavel />
              <h3>Pregunta sin miedo</h3>
              <p>Explica tu caso con tus palabras. No necesitas conocer los términos jurídicos.</p>
            </article>
            <article>
              <span>02</span>
              <BookOpen />
              <h3>Respuesta humana</h3>
              <p>El Dr. Vargas responde en texto y puedes escuchar su respuesta en voz con un clic.</p>
            </article>
            <article>
              <span>03</span>
              <ShieldCheck />
              <h3>Da el siguiente paso</h3>
              <p>Recibe una guía clara sobre qué hacer y cuándo buscar representación legal formal.</p>
            </article>
          </div>
        </section>

        {/* ——— Agendar cita ——— */}
        <section className="booking-section" id="agendar">
          <div className="section-label">03 / Cita presencial</div>
          <div className="booking-grid">
            <div className="booking-info">
              <p className="kicker">Agenda tu consulta</p>
              <h2>
                Una reunión cara a cara<br />
                <em>marca la diferencia.</em>
              </h2>
              <p>
                Algunos casos requieren más que una orientación digital. Agenda una sesión presencial con el Dr. Vargas en nuestro consultorio y recibe asesoría personalizada y estratégica.
              </p>
              <ul className="booking-perks">
                <li><CheckCircle2 size={15} /> Sesión de 60 minutos con el Dr. Vargas</li>
                <li><CheckCircle2 size={15} /> Revisión de documentos en persona</li>
                <li><CheckCircle2 size={15} /> Estrategia legal personalizada</li>
                <li><CheckCircle2 size={15} /> Confidencialidad garantizada</li>
              </ul>
              <div className="booking-meta">
                <span><Clock size={13} /> Lun–Vie, 9:00–17:00</span>
                <span><Phone size={13} /> +57 300 123 4567</span>
              </div>
            </div>

            <div className="booking-form-card">
              {apptStatus === 'done' ? (
                <div className="form-success">
                  <div className="form-success-icon"><CalendarDays size={28} /></div>
                  <h3>¡Cita agendada!</h3>
                  <p>El Dr. Vargas te contactará a <strong>{apptForm.phone}</strong> dentro de las próximas 2 horas para confirmar tu cita del <strong>{apptForm.date}</strong> a las <strong>{apptForm.time}</strong>.</p>
                  <button className="form-reset-btn" onClick={() => { setApptStatus('idle'); setApptForm({ name: '', phone: '', date: '', time: '', reason: '' }) }}>
                    Agendar otra cita
                  </button>
                </div>
              ) : (
                <form className="booking-form" onSubmit={submitAppt} id="form-agendar">
                  <div className="form-header">
                    <CalendarDays size={16} />
                    <span>Solicitar cita presencial</span>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="appt-name"><User size={12} /> Nombre completo</label>
                      <input
                        id="appt-name"
                        type="text"
                        placeholder="Tu nombre"
                        value={apptForm.name}
                        onChange={e => setApptForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="appt-phone"><Phone size={12} /> Teléfono / WhatsApp</label>
                      <input
                        id="appt-phone"
                        type="tel"
                        placeholder="+57 300 000 0000"
                        value={apptForm.phone}
                        onChange={e => setApptForm(f => ({ ...f, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="appt-date"><CalendarDays size={12} /> Fecha preferida</label>
                      <input
                        id="appt-date"
                        type="date"
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        value={apptForm.date}
                        onChange={e => setApptForm(f => ({ ...f, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="appt-time"><Clock size={12} /> Hora preferida</label>
                      <select
                        id="appt-time"
                        value={apptForm.time}
                        onChange={e => setApptForm(f => ({ ...f, time: e.target.value }))}
                        required
                      >
                        <option value="">Selecciona hora</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t} hrs</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="appt-reason"><FileText size={12} /> Motivo de la consulta (opcional)</label>
                    <textarea
                      id="appt-reason"
                      placeholder="Describe brevemente el tema que necesitas tratar..."
                      rows={3}
                      value={apptForm.reason}
                      onChange={e => setApptForm(f => ({ ...f, reason: e.target.value }))}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`form-submit-btn ${apptStatus === 'sending' ? 'is-loading' : ''}`}
                    disabled={apptStatus === 'sending'}
                  >
                    {apptStatus === 'sending' ? (
                      <><span className="btn-spinner" /> Agendando…</>
                    ) : (
                      <>Solicitar cita <ArrowUpRight size={16} /></>
                    )}
                  </button>
                  <p className="form-note"><LockKeyhole size={11} /> Tus datos son confidenciales y nunca serán compartidos.</p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ——— Cotización ——— */}
        <section className="quote-section" id="cotizacion">
          <div className="section-label">04 / Cotización</div>
          <div className="quote-grid">
            <div className="quote-form-card">
              {quoteStatus === 'done' ? (
                <div className="form-success">
                  <div className="form-success-icon quote-success-icon"><DollarSign size={28} /></div>
                  <h3>¡Cotización generada!</h3>
                  <div className="quote-result">
                    <span className="quote-result-label">Estimado para tu caso</span>
                    <span className="quote-result-price">{quotedPrice}</span>
                  </div>
                  <p>El Dr. Vargas te enviará una cotización detallada a <strong>{quoteForm.phone}</strong> en máximo 24 horas hábiles. Este valor es una estimación; el costo final puede variar según la complejidad del caso.</p>
                  <button className="form-reset-btn" onClick={() => { setQuoteStatus('idle'); setQuoteForm({ name: '', phone: '', caseType: '', description: '', urgency: 'normal' }) }}>
                    Nueva cotización
                  </button>
                </div>
              ) : (
                <form className="booking-form" onSubmit={submitQuote} id="form-cotizacion">
                  <div className="form-header">
                    <DollarSign size={16} />
                    <span>Solicitar cotización</span>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="quote-name"><User size={12} /> Nombre completo</label>
                      <input
                        id="quote-name"
                        type="text"
                        placeholder="Tu nombre"
                        value={quoteForm.name}
                        onChange={e => setQuoteForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="quote-phone"><Phone size={12} /> Teléfono / WhatsApp</label>
                      <input
                        id="quote-phone"
                        type="tel"
                        placeholder="+57 300 000 0000"
                        value={quoteForm.phone}
                        onChange={e => setQuoteForm(f => ({ ...f, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="quote-type"><Scale size={12} /> Tipo de caso</label>
                    <select
                      id="quote-type"
                      value={quoteForm.caseType}
                      onChange={e => setQuoteForm(f => ({ ...f, caseType: e.target.value }))}
                      required
                    >
                      <option value="">Selecciona el área legal</option>
                      {CASE_TYPES.map(c => (
                        <option key={c.value} value={c.value}>{c.label} — {c.price}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label><Clock size={12} /> Urgencia del caso</label>
                    <div className="urgency-options">
                      {[
                        { value: 'normal', label: 'Normal', sub: '5–10 días hábiles' },
                        { value: 'urgent', label: 'Urgente', sub: '2–3 días (+30%)' },
                        { value: 'express', label: 'Express', sub: '24 horas (+60%)' },
                      ].map(opt => (
                        <label
                          key={opt.value}
                          className={`urgency-opt ${quoteForm.urgency === opt.value ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="urgency"
                            value={opt.value}
                            checked={quoteForm.urgency === opt.value}
                            onChange={e => setQuoteForm(f => ({ ...f, urgency: e.target.value }))}
                          />
                          <span className="urgency-label">{opt.label}</span>
                          <span className="urgency-sub">{opt.sub}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="quote-desc"><FileText size={12} /> Descripción del caso</label>
                    <textarea
                      id="quote-desc"
                      placeholder="Cuéntanos los detalles más importantes de tu situación para darte una cotización más precisa..."
                      rows={4}
                      value={quoteForm.description}
                      onChange={e => setQuoteForm(f => ({ ...f, description: e.target.value }))}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`form-submit-btn ${quoteStatus === 'sending' ? 'is-loading' : ''}`}
                    disabled={quoteStatus === 'sending'}
                  >
                    {quoteStatus === 'sending' ? (
                      <><span className="btn-spinner" /> Calculando cotización…</>
                    ) : (
                      <>Solicitar cotización <ArrowUpRight size={16} /></>
                    )}
                  </button>
                  <p className="form-note"><LockKeyhole size={11} /> Cotización sin compromiso · Sin costo</p>
                </form>
              )}
            </div>

            <div className="quote-info">
              <p className="kicker">Transparencia de precios</p>
              <h2>
                Conoce el costo<br />
                <em>antes de decidir.</em>
              </h2>
              <p>
                Creemos en la transparencia. Antes de comprometerte, recibe una estimación clara y honesta del costo de tu caso. Sin sorpresas.
              </p>
              <div className="price-table">
                {CASE_TYPES.filter(c => c.value !== 'otro').map(c => (
                  <div key={c.value} className="price-row">
                    <span>{c.label}</span>
                    <strong>{c.price}</strong>
                  </div>
                ))}
              </div>
              <p className="price-disclaimer"><CircleHelp size={12} /> Los precios son estimados en COP. El costo final se determina tras evaluar la complejidad del caso.</p>
            </div>
          </div>
        </section>

        {/* ——— Footer note ——— */}
        <section className="footer-note" id="privacidad">
          <div>
            <p className="kicker">Una orientación, no un sustituto</p>
            <h2>
              Cuando necesites estrategia,<br />
              <em>habla con un abogado.</em>
            </h2>
          </div>
          <p>
            El Dr. Vargas te ayuda a llegar mejor preparado a una consulta profesional. Esta sesión no almacena tus preguntas y no constituye una relación abogado-cliente.
          </p>
        </section>

        {/* ——— Modal de precios ——— */}
        <AnimatePresence>
          {showPricing && (
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPricing(false)}
            >
              <motion.div
                className="pricing-modal"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                onClick={(event) => event.stopPropagation()}
              >
                <button className="close-modal" onClick={() => setShowPricing(false)} aria-label="Cerrar">
                  <X />
                </button>

                <div className="pricing-lawyer-head">
                  <Image
                    src="/dr-alejandro-vargas.jpg"
                    alt="Dr. Alejandro Vargas"
                    width={52}
                    height={52}
                    className="pricing-lawyer-img"
                  />
                  <div>
                    <strong>Dr. Alejandro Vargas</strong>
                    <span>Consultas ilimitadas con Lexa Plus</span>
                  </div>
                </div>

                <span className="eyebrow">
                  <Sparkles size={13} /> LEXA PLUS
                </span>
                <h2>
                  Más claridad,<br />
                  <em>cuando la necesitas.</em>
                </h2>
                <p>
                  Continúa conversando con el Dr. Vargas con orientación ilimitada y acceso a todo el criterio jurídico.
                </p>
                <div className="price">
                  <strong>$14.99</strong>
                  <span>USD / mes</span>
                </div>
                <ul>
                  <li><Check size={15} /> Consultas ilimitadas</li>
                  <li><Check size={15} /> Respuestas en texto y en voz</li>
                  <li><Check size={15} /> Temas ampliados: penal, civil, laboral, familia</li>
                  <li><Check size={15} /> Cancela cuando quieras</li>
                </ul>
                <button className="primary-button full" onClick={checkout}>
                  Continuar con Lexa Plus <ArrowUpRight size={16} />
                </button>
                <small className="secure-note">
                  <LockKeyhole size={12} /> Pago seguro procesado por Stripe
                </small>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <LegalFooter />
      <CookiesConsent />
    </>
  )
}

export default function Page() {
  return <App />
}
