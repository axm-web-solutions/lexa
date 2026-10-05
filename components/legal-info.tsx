'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Cookie, Scale, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export type LegalDocId = 'aviso' | 'privacidad' | 'cookies' | 'suscripcion'

const CONSENT_KEY = 'lexa_cookie_consent'
const OPEN_SETTINGS_EVENT = 'lexa:open-cookie-settings'

const legalDocs: { id: LegalDocId; linkLabel: string; title: string }[] = [
  { id: 'aviso', linkLabel: 'Aviso legal y condiciones de uso', title: 'Aviso legal y condiciones de uso' },
  { id: 'privacidad', linkLabel: 'Política de privacidad', title: 'Política de privacidad y protección de datos' },
  { id: 'cookies', linkLabel: 'Política de cookies', title: 'Política de cookies' },
  { id: 'suscripcion', linkLabel: 'Condiciones de la suscripción', title: 'Condiciones de la suscripción Lexa Plus' },
]

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
        <li>Razón social o nombre completo: <Pending>{'{{RAZÓN_SOCIAL}}'}</Pending></li>
        <li>NIF / CIF / identificación fiscal: <Pending>{'{{NIF}}'}</Pending></li>
        <li>Domicilio social: <Pending>{'{{DOMICILIO}}'}</Pending></li>
        <li>Correo electrónico de contacto: <Pending>{'{{CORREO_CONTACTO}}'}</Pending></li>
        <li>Dominio del sitio: <Pending>{'{{DOMINIO}}'}</Pending></li>
      </ul>
      <h3>2. Objeto</h3>
      <p>Estas condiciones regulan el acceso, la navegación y el uso del sitio web Lexa (en adelante, «el sitio»). El acceso al sitio implica la aceptación de estas condiciones. Si no estás de acuerdo con ellas, debes dejar de utilizarlo.</p>
      <p>Te comprometes a hacer un uso lícito, diligente y respetuoso del sitio, y a no emplearlo para cometer actividades ilícitas, difundir contenidos dañinos ni interferir en el funcionamiento del servicio.</p>
      <h3>3. Naturaleza del servicio: Lexa no es un despacho jurídico</h3>
      <p>Lexa es una herramienta informativa y educativa. <strong>Lexa no es un despacho jurídico, ni una firma de abogados, ni una clínica jurídica, ni un servicio de defensa oficial.</strong> Concretamente:</p>
      <ul>
        <li>Lexa ofrece <strong>información general y educativa</strong>, nunca asesoría jurídica profesional adaptada a tu caso concreto.</li>
        <li>Lexa <strong>no sustituye al consejo de un abogado</strong> ni de cualquier otro profesional del derecho habilitado.</li>
        <li>El uso de Lexa <strong>no crea una relación abogado–cliente</strong>, ni encargo profesional, ni deber de confidencialidad profesional, ni representación ante ninguna autoridad.</li>
        <li>Las respuestas se generan a partir de un diccionario de temas jurídicos de carácter general y <strong>los plazos, requisitos, trámites y consecuencias varían según el país, la jurisdicción y las circunstancias de cada caso</strong>.</li>
        <li>Lexa no se responsabiliza de las decisiones que tomes en base a la información mostrada, ni asume compromisos de resultado sobre ningún procedimiento.</li>
      </ul>
      <p>Si tu situación involucra plazos perentorios, riesgo de sanción, detención, violencia, desahucio, custodia de menores o cualquier otra urgencia, <strong>consulta de inmediato a un abogado o a los servicios de emergencia de tu país</strong>.</p>
      <h3>4. Propiedad intelectual e industrial</h3>
      <p>Los textos, el diseño, la marca «Lexa», los elementos gráficos y el código del sitio pertenecen a su titular o se usan con licencia. No se permite su reproducción, distribución o transformación sin autorización previa, salvo los límites legalmente previstos.</p>
      <h3>5. Responsabilidad y enlaces externos</h3>
      <p>El titular procura que la información sea correctora y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad ininterrumpida del sitio. El servicio de pago se presta a través de Stripe: al salir del sitio para pagar, se aplican los términos y la política de privacidad de Stripe.</p>
      <h3>6. Ley aplicable y jurisdicción</h3>
      <p>Estas condiciones se rigen por <Pending>{'{{JURISDICCIÓN_APLICABLE}}'}</Pending>. Para cualquier controversia serán competentes los tribunales que correspondan según la normativa de consumo aplicable al consumidor. <em>(Completar el régimen legal y el fuero concretos antes de publicar.)</em></p>
    </>
  )
}

