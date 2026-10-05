'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Cookie, Scale, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Language, translations } from '@/lib/i18n'

export type LegalDocId = 'aviso' | 'privacidad' | 'cookies' | 'suscripcion' | 'tratamiento'

const CONSENT_KEY = 'lexa_cookie_consent'
const OPEN_SETTINGS_EVENT = 'lexa:open-cookie-settings'

function Pending({ children }: { children: ReactNode }) {
  return <span className="legal-pending">{children}</span>
}

function AvisoLegalContent() {
  return (
    <>
      <p className="legal-doc-updated">Última actualización: octubre de 2026.</p>
      <h3>1. Identificación del titular del sitio</h3>
      <p>En cumplimiento del deber de información, se identifica al titular de este sitio web:</p>
      <ul>
        <li>Razón social o nombre completo: <Pending>{'[RAZÓN SOCIAL]'}</Pending></li>
        <li>NIF / CIF / NIT / Identificación fiscal: <Pending>{'[NIT]'}</Pending></li>
        <li>Domicilio social: <Pending>{'[DIRECCIÓN]'}</Pending></li>
        <li>Correo electrónico de contacto: <Pending>{'[EMAIL DE CONTACTO]'}</Pending></li>
        <li>Dominio del sitio: <Pending>{'[DOMINIO]'}</Pending></li>
      </ul>
      <h3>2. Objeto</h3>
      <p>Estas condiciones regulan el acceso, la navegación y el uso del sitio web Lexa. El acceso al sitio implica la aceptación de estas condiciones.</p>
      <h3>3. Naturaleza del servicio: Asistente jurídico automatizado</h3>
      <p>Lexa es una herramienta informativa y educativa de orientación automatizada. <strong>Lexa no es un despacho jurídico, ni una firma de abogados, ni ofrece representación legal.</strong> Concretamente:</p>
      <ul>
        <li>El sistema ofrece <strong>orientación e información general y educativa</strong>, nunca asesoría jurídica profesional personalizada ni dictámenes aplicables a un caso concreto.</li>
        <li>La imagen visual del Dr. Alejandro Vargas es un <strong>personaje ficticio generado mediante inteligencia artificial</strong> para facilitar la interacción de la interfaz. No representa a una persona ni abogado real en ejercicio.</li>
        <li>Lexa <strong>no sustituye al consejo ni a la consulta directa con un abogado habilitado</strong>.</li>
        <li>El uso del sistema <strong>no crea relación abogado–cliente</strong> ni encargo profesional.</li>
      </ul>
      <h3>4. Propiedad intelectual</h3>
      <p>Los textos, el diseño, la marca «Lexa», los personajes ficticios y el código del sitio pertenecen a su titular o se usan con licencia.</p>
      <h3>5. Ley aplicable y jurisdicción</h3>
      <p>Estas condiciones se rigen por la legislación colombiana (Ley 1581 de 2012) y normativa internacional aplicable según la residencia del usuario.</p>
    </>
  )
}

function PrivacidadContent() {
  return (
    <>
      <p className="legal-doc-updated">Última actualización: octubre de 2026.</p>
      <h3>1. Responsable del tratamiento</h3>
      <ul>
        <li>Responsable: <Pending>{'[RAZÓN SOCIAL]'}</Pending></li>
        <li>NIT: <Pending>{'[NIT]'}</Pending></li>
        <li>Correo para ejercer derechos (Habeas Data): <Pending>{'[EMAIL DE CONTACTO]'}</Pending></li>
      </ul>
      <h3>2. Régimen aplicable (Colombia - Ley 1581 de 2012)</h3>
      <p>El tratamiento de datos personales se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 de la República de Colombia y estándares internacionales de protección de datos.</p>
      <h3>3. Datos recopilados y minimización</h3>
      <ul>
        <li><strong>Consultas en chat:</strong> Las consultas se procesan en la sesión local. No solicitamos ni almacenamos deliberadamente datos sensibles en bases de datos públicas.</li>
        <li><strong>Formularios de Citas y Cotización:</strong> Recopilamos Nombre, Teléfono/WhatsApp y descripción del caso con el único fin de contactar al usuario y brindar la cotización o agendamiento solicitado.</li>
        <li><strong>Datos de pago:</strong> Los datos de tarjeta son procesados de forma independiente por <strong>Stripe</strong> bajo cifrado bancario. No almacenamos datos de tarjeta en nuestros servidores.</li>
      </ul>
      <h3>4. Derechos del Titular de los Datos</h3>
      <p>Como titular de los datos, tienes derecho a conocer, actualizar, rectificar y solicitar la supresión de tus datos personales, así como a revocar la autorización otorgada escribiendo a <Pending>{'[EMAIL DE CONTACTO]'}</Pending>.</p>
    </>
  )
}

