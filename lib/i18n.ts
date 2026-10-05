export type Language = 'es' | 'en'

export type TranslationSchema = {
  common: {
    brand: string
    assistantTitle: string
    automatedNote: string
    nav: {
      howItWorks: string
      consultation: string
      appointment: string
      quote: string
      viewPlanes: string
    }
    legal: {
      footerNote: string
      rightsReserved: string
      pendingData: string
    }
  }
  hero: {
    eyebrow: string
    title1: string
    title2: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
    trust1: string
    trust2: string
  }
  character: {
    name: string
    role: string
    status: string
    disclaimerBadge: string
    notice: string
  }
  legalDisclaimer: {
    bannerText: string
    chatbotFooter: string
    consentCheck: string
    termsLink: string
    privacyLink: string
    dataPolicyLink: string
  }
  chat: {
    kicker: string
    heading1: string
    heading2: string
    subheading: string
    availableQueries: string
    outOf: string
    sessionPrivate: string
    inputPlaceholder: string
    thinkingPlaceholder: string
    writingPlaceholder: string
    sendBtn: string
    listenBtn: string
    stopBtn: string
    limitReachedTitle: string
    limitReachedSub: string
    initialGreeting: string
    typingText: string
    thinkingText: string
    areaInitial: string
    areaGeneral: string
  }
  booking: {
    sectionLabel: string
    kicker: string
    heading1: string
    heading2: string
    description: string
    perks: string[]
    schedule: string
    phone: string
    formTitle: string
    nameLabel: string
    namePlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    dateLabel: string
    timeLabel: string
    timeDefault: string
    reasonLabel: string
    reasonPlaceholder: string
    consentLabel: string
    submitBtn: string
    submittingBtn: string
    successTitle: string
    successMsg: string
    resetBtn: string
    privacyNote: string
  }
  quote: {
    sectionLabel: string
    kicker: string
    heading1: string
    heading2: string
    description: string
    transparencyTitle: string
    transparencyDesc: string
    formTitle: string
    nameLabel: string
    namePlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    caseTypeLabel: string
    caseTypeDefault: string
    urgencyLabel: string
    urgencyOpts: { value: string; label: string; sub: string }[]
    descLabel: string
    descPlaceholder: string
    consentLabel: string
    submitBtn: string
    submittingBtn: string
    caseTypes: { value: string; label: string; baseCOP: number; baseUSD: number }[]
    successTitle: string
    successPriceLabel: string
    successMsg: string
    resetBtn: string
    disclaimer: string
    freeNote: string
  }
  checkoutModal: {
    eyebrow: string
    title1: string
    title2: string
    subtitle: string
    priceNote: string
    perks: string[]
    cta: string
    processing: string
    secureNote: string
    close: string
    regionLabel: string
  }
}