function PrivacidadContent() {
  return (
    <>
      <p className="legal-doc-updated">Última actualización: octubre de 2026.</p>
      <h3>1. Responsable del tratamiento</h3>
      <ul>
        <li>Responsable: <Pending>{'{{RAZÓN_SOCIAL}}'}</Pending></li>
        <li>Correo para ejercer derechos: <Pending>{'{{CORREO_CONTACTO}}'}</Pending></li>
      </ul>
      <h3>2. Régimen aplicable</h3>
      <p>El tratamiento se ajusta, según la jurisdicción que resulte de aplicación, al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018, o bien a la Ley 1581 de 2012 y el Decreto 1377 de 2013 (Colombia). Régimen concreto a confirmar: <Pending>{'{{RÉGIMEN_APLICABLE}}'}</Pending>.</p>
      <h3>3. Datos que tratamos</h3>
      <ul>
        <li><strong>Consultas del chat:</strong> se procesan íntegramente en tu navegador, contra un diccionario local. No se envían a ningún servidor nuestro ni se almacenan: desaparecen al recargar o cerrar la página.</li>
        <li><strong>Datos de pago:</strong> la tarjeta y los datos de cobro los recibe y trata <strong>Stripe como responsable independiente</strong>. Nosotros no vemos ni almacenamos el número de tarjeta; solo recibimos el estado de la suscripción, la marca de la tarjeta y los últimos cuatro dígitos para mostrar el recibo.</li>
        <li><strong>Correo electrónico:</strong> lo introduces en el pago de Stripe para recibir el recibo y gestionar la suscripción.</li>
        <li><strong>Datos de navegación:</strong> en producción se usa Vercel Analytics con métricas agregadas y sin intención publicitaria.</li>
        <li><strong>Almacenamiento local:</strong> guardamos tu preferencia de cookies en la clave <code>lexa_cookie_consent</code> de tu navegador.</li>
      </ul>
      <h3>4. Base legal del tratamiento</h3>
      <ul>
        <li>Ejecución del contrato de suscripción (art. 6.1.b RGPD / consentimiento contractual en Ley 1581) para gestionar el pago y el acceso a Lexa Plus.</li>
        <li>Consentimiento para las cookies y tecnologías similares no necesarias.</li>
        <li>Cumplimiento de obligaciones legales en materia fiscal y de facturación.</li>
        <li>Interés legítimo en la seguridad del sitio, la prevención del fraude y la defensa de posibles reclamaciones.</li>
      </ul>
      <h3>5. Plazos de conservación</h3>
      <ul>
        <li>Consultas del chat: no se conservan (viven solo en la sesión del navegador).</li>
        <li>Datos de la suscripción y facturación: durante la vigencia de la relación y los plazos legales de conservación fiscal (<Pending>{'{{PLAZO_LEGAL_FACTURACIÓN}}'}</Pending>).</li>
        <li>Preferencia de cookies: hasta que la borres de tu navegador.</li>
      </ul>
      <h3>6. Destinatarios y transferencias</h3>
      <p>Trabajamos con proveedores necesarios para prestar el servicio: <strong>Stripe</strong> (pagos y gestión de suscripciones) y <strong>Vercel</strong> (alojamiento y analítica). Ambos pueden tratar datos fuera de tu zona económica con garantías adecuadas (cláusulas contractuales tipo u otros mecanismos reconocidos). No cedemos tus datos a redes publicitarias ni los vendemos a terceros. Si una autoridad lo exige, podremos comunicar los datos legalmente exigidos.</p>
      <h3>7. Derechos de las personas interesadas</h3>
      <p>Puedes ejercer, de forma gratuita y en cualquier momento, los derechos de <strong>acceso, rectificación, supresión («olvido»), oposición, limitación del tratamiento y portabilidad</strong>, así como retirar el consentimiento sin que ello afecte a la licitud del tratamiento anterior.</p>
      <p>Para ejercerlos escribe a <Pending>{'{{CORREO_CONTACTO}}'}</Pending> indicando el derecho que ejerces y los datos necesarios para localizar tu información; si lo consideras oportuno, adjunta una copia de un documento que acredite tu identidad. Responderemos dentro del plazo que fije la normativa aplicable (un mes como regla general según el RGPD).</p>
      <h3>8. Reclamaciones</h3>
      <p>Si consideras que el tratamiento no se ajusta a la normativa, puedes presentar una reclamación ante la autoridad de control competente: <Pending>{'{{AUTORIDAD_DE_CONTROL}}'}</Pending>.</p>
      <h3>9. Menores de edad</h3>
      <p>Lexa no está dirigido a menores de edad y no recogemos conscientemente sus datos.</p>
    </>
  )
}