function TratamientoDatosContent() {
  return (
    <>
      <p className="legal-doc-updated">Última actualización: octubre de 2026.</p>
      <h3>Política de Tratamiento de Datos Personales (Colombia)</h3>
      <p>De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013, <Pending>{'[RAZÓN SOCIAL]'}</Pending> informa a los usuarios que los datos suministrados a través de formularios o canal de contacto serán tratados para:</p>
      <ul>
        <li>Gestionar las solicitudes de cotización e información jurídica orientativa.</li>
        <li>Agendar citas presenciales o virtuales con profesionales del equipo legal.</li>
        <li>Procesar la suscripción y facturación del servicio mediante Stripe.</li>
      </ul>
      <p>Tratamos tus datos con medidas de seguridad estándar de la industria y no vendemos ni compartimos información a terceros con fines publicitarios.</p>
    </>
  )
}

function CookiesContent() {
  return (
    <>
      <p className="legal-doc-updated">Última actualización: octubre de 2026.</p>
      <h3>1. Uso de cookies y almacenamiento local</h3>
      <p>Utilizamos cookies y tecnologías de almacenamiento local estrictamente necesarias para recordar la preferencia de consentimiento del usuario y permitir el procesamiento seguro de pagos con Stripe. No empleamos cookies publicitarias ni de rastreo entre sitios.</p>
    </>
  )
}

function SuscripcionContent() {
  return (
    <>
      <p className="legal-doc-updated">Última actualización: octubre de 2026.</p>
      <h3>1. Suscripción Lexa Plus</h3>
      <p>Lexa Plus brinda consultas ilimitadas con el asistente jurídico automatizado. Los precios se ajustan según la región y moneda del usuario. La suscripción se renueva mensualmente y puede cancelarse en cualquier momento sin penalidad.</p>
    </>
  )
}

const contentByDoc: Record<LegalDocId, () => ReactNode> = {
  aviso: AvisoLegalContent,
  privacidad: PrivacidadContent,
  tratamiento: TratamientoDatosContent,
  cookies: CookiesContent,
  suscripcion: SuscripcionContent,
}

export function LegalDocModal({ doc, onClose, lang }: { doc: LegalDocId; onClose: () => void; lang: Language }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const Content = contentByDoc[doc] || AvisoLegalContent
  const t = translations[lang]

  const docTitles: Record<LegalDocId, string> = {
    aviso: t.legalDisclaimer.termsLink,
    privacidad: t.legalDisclaimer.privacyLink,
    tratamiento: t.legalDisclaimer.dataPolicyLink,
    cookies: 'Política de cookies',
    suscripcion: 'Condiciones de la suscripción Lexa Plus',
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    const previousOverflow = document.body.style.overflow
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  useEffect(() => { closeRef.current?.focus() }, [])

  return (
    <motion.div className="modal-backdrop legal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="legal-doc-modal" role="dialog" aria-modal="true" aria-labelledby="legal-doc-title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: 0.22 }} onClick={(event) => event.stopPropagation()}>
        <div className="legal-doc-head">
          <span className="eyebrow"><Scale size={13} /> Documento legal</span>
          <button ref={closeRef} className="close-modal" onClick={onClose} aria-label="Cerrar documento legal"><X /></button>
        </div>
        <h2 id="legal-doc-title">{docTitles[doc]}</h2>
        <div className="legal-doc-body"><Content /></div>
        <div className="legal-doc-foot">
          <ShieldCheck size={14} />
          <p>{t.common.automatedNote}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function LegalFooter({ lang, onOpenDoc }: { lang: Language; onOpenDoc: (doc: LegalDocId) => void }) {
  const t = translations[lang]
  const openCookieSettings = () => { window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT)) }

  return (
    <footer className="legal-footer">
      <div className="legal-footer-top">
        <div className="legal-footer-brand">
          <span className="brand-mark"><Scale size={17} strokeWidth={1.5} /></span>
          <strong>LEXA</strong>
          <p>{t.common.legal.footerNote}</p>
        </div>
        <nav className="legal-footer-nav" aria-label="Enlaces legales">
          <span>Información legal</span>
          <button type="button" className="legal-footer-link" onClick={() => onOpenDoc('aviso')}>{t.legalDisclaimer.termsLink}</button>
          <button type="button" className="legal-footer-link" onClick={() => onOpenDoc('privacidad')}>{t.legalDisclaimer.privacyLink}</button>
          <button type="button" className="legal-footer-link" onClick={() => onOpenDoc('tratamiento')}>{t.legalDisclaimer.dataPolicyLink}</button>
          <button type="button" className="legal-footer-link" onClick={() => onOpenDoc('cookies')}>Política de cookies</button>
          <button type="button" className="legal-footer-link" onClick={openCookieSettings}><SlidersHorizontal size={13} /> Configurar cookies</button>
        </nav>
        <div className="legal-footer-contact">
          <span>Contacto</span>
          <p>Dudas sobre privacidad o tratamiento de datos: <Pending>{'[EMAIL DE CONTACTO]'}</Pending></p>
        </div>
      </div>
      <div className="legal-footer-bottom">
        <p>© {new Date().getFullYear()} <Pending>{'[RAZÓN SOCIAL]'}</Pending> · {t.common.legal.rightsReserved}</p>
        <p>{t.common.automatedNote}</p>
      </div>
    </footer>
  )
}