export const translations: Record<Language, TranslationSchema> = {
  es: {
    common: {
      brand: 'LEXA',
      assistantTitle: 'Asistente Jurídico Automatizado',
      automatedNote: 'Orientación jurídica automatizada e informativa. No sustituye la consulta con un abogado habilitado.',
      nav: {
        howItWorks: 'Cómo funciona',
        consultation: 'Consulta',
        appointment: 'Agendar cita',
        quote: 'Cotización',
        viewPlanes: 'Ver planes',
      },
      legal: {
        footerNote: 'Orientación jurídica automatizada de carácter informativo. Lexa no es un despacho de abogados y no ofrece asesoría jurídica personalizada.',
        rightsReserved: 'Todos los derechos reservados.',
        pendingData: '[DATO PENDIENTE]',
      },
    },
    hero: {
      eyebrow: 'Orientación jurídica automatizada y privada',
      title1: 'Consulta tu caso con nuestro',
      title2: 'asistente jurídico.',
      subtitle: 'Respuestas estructuradas, en lenguaje claro y sin tecnicismos. Hasta 7 consultas de orientación informativa gratuita. Respuestas escritas y habladas.',
      ctaPrimary: 'Iniciar consulta',
      ctaSecondary: 'Cómo funciona',
      trust1: 'Privado por diseño',
      trust2: 'Respuestas en voz y texto',
    },
    character: {
      name: 'Dr. Alejandro Vargas (Personaje Ficticio)',
      role: 'Asistente Jurídico Automatizado',
      status: 'Asistente en línea',
      disclaimerBadge: 'Personaje IA',
      notice: 'La imagen corresponde a un personaje ficticio creado mediante IA para brindar orientación jurídica automatizada.',
    },
    legalDisclaimer: {
      bannerText: 'Aviso importante: El sistema proporciona orientación e información jurídica general. Las respuestas no constituyen asesoría jurídica personalizada ni sustituyen la consulta con un profesional del derecho habilitado.',
      chatbotFooter: 'Lexa ofrece orientación jurídica automatizada general de carácter informativo y no sustituye la asesoría jurídica formal.',
      consentCheck: 'Autorizo el tratamiento de mis datos personales de acuerdo con la Política de Tratamiento de Datos Personales.',
      termsLink: 'Términos y condiciones',
      privacyLink: 'Política de privacidad',
      dataPolicyLink: 'Política de tratamiento de datos',
    },
    chat: {
      kicker: 'Consulta con el Asistente Lexa',
      heading1: 'Tu inquietud jurídica merece',
      heading2: 'una orientación clara.',
      subheading: 'Describe los hechos con tus propias palabras. Nuestro asistente jurídico te orienta sobre la normativa y el camino general sin tecnicismos.',
      availableQueries: 'Consultas disponibles',
      outOf: 'de',
      sessionPrivate: 'Sesión orientativa privada',
      inputPlaceholder: 'Escribe tu consulta jurídica aquí...',
      thinkingPlaceholder: 'El asistente está analizando tu consulta...',
      writingPlaceholder: 'El asistente está generando tu orientación...',
      sendBtn: 'Enviar consulta',
      listenBtn: 'Escuchar',
      stopBtn: 'Detener',
      limitReachedTitle: 'Has completado tus 7 consultas informativas.',
      limitReachedSub: 'Suscríbete a Lexa Plus para continuar recibiendo orientación jurídica ilimitada.',
      initialGreeting: 'Buen día. Soy el asistente jurídico automatizado de Lexa. Puedo ofrecerte orientación general e informativa sobre aspectos legales en derecho penal, civil, laboral y de familia. ¿En qué situación puedo orientarte hoy?',
      typingText: 'generando respuesta…',
      thinkingText: 'analizando normativa…',
      areaInitial: 'Orientación inicial',
      areaGeneral: 'Orientación general',
    },
    booking: {
      sectionLabel: '03 / Cita presencial',
      kicker: 'Agenda tu consulta presencial',
      heading1: 'Una reunión personalizada',
      heading2: 'con un profesional.',
      description: 'Si tu situación requiere asesoría legal formal personalizada y revisión de documentos físicos, agenda una cita presencial con nuestro equipo jurídico.',
      perks: [
        'Sesión de 60 minutos de asesoría presencial',
        'Revisión física y detallada de documentos',
        'Estrategia legal personalizada para tu caso',
        'Tratamiento de datos seguro y confidencial',
      ],
      schedule: 'Lun–Vie, 9:00–17:00',
      phone: '+57 300 123 4567',
      formTitle: 'Solicitar cita presencial',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Ingresa tu nombre',
      phoneLabel: 'Teléfono / WhatsApp',
      phonePlaceholder: '+57 300 000 0000',
      dateLabel: 'Fecha preferida',
      timeLabel: 'Hora preferida',
      timeDefault: 'Selecciona hora',
      reasonLabel: 'Motivo de la consulta (opcional)',
      reasonPlaceholder: 'Describe brevemente el tema a tratar...',
      consentLabel: 'Autorizo el tratamiento de mis datos personales de acuerdo con la Política de Tratamiento de Datos.',
      submitBtn: 'Solicitar cita presencial',
      submittingBtn: 'Agendando cita…',
      successTitle: '¡Solicitud de cita enviada!',
      successMsg: 'Te contactaremos al número indicado en menos de 2 horas hábiles para confirmar la disponibilidad de tu cita.',
      resetBtn: 'Solicitar otra cita',
      privacyNote: 'Tratamos tus datos de acuerdo con nuestra Política de Tratamiento de Datos Personales.',
    },
    quote: {
      sectionLabel: '04 / Cotización',
      kicker: 'Estimación de honorarios',
      heading1: 'Conoce el costo estimado',
      heading2: 'antes de decidir.',
      description: 'Solicita una cotización orientativa sin compromiso para conocer el valor estimado de representación o elaboración de documentos.',
      transparencyTitle: 'Tabla de estimaciones',
      transparencyDesc: 'Precios de referencia ajustados a la moneda y región seleccionada.',
      formTitle: 'Solicitar cotización orientativa',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Ingresa tu nombre',
      phoneLabel: 'Teléfono / WhatsApp',
      phonePlaceholder: '+57 300 000 0000',
      caseTypeLabel: 'Área del caso',
      caseTypeDefault: 'Selecciona el área legal',
      urgencyLabel: 'Urgencia del trámite',
      urgencyOpts: [
        { value: 'normal', label: 'Normal', sub: '5–10 días hábiles' },
        { value: 'urgent', label: 'Urgente', sub: '2–3 días (+30%)' },
        { value: 'express', label: 'Express', sub: '24 horas (+60%)' },
      ],
      descLabel: 'Descripción breve del caso',
      descPlaceholder: 'Cuéntanos los detalles más importantes para estimar mejor...',
      consentLabel: 'Autorizo el tratamiento de mis datos de acuerdo con la Política de Tratamiento de Datos.',
      submitBtn: 'Calcular cotización',
      submittingBtn: 'Calculando estimación…',
      caseTypes: [
        { value: 'penal', label: 'Derecho Penal', baseCOP: 150000, baseUSD: 40 },
        { value: 'civil', label: 'Derecho Civil', baseCOP: 120000, baseUSD: 30 },
        { value: 'laboral', label: 'Derecho Laboral', baseCOP: 130000, baseUSD: 35 },
        { value: 'familia', label: 'Derecho de Familia', baseCOP: 100000, baseUSD: 25 },
        { value: 'inmobiliario', label: 'Derecho Inmobiliario', baseCOP: 140000, baseUSD: 38 },
        { value: 'sucesiones', label: 'Sucesiones y Herencias', baseCOP: 110000, baseUSD: 30 },
        { value: 'empresarial', label: 'Derecho Empresarial', baseCOP: 200000, baseUSD: 50 },
        { value: 'otro', label: 'Otro / A consultar', baseCOP: 0, baseUSD: 0 },
      ],
      successTitle: '¡Cotización estimada generada!',
      successPriceLabel: 'Estimado aproximado:',
      successMsg: 'Te enviaremos la propuesta formal detallada al teléfono indicado en un plazo máximo de 24 horas hábiles.',
      resetBtn: 'Solicitar nueva cotización',
      disclaimer: 'Los precios son estimaciones orientativas. El valor final se confirma tras la evaluación técnica de la documentación.',
      freeNote: 'Cotización sin compromiso y tratada con confidencialidad.',
    },
    checkoutModal: {
      eyebrow: 'LEXA PLUS — SUSCRIPCIÓN',
      title1: 'Orientación jurídica',
      title2: 'ilimitada y continua.',
      subtitle: 'Obtén acceso sin límites al asistente jurídico automatizado por texto y voz para resolver tus inquietudes.',
      priceNote: 'Facturado mensualmente. Cancela en cualquier momento.',
      perks: [
        'Consultas ilimitadas 24/7',
        'Respuestas detalladas en texto y voz',
        'Acceso a todas las áreas legales',
        'Sin permanencia mínima',
      ],
      cta: 'Confirmar pago seguro',
      processing: 'Procesando checkout con Stripe…',
      secureNote: 'Pago procesado de forma cifrada mediante Stripe. No almacenamos datos de tarjeta.',
      close: 'Cerrar ventana de pago',
      regionLabel: 'País / Moneda del cobro',
    },
  },

  en: {
    common: {
      brand: 'LEXA',
      assistantTitle: 'Automated Legal Assistant',
      automatedNote: 'Automated legal orientation for information purposes. Does not replace consultation with a licensed attorney.',
      nav: {
        howItWorks: 'How it works',
        consultation: 'Consultation',
        appointment: 'Book appointment',
        quote: 'Get a quote',
        viewPlanes: 'View plans',
      },
      legal: {
        footerNote: 'Automated informational legal orientation. Lexa is not a law firm and does not provide personalized legal advice.',
        rightsReserved: 'All rights reserved.',
        pendingData: '[PENDING DATA]',
      },
    },
    hero: {
      eyebrow: 'Automated & Private Legal Orientation',
      title1: 'Consult your case with our',
      title2: 'automated legal assistant.',
      subtitle: 'Structured responses in clear, non-technical language. Up to 7 free informational consultation queries. Written and spoken responses.',
      ctaPrimary: 'Start consultation',
      ctaSecondary: 'How it works',
      trust1: 'Private by design',
      trust2: 'Voice & text responses',
    },
    character: {
      name: 'Dr. Alejandro Vargas (Fictional Character)',
      role: 'Automated Legal Assistant',
      status: 'Assistant online',
      disclaimerBadge: 'AI Character',
      notice: 'The visual representation is an AI-generated fictional character created to facilitate automated orientation interaction.',
    },
    legalDisclaimer: {
      bannerText: 'Important notice: The system provides general legal information and orientation. Responses do not constitute personalized legal advice nor substitute consultation with a licensed attorney.',
      chatbotFooter: 'Lexa provides general automated legal orientation for informational purposes and does not replace formal legal advice.',
      consentCheck: 'I authorize the processing of my personal data in accordance with the Data Privacy Policy.',
      termsLink: 'Terms & conditions',
      privacyLink: 'Privacy policy',
      dataPolicyLink: 'Data processing policy',
    },
    chat: {
      kicker: 'Consultation with Lexa Assistant',
      heading1: 'Your legal question deserves',
      heading2: 'clear orientation.',
      subheading: 'Describe your situation in your own words. Our legal assistant guides you through general laws and procedures without jargon.',
      availableQueries: 'Available queries',
      outOf: 'of',
      sessionPrivate: 'Private orientation session',
      inputPlaceholder: 'Type your legal query here...',
      thinkingPlaceholder: 'The assistant is analyzing your query...',
      writingPlaceholder: 'The assistant is generating your orientation...',
      sendBtn: 'Send query',
      listenBtn: 'Listen',
      stopBtn: 'Stop',
      limitReachedTitle: 'You have completed your 7 free queries.',
      limitReachedSub: 'Subscribe to Lexa Plus to continue receiving unlimited legal orientation.',
      initialGreeting: 'Hello! I am Lexa’s automated legal assistant. I can provide general informational orientation regarding criminal, civil, labor, and family law. How can I assist you today?',
      typingText: 'generating response…',
      thinkingText: 'analyzing legal framework…',
      areaInitial: 'Initial orientation',
      areaGeneral: 'General orientation',
    },
    booking: {
      sectionLabel: '03 / In-person appointment',
      kicker: 'Schedule an in-person consultation',
      heading1: 'A personalized meeting',
      heading2: 'with a legal professional.',
      description: 'If your situation requires formal legal advice and physical document review, schedule an in-person appointment with our legal team.',
      perks: [
        '60-minute in-person consultation session',
        'Physical and detailed document review',
        'Personalized legal strategy for your case',
        'Secure and confidential data processing',
      ],
      schedule: 'Mon–Fri, 9:00–17:00',
      phone: '+57 300 123 4567',
      formTitle: 'Request in-person appointment',
      nameLabel: 'Full name',
      namePlaceholder: 'Enter your full name',
      phoneLabel: 'Phone / WhatsApp',
      phonePlaceholder: '+1 (555) 000-0000',
      dateLabel: 'Preferred date',
      timeLabel: 'Preferred time',
      timeDefault: 'Select time',
      reasonLabel: 'Reason for consultation (optional)',
      reasonPlaceholder: 'Briefly describe your case...',
      consentLabel: 'I authorize the processing of my personal data in accordance with the Privacy Policy.',
      submitBtn: 'Request appointment',
      submittingBtn: 'Booking appointment…',
      successTitle: 'Appointment request sent!',
      successMsg: 'We will contact you at the provided number within 2 business hours to confirm availability.',
      resetBtn: 'Request another appointment',
      privacyNote: 'We process your data according to our Personal Data Processing Policy.',
    },
    quote: {
      sectionLabel: '04 / Quote',
      kicker: 'Fee estimation',
      heading1: 'Know the estimated cost',
      heading2: 'before deciding.',
      description: 'Request a non-binding estimated quote to understand costs for representation or legal document drafting.',
      transparencyTitle: 'Fee estimates table',
      transparencyDesc: 'Reference prices adjusted to selected currency and region.',
      formTitle: 'Request estimated quote',
      nameLabel: 'Full name',
      namePlaceholder: 'Enter your full name',
      phoneLabel: 'Phone / WhatsApp',
      phonePlaceholder: '+1 (555) 000-0000',
      caseTypeLabel: 'Legal area',
      caseTypeDefault: 'Select legal area',
      urgencyLabel: 'Case urgency',
      urgencyOpts: [
        { value: 'normal', label: 'Normal', sub: '5–10 business days' },
        { value: 'urgent', label: 'Urgent', sub: '2–3 days (+30%)' },
        { value: 'express', label: 'Express', sub: '24 hours (+60%)' },
      ],
      descLabel: 'Brief case description',
      descPlaceholder: 'Tell us key details to provide an accurate estimate...',
      consentLabel: 'I authorize the processing of my data in accordance with the Data Privacy Policy.',
      caseTypes: [
        { value: 'penal', label: 'Criminal Law', baseCOP: 150000, baseUSD: 40 },
        { value: 'civil', label: 'Civil Law', baseCOP: 120000, baseUSD: 30 },
        { value: 'laboral', label: 'Labor Law', baseCOP: 130000, baseUSD: 35 },
        { value: 'familia', label: 'Family Law', baseCOP: 100000, baseUSD: 25 },
        { value: 'inmobiliario', label: 'Real Estate Law', baseCOP: 140000, baseUSD: 38 },
        { value: 'sucesiones', label: 'Inheritance & Estates', baseCOP: 110000, baseUSD: 30 },
        { value: 'empresarial', label: 'Corporate Law', baseCOP: 200000, baseUSD: 50 },
        { value: 'otro', label: 'Other / Consult', baseCOP: 0, baseUSD: 0 },
      ],
      submitBtn: 'Calculate quote',
      submittingBtn: 'Calculating estimate…',
      successTitle: 'Estimated quote generated!',
      successPriceLabel: 'Approximate estimate:',
      successMsg: 'We will send a detailed formal proposal to your phone within 24 business hours.',
      resetBtn: 'Request new quote',
      disclaimer: 'Prices are general estimates. Final fee will be confirmed after technical document review.',
      freeNote: 'No-obligation quote treated with full confidentiality.',
    },
    checkoutModal: {
      eyebrow: 'LEXA PLUS — SUBSCRIPTION',
      title1: 'Continuous & unlimited',
      title2: 'legal orientation.',
      subtitle: 'Get unlimited 24/7 access to the automated legal assistant via text and voice.',
      priceNote: 'Billed monthly. Cancel anytime.',
      perks: [
        'Unlimited 24/7 queries',
        'Detailed voice & text responses',
        'Full access to all legal topics',
        'No minimum commitment',
      ],
      cta: 'Confirm secure payment',
      processing: 'Processing checkout with Stripe…',
      secureNote: 'Encrypted payment processed safely by Stripe. We do not store credit card details.',
      close: 'Close payment modal',
      regionLabel: 'Country / Currency',
    },
  },
}