function CookiesContent() {
  return (
    <>
      <p className="legal-doc-updated">Última actualización: octubre de 2026.</p>
      <h3>1. Qué son las cookies</h3>
      <p>Las cookies y tecnologías similares (localStorage, sessionStorage, píxeles) son ficheros o datos que el navegador guarda en tu dispositivo para recordar información sobre tu visita. Esta política explica qué utiliza exactamente Lexa y cómo puedes controlarlas.</p>
      <h3>2. Tecnologías que utiliza este sitio</h3>
      <ul>
        <li><strong>Almacenamiento local propio (necesario):</strong> guardamos tu decisión sobre las cookies en la clave <code>lexa_cookie_consent</code> de <code>localStorage</code> para no preguntártelo en cada visita. Es estrictamente necesaria para recordar tu preferencia y no requiere consentimiento. El resto de la navegación y el chat no usan <code>localStorage</code> ni <code>sessionStorage</code>: las consultas viven solo en la sesión de la página.</li>
        <li><strong>Cookies de Stripe durante el checkout (necesarias):</strong> al pulsar «Continuar con Lexa Plus» te redirigimos a Stripe Checkout, que instala cookies propias como <code>__stripe_mid</code> y <code>__stripe_vid</code> (identificación y prevención de fraude) y cookies de sesión del proceso de pago. Son imprescindibles para realizar el cobro con seguridad y, por ser estrictamente necesarias al servicio solicitado, no requieren tu consentimiento previo. Stripe las gestiona bajo su <a href="https://stripe.com/cookies" target="_blank" rel="noopener noreferrer">política de cookies</a> y su <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad</a>.</li>
        <li><strong>Vercel Analytics (medición, solo en producción):</strong> cuando el sitio está publicado, la analítica de Vercel mide visitas de forma agregada. Puede usar cookies propias o señales de medición (beacon) de corta duración, sin perfilado publicitario ni identificación de terceros. En desarrollo local no se carga.</li>
        <li><strong>Vídeos de la portada:</strong> se sirven desde este mismo dominio y no instalan cookies por sí mismos.</li>
      </ul>
      <h3>3. Qué NO usamos</h3>
      <p><strong>No usamos cookies publicitarias, ni de perfilado comercial, ni píxeles de redes sociales, ni compartimos datos con terceros con fines publicitarios.</strong> No existe publicidad comportamental ni seguimiento entre sitios.</p>
      <h3>4. Cómo dar o retirar tu consentimiento</h3>
      <ul>
        <li><strong>Desde el banner:</strong> al entrar puedes «Aceptar», quedarte en «Solo esenciales» o «Configurar» la medición. Puedes volver a abrir la configuración en cualquier momento desde el enlace «Configurar cookies» del pie de página.</li>
        <li><strong>Borrando el guardado:</strong> elimina la clave <code>lexa_cookie_consent</code> del almacenamiento local de este sitio (o borra los datos del sitio en tu navegador) y el banner volverá a aparecer.</li>
        <li><strong>Desde tu navegador:</strong> puedes bloquear o eliminar todas las cookies desde la configuración de privacidad (Chrome: «Configuración → Privacidad y seguridad → Cookies»; Firefox: «Ajustes → Privacidad y seguridad»; Safari: «Preferencias → Privacidad»; Edge: «Configuración → Cookies y permisos del sitio»), o mediante extensiones bloqueadoras.</li>
        <li><strong>Bloqueo total:</strong> si bloqueas incluso las cookies técnicas, el pago con Stripe puede dejar de funcionar y la preferencia no podrá recordarse.</li>
      </ul>
      <h3>5. Cambios en esta política</h3>
      <p>Actualizaremos esta política cuando cambien las tecnologías utilizadas. La fecha de la última actualización figura al inicio del documento.</p>
    </>
  )
}