export function CookiesConsent({ lang, onOpenDoc }: { lang: Language; onOpenDoc: (doc: LegalDocId) => void }) {
  const [visible, setVisible] = useState(false)
  const [configuring, setConfiguring] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    const openSettings = () => { setVisible(true); setConfiguring(true) }
    let timer: number | undefined
    try {
      if (!window.localStorage.getItem(CONSENT_KEY)) timer = window.setTimeout(() => setVisible(true), 700)
    } catch {
      timer = undefined
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings)
    return () => {
      if (timer) window.clearTimeout(timer)
      window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings)
    }
  }, [])

  const save = (withAnalytics: boolean) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, analytics: withAnalytics, date: new Date().toISOString() }))
    } catch {}
    setConfiguring(false)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="cookies-banner" role="dialog" aria-modal="false" aria-label="Preferencias de cookies" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="cookies-banner-inner">
            <div className="cookies-banner-copy">
              <strong><Cookie size={14} /> Tus preferencias de privacidad y cookies</strong>
              <p>Tratamos tus datos de acuerdo con nuestra Política de Tratamiento de Datos Personales. Usamos cookies técnicas necesarias para el funcionamiento del sitio y procesamiento seguro de pagos con Stripe. <button type="button" className="cookies-inline-link" onClick={() => onOpenDoc('cookies')}>Ver política de cookies</button>.</p>
            </div>
            <div className="cookies-banner-actions">
              <button type="button" className="cookies-button primary" onClick={() => save(true)}>Aceptar</button>
              <button type="button" className="cookies-button" onClick={() => save(false)}>Solo esenciales</button>
              <button type="button" className="cookies-button ghost" onClick={() => setConfiguring((current) => !current)} aria-expanded={configuring}>Configurar</button>
            </div>
          </div>
          {configuring && (
            <div className="cookies-config">
              <label className="cookies-option" htmlFor="cookies-necessary">
                <input id="cookies-necessary" type="checkbox" checked readOnly aria-describedby="cookies-necessary-desc" />
                <span><strong> Cookies esenciales — siempre activas</strong><span id="cookies-necessary-desc">Permiten la navegación y el pago seguro. Sin ellas no es posible la suscripción.</span></span>
              </label>
              <label className="cookies-option" htmlFor="cookies-analytics">
                <input id="cookies-analytics" type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} aria-describedby="cookies-analytics-desc" />
                <span><strong> Medición anónima de rendimiento</strong><span id="cookies-analytics-desc">Métricas agregadas sin perfilado ni venta a terceros.</span></span>
              </label>
              <div className="cookies-banner-actions">
                <button type="button" className="cookies-button primary" onClick={() => save(analytics)}>Guardar preferencias</button>
                <button type="button" className="cookies-button ghost" onClick={() => setConfiguring(false)}>Ocultar</button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
