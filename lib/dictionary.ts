import { Language } from './i18n'

export type MultilingualDictionaryEntry = {
  keywords: { es: string[]; en: string[] }
  title: { es: string; en: string }
  answer: { es: string; en: string }
  area: { es: string; en: string }
}

export const dictionary: MultilingualDictionaryEntry[] = [
  {
    keywords: {
      es: ['fotos', 'imagen', 'publicar', 'sin consentimiento', 'foto mía'],
      en: ['photo', 'image', 'publish', 'without consent', 'my picture']
    },
    title: {
      es: 'Uso no autorizado de imagen',
      en: 'Unauthorized use of image'
    },
    answer: {
      es: 'Entiendo lo difícil que puede ser esta situación. Que alguien publique fotos tuyas sin tu permiso vulnera tu derecho a la imagen y a la intimidad. Lo primero es hacer capturas de pantalla con fecha y hora visible y guardar los enlaces. Luego envía una solicitud escrita para retirar el contenido. Si se niega o el contenido es íntimo, acude a las autoridades competentes.',
      en: 'Publishing your pictures without permission infringes on your privacy rights. First, take screenshots with timestamps and save links. Send a written removal request. If ignored or if content is intimate, report it to the authorities immediately.'
    },
    area: {
      es: 'Privacidad · Derecho Penal',
      en: 'Privacy · Criminal Law'
    }
  },
  {
    keywords: {
      es: ['amenaza', 'amenazas', 'intimidación', 'me está amenazando'],
      en: ['threat', 'threats', 'intimidation', 'threatening me']
    },
    title: {
      es: 'Amenazas e intimidación',
      en: 'Threats and intimidation'
    },
    answer: {
      es: 'Las amenazas constitucionales o penales anuncian un daño serio e inminente. Guarda mensajes, audios o capturas con fecha y hora. Evita responder con agresividad. Presenta la evidencia reunida ante la autoridad competente (policía o fiscalía).',
      en: 'Threats announcing credible harm constitute an offense. Save all messages, audio clips, and screenshots with dates. Do not retaliate aggressively. File a formal complaint with law enforcement.'
    },
    area: {
      es: 'Derecho Penal · Seguridad',
      en: 'Criminal Law · Security'
    }
  },
  {
    keywords: {
      es: ['contrato', 'incumplimiento', 'no me pagaron', 'no cumplió'],
      en: ['contract', 'breach', 'didn\'t pay', 'unfulfilled']
    },
    title: {
      es: 'Incumplimiento de contrato',
      en: 'Breach of contract'
    },
    answer: {
      es: 'Revisa las cláusulas del contrato, fechas y penalizaciones. Reúne comprobantes de pago y comunicaciones. Envía un requerimiento formal por escrito con un plazo razonable antes de iniciar acciones judiciales.',
      en: 'Review the contract terms, deadlines, and penalty clauses. Gather proof of payment and communication. Send a formal written notice setting a reasonable deadline before taking legal action.'
    },
    area: {
      es: 'Derecho Civil · Contratos',
      en: 'Civil Law · Contracts'
    }
  },
  {
    keywords: {
      es: ['despido', 'me despidieron', 'trabajo', 'laboral', 'empleador'],
      en: ['layoff', 'fired', 'job', 'labor', 'employer']
    },
    title: {
      es: 'Despido y derechos laborales',
      en: 'Termination and labor rights'
    },
    answer: {
      es: 'Verifica si el despido fue con o sin justa causa. Guarda la carta de despido, liquidación y contrato. Tienes derecho al pago completo de prestaciones e indemnización según la normativa aplicable.',
      en: 'Determine whether termination was with or without cause. Keep termination letters and contracts. You are entitled to full severance and benefits according to labor regulations.'
    },
    area: {
      es: 'Derecho Laboral',
      en: 'Labor Law'
    }
  },
  {
    keywords: {
      es: ['divorcio', 'separación', 'matrimonio', 'me quiero separar'],
      en: ['divorce', 'separation', 'marriage', 'separate']
    },
    title: {
      es: 'Divorcio y separación',
      en: 'Divorce and separation'
    },
    answer: {
      es: 'Existen procesos de mutuo acuerdo y contenciosos. Es clave identificar bienes comunes, régimen económico y custodia de menores si aplican.',
      en: 'Divorce processes can be mutual or contested. It is key to outline joint property, marital property regime, and child custody if applicable.'
    },
    area: {
      es: 'Derecho de Familia',
      en: 'Family Law'
    }
  }
]

export const fallbackAnswersByLang: Record<Language, string[]> = {
  es: [
    'Para orientarte con mayor precisión, describe los hechos con más detalle: ¿qué ocurrió exactamente, cuándo fue y si existen documentos de por medio?',
    'Esta situación puede tener varias aristas legales. Cuéntame si buscas reclamar un derecho, defenderte o entender los pasos a seguir.',
  ],
  en: [
    'To provide accurate orientation, please share more context: what happened, when did it occur, and are there contracts or documents involved?',
    'This situation involves key legal considerations. Let us know if you want to claim a right or understand procedural steps.',
  ]
}