function SuscripcionContent() {
  return (
    <>
      <p className="legal-doc-updated">Última actualización: octubre de 2026.</p>
      <h3>1. Plan y precio</h3>
      <p>Lexa Plus cuesta <strong>14,99 USD al mes</strong>. El importe final con los impuestos aplicables en tu país se muestra en la pantalla de pago antes de que confirmes la compra.</p>
      <h3>2. Renovación automática y cobro recurrente</h3>
      <p>La suscripción es de carácter recurrente: <strong>se renueva automáticamente cada mes por el mismo precio</strong> (más los impuestos que correspondan) y <strong>se te cobra de forma recurrente</strong> con el medio de pago guardado en Stripe, hasta que la canceles. No enviamos avisos previos salvo obligación legal o cambio de precio.</p>
      <h3>3. Cómo cancelar</h3>
      <p>Puedes cancelar <strong>en cualquier momento y sin coste</strong>, con efectos desde el final del periodo ya pagado (no se te cobra de nuevo y conservas el acceso hasta esa fecha). Para cancelar:</p>
      <ul>
        <li>Usa el enlace de gestión de la suscripción que aparece en el correo de recibo de Stripe: <Pending>{'{{ENLACE_PORTAL_DE_CANCELACIÓN}}'}</Pending></li>
        <li>O escribe a <Pending>{'{{CORREO_CONTACTO}}'}</Pending> solicitando la cancelación.</li>
      </ul>
      <h3>4. Reembolsos</h3>
      <p>Política de reembolsos pendiente de definir: <Pending>{'{{POLÍTICA_DE_REEMBOLSO}}'}</Pending>. Criterio razonable mientras no se complete: los importes del periodo en curso no son reembolsables, salvo cuando la normativa de consumo de tu país reconozca un derecho de desistimiento (por ejemplo, 14 días en la Unión Europea) o cuando la ley exija devolver el dinero por un servicio no prestado. Si consideras que procede un reembolso, solicítalo en <Pending>{'{{CORREO_CONTACTO}}'}</Pending> y lo estudiaremos.</p>
      <h3>5. Derecho de desistimiento (consumidores)</h3>
      <p>Si eres consumidor y te acoges a un derecho de desistimiento legal, puedes desistir en el plazo que fije tu normativa. Al solicitar que el servicio digital comience de inmediato, aceptas expresamente su inicio y reconoces que, una vez prestado, puedes perder ese derecho de desistimiento.</p>
      <h3>6. Pago y Stripe</h3>
      <p>El pago lo procesa <strong>Stripe</strong> mediante su página segura de checkout. Tus datos de tarjeta viajan cifrados a Stripe: nosotros no los almacenamos ni los tratamos más allá de los datos de facturación necesarios. Se te puede pedir autenticación reforzada (3D Secure). Al continuar aceptas los <a href="https://stripe.com/legal/ssa" target="_blank" rel="noopener noreferrer">términos de Stripe</a> y su <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad</a>.</p>
      <h3>7. Falta de pago</h3>
      <p>Si un cobro falla, Stripe reintentará el cargo. Si la suscripción no puede renovarse, el acceso a Lexa Plus finalizará al concluir el periodo ya abonado.</p>
      <h3>8. Cambios de precio o del servicio</h3>
      <p>Podemos modificar el precio o dejar de ofrecer el plan comunicándolo con al menos <strong>15 días de antelación</strong>. Antes de la fecha de aplicación podrás cancelar sin coste; si no lo haces, se entenderá que aceptas el nuevo precio.</p>
      <h3>9. Información precontractual</h3>
      <p>Antes de confirmar el pago verás el precio, la frecuencia de cobro, la fecha de la próxima renovación y el botón de confirmación del cargo recurrente, tal como exige la normativa de comercio electrónico y de consumo aplicable. Si algún dato no coincide con lo indicado aquí, prevalece lo mostrado en la pantalla de pago.</p>
    </>
  )
}

const contentByDoc: Record<LegalDocId, () => ReactNode> = {
  aviso: AvisoLegalContent,
  privacidad: PrivacidadContent,
  cookies: CookiesContent,
  suscripcion: SuscripcionContent,
}

export function LegalDocModal({ doc, onClose }: { doc: LegalDocId; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const meta = legalDocs.find((item) => item.id === doc)
  const Content = contentByDoc[doc]

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
        <h2 id="legal-doc-title">{meta?.title}</h2>
        <div className="legal-doc-body"><Content /></div>
        <div className="legal-doc-foot"><ShieldCheck size={14} /><p>Lexa ofrece información general con fines educativos. No es un despacho jurídico, no sustituye a un abogado y no crea relación abogado–cliente.</p></div>
      </motion.div>
    </motion.div>
  )
}

export function LegalFooter() {
  const [activeDoc, setActiveDoc] = useState<LegalDocId | null>(null)

  const openCookieSettings = () => { window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT)) }

  return (
    <>
      <footer className="legal-footer">
        <div className="legal-footer-top">
          <div className="legal-footer-brand">
            <span className="brand-mark"><Scale size={17} strokeWidth={1.5} /></span>
            <strong>LEXA</strong>
            <p>Orientación jurídica informativa. Lexa no es un despacho de abogados y no ofrece asesoría jurídica personalizada.</p>
          </div>
          <nav className="legal-footer-nav" aria-label="Enlaces legales">
            <span>Información legal</span>
            {legalDocs.map((item) => (<button key={item.id} type="button" className="legal-footer-link" onClick={() => setActiveDoc(item.id)}>{item.linkLabel}</button>))}
            <button type="button" className="legal-footer-link" onClick={openCookieSettings}><SlidersHorizontal size={13} /> Configurar cookies</button>
          </nav>
          <div className="legal-footer-contact">
            <span>Contacto</span>
            <p>¿Dudas sobre privacidad o suscripción? Escribe a <Pending>{'{{CORREO_CONTACTO}}'}</Pending></p>
          </div>
        </div>
        <div className="legal-footer-bottom">
          <p>© {new Date().getFullYear()} <Pending>{'{{RAZÓN_SOCIAL}}'}</Pending> · Todos los derechos reservados.</p>
          <p>Los plazos y requisitos jurídicos varían según el país y la jurisdicción. Ante una situación urgente, consulta a un profesional habilitado.</p>
        </div>
      </footer>
      <AnimatePresence>{activeDoc && <LegalDocModal key={activeDoc} doc={activeDoc} onClose={() => setActiveDoc(null)} />}</AnimatePresence>
    </>
  )
}

type Consent = { necessary: true; analytics: boolean; date: string }

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    return raw ? (JSON.parse(raw) as Consent) : null
  } catch {
    return null
  }
}

export function CookiesConsent() {
  const [visible, setVisible] = useState(false)
  const [configuring, setConfiguring] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)

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
      const consent: Consent = { necessary: true, analytics: withAnalytics, date: new Date().toISOString() }
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    } catch {
      // sin almacenamiento disponible: la preferencia no puede persistir
    }
    setConfiguring(false)
    setVisible(false)
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div className="cookies-banner" role="dialog" aria-modal="false" aria-label="Preferencias de cookies" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="cookies-banner-inner">
              <div className="cookies-banner-copy">
                <strong><Cookie size={14} /> Tus preferencias de cookies</strong>
                <p>Usamos cookies y almacenamiento local <em>técnicos y necesarios</em> (preferencia de sesión y pago seguro con Stripe) y, solo si lo aceptas, medición anónima con Vercel Analytics en producción. <strong>No usamos cookies publicitarias ni de terceros con fines publicitarios.</strong> Puedes aceptarlo todo, quedarte solo en lo esencial o configurarlo. <button type="button" className="cookies-inline-link" onClick={() => setShowPolicy(true)}>Ver la política de cookies</button>.</p>
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
                  <span><strong> Cookies esenciales — siempre activas</strong><span id="cookies-necessary-desc">Guardan tu preferencia de consentimiento y permiten el pago seguro con Stripe. Sin ellas no puedes contratar la suscripción.</span></span>
                </label>
                <label className="cookies-option" htmlFor="cookies-analytics">
                  <input id="cookies-analytics" type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} aria-describedby="cookies-analytics-desc" />
                  <span><strong> Medición anónima — Vercel Analytics (solo producción)</strong><span id="cookies-analytics-desc">Métricas agregadas de uso para mejorar el sitio. Sin publicidad y sin perfilado. Puedes negarla: el sitio funciona igual.</span></span>
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
      <AnimatePresence>{showPolicy && <LegalDocModal key="cookies-policy" doc="cookies" onClose={() => setShowPolicy(false)} />}</AnimatePresence>
    </>
  )
}
