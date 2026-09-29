import { SiteContent, PlatformProduct, PlatformUpdate, PrivacyPolicyContent } from '../types';

export const defaultSiteContent: SiteContent = {
  heroBadge: 'Tecnología Integral para la Educación de Élite',
  heroTitle: 'La Plataforma Definitiva para la Gestión de Colegios Privados',
  heroSubtitle: 'Unificamos control escolar, cobranza y facturación electrónica, app para padres y planeación docente en un solo ecosistema elegante, seguro y de alto prestigio.',
  aboutTitle: 'Quiénes Somos',
  aboutSummary: 'My College nació con la convicción de que los colegios privados de excelencia merecen herramientas tecnológicas a la altura de sus estándares pedagógicos y administrativos.',
  aboutStory: 'Fundada por especialistas en dirección escolar y arquitectura de software, My College sustituye las hojas de cálculo dispersas, los softwares obsoletos y los grupos desordenados de mensajería con una plataforma centralizada en la nube que eleva el prestigio institucional y simplifica la vida de directores, maestros y familias.',
  mission: 'Empoderar a las instituciones educativas privadas con soluciones tecnológicas de vanguardia que simplifiquen su operación administrativa, fortalezcan la comunicación familiar y potencien el rendimiento académico en un entorno confiable, moderno y seguro.',
  vision: 'Ser el estándar tecnológico de excelencia para colegios y colegios bilingües en América Latina, liderando la transformación digital de la educación privada a través de innovación continua, calidez humana e inteligencia operativa.',
  values: [
    { title: 'Excelencia Institucional', desc: 'Desarrollamos cada módulo con los más altos estándares de calidad, diseño y desempeño.' },
    { title: 'Seguridad y Privacidad', desc: 'Protección estricta de la información personal de alumnos, padres y registros financieros.' },
    { title: 'Cercanía y Acompañamiento', desc: 'Soporte prioritario y capacitación permanente para todo el equipo del colegio.' },
    { title: 'Innovación Continua', desc: 'Actualizaciones constantes con las mejores prácticas educativas y normativas fiscales.' }
  ],
  objectives: [
    {
      id: 'obj-1',
      title: 'Automatización Integral de la Cobranza Escolar',
      description: 'Reducir la morosidad hasta un 65% mediante recordatorios automatizados, pasarelas de pago digitales (tarjeta, SPEI, OXXO) y timbrado instantáneo de facturas CFDI.',
      metric: '65% Menor Morosidad',
      iconName: 'CreditCard'
    },
    {
      id: 'obj-2',
      title: 'Cero Papeleo y Control Escolar 100% Digital',
      description: 'Generar boletas SEP, historiales académicos, kárdex y listas de asistencia en segundos, eliminando errores humanos y carpetas físicas.',
      metric: '85% Ahorro de Tiempo',
      iconName: 'FileCheck'
    },
    {
      id: 'obj-3',
      title: 'Conexión Inmediata con Familias y Tutores',
      description: 'Brindar a los padres una aplicación móvil premium donde consulten calificaciones, tareas, avisos oficiales, circulares y estado de cuenta al instante.',
      metric: '99.4% Satisfacción Padres',
      iconName: 'Smartphone'
    },
    {
      id: 'obj-4',
      title: 'Seguridad Escolar y Entrega Controlada',
      description: 'Monitorear accesos en puerta, credencialización digital con código QR dinámico y validación de personas autorizadas para la salida de alumnos.',
      metric: '100% Trazabilidad',
      iconName: 'ShieldCheck'
    },
    {
      id: 'obj-5',
      title: 'Toma de Decisiones Directivas Basada en Datos',
      description: 'Dashboards directivos en tiempo real con indicadores clave: retención de matrícula, proyección financiera, asistencia docente y cumplimiento de metas.',
      metric: 'Métricas en Tiempo Real',
      iconName: 'TrendingUp'
    }
  ],
  contactEmail: 'armando.villanueva@mycollege.com.mx',
  contactPhone: '+52 (55) 8432-9000',
  contactWhatsapp: '+52 55 1234 5678',
  address: 'Corporativo Santa Fe, Ciudad de México, México',
  schedule: 'Lunes a Viernes de 8:00 AM a 6:30 PM (Soporte de Guardia 24/7 para Directores)',
  supportEmail: 'soporte@mycollege.com.mx',
  salesPhone: '+52 (55) 8432-9001',
  linkedinUrl: 'https://linkedin.com/company/mycollege',
  facebookUrl: 'https://facebook.com/mycollege.mx',
  instagramUrl: 'https://instagram.com/mycollege.mx',
  youtubeUrl: 'https://youtube.com/@mycollege',
  heroHighlights: [
    'Cobranza y Facturación CFDI 4.0',
    'App Móvil con Identidad del Colegio',
    'Boletas Oficiales SEP y Kárdex Digital',
    'Ciberseguridad y Resguardo Cloud'
  ],
  heroMetrics: [
    { value: '99.8%', label: 'Puntualidad en Pagos' },
    { value: '+120', label: 'Colegios Afiliados' },
    { value: '15 seg', label: 'Pase de Lista Digital' }
  ],
  heroCard: {
    headerTitle: 'my college',
    headerSubtitle: 'Ciclo Escolar 2026 – 2027',
    badgeStatus: 'En Línea',
    schoolName: 'Colegio Privado Modelo',
    schoolSubtitle: 'Gestión Integral Centralizada • Primaria, Secundaria y Preparatoria',
    items: [
      {
        title: 'Kárdex & Calificaciones',
        subtitle: 'Boletas SEP 100% digitalizadas',
        badge: '100% Al día',
        iconType: 'kardex'
      },
      {
        title: 'Cobranza Automatizada',
        subtitle: 'CFDI 4.0 timbrado al instante',
        badge: '+98.5% Cobrado',
        iconType: 'cobranza'
      },
      {
        title: 'App Familias & Alumnos',
        subtitle: 'Circulares, avisos y tareas push',
        badge: 'Push Activo',
        iconType: 'app'
      }
    ],
    footerSecurity: 'Servidores Cloud Cifrados',
    footerAvailability: 'Disponibilidad 99.9%'
  },
  cardColors: {
    cardBg: '#FFFFFF',
    cardBorder: '#D4AF37',
    cardText: '#081D3C',
    cardAccent: '#D4AF37',
    cardRadius: 'rounded-3xl',
    cardGlow: true,
  },
  textAlignment: 'left',
  heroAlignment: 'left',
};

export const defaultProducts: PlatformProduct[] = [
  {
    id: 'prod-academico',
    name: 'Control Escolar & Académico Integral',
    tagline: 'Kárdex digital, boletas oficiales y actas en un clic',
    category: 'Academico',
    badge: 'Módulo Principal',
    description: 'Gestiona planes de estudio, asignaturas, captura de calificaciones por periodos ponderados, cálculo automático de promedios, generación de boletas oficiales adaptadas al formato del colegio y control de asistencias.',
    features: [
      'Configuración de escalas numéricas, literales o porcentuales',
      'Emisión de boletas con membrete y sello digital en PDF',
      'Historial académico completo (kárdex) del alumno',
      'Control de incidencias de conducta y observaciones pedagógicas',
      'Cumplimiento de estándares de validación escolar'
    ],
    targetRoles: ['Directores Académicos', 'Coordinadores', 'Control Escolar'],
    icon: 'GraduationCap',
    order: 1
  },
  {
    id: 'prod-cobranza',
    name: 'Cobranza Escolar & Facturación Electrónica CFDI',
    tagline: 'Cero filas en caja y conciliación bancaria automática',
    category: 'Finanzas',
    badge: 'Mayor ROI',
    description: 'Automatiza la emisión de colegiaturas, cargos por inscripción, transporte, talleres y materiales. Los padres pagan vía tarjeta, transferencia SPEI con referencia única o tiendas de conveniencia con timbrado fiscal automático.',
    features: [
      'Facturación electrónica automática con complemento educativo IEDU',
      'Generación de referencias bancarias personalizadas y códigos QR',
      'Cálculo automático de recargos por mora y descuentos por pronto pago',
      'Conciliación bancaria en tiempo real sin trabajo manual',
      'Envío de estados de cuenta detallados por WhatsApp y correo'
    ],
    targetRoles: ['Dirección Administrativa', 'Contabilidad', 'Caja'],
    icon: 'Receipt',
    order: 2
  },
  {
    id: 'prod-app-familias',
    name: 'App Móvil para Familias & Alumnos (iOS / Android)',
    tagline: 'La escuela en la palma de la mano de los padres',
    category: 'Comunicacion',
    badge: 'Experiencia Premium',
    description: 'Una aplicación moderna y con la identidad visual del colegio que conecta a la comunidad escolar. Los padres reciben notificaciones instantáneas de tareas, circulares con acuse de recibido digital, eventos en calendario y pagos en línea.',
    features: [
      'Notificaciones push inmediatas de avisos urgentes y eventos',
      'Consulta de calificaciones desglosadas por materia y periodo',
      'Agenda de tareas, exámenes y proyectos con recordatorios',
      'Pago directo de colegiaturas desde la app con un toque',
      'Justificación de inasistencias y buzón de dudas institucionales'
    ],
    targetRoles: ['Padres de Familia', 'Tutores', 'Estudiantes'],
    icon: 'Smartphone',
    order: 3
  },
  {
    id: 'prod-portal-docente',
    name: 'Portal del Profesor 360',
    tagline: 'Menos burocracia, más tiempo para enseñar',
    category: 'Gestion',
    badge: 'Fácil Adopción',
    description: 'Los profesores acceden desde cualquier computadora o tableta para pasar lista en segundos, subir calificaciones con guardado automático, registrar rúbricas y compartir avisos con sus grupos sin exponer su número telefónico personal.',
    features: [
      'Pase de lista diario por lista o vista de pupitre en 15 segundos',
      'Captura rápida de calificaciones con validación de rangos',
      'Planeación didáctica y repositorio de recursos compartidos',
      'Canal de comunicación seguro con padres sin WhatsApp personal',
      'Visualización de cumpleaños y datos médicos relevantes de alumnos'
    ],
    targetRoles: ['Cuerpo Docente', 'Titulares de Grupo', 'Profesores de Taller'],
    icon: 'Users',
    order: 4
  },
  {
    id: 'prod-admisiones',
    name: 'Admisiones & Matrícula Online',
    tagline: 'Convierte prospectos en alumnos inscritos ágilmente',
    category: 'Gestion',
    badge: 'Captación de Matrícula',
    description: 'Digitaliza todo el embudo de admisión: desde el primer formulario en tu página web, agendamiento de citas para Open House o exámenes de admisión, hasta la carga de documentos oficiales y pago de inscripción en línea.',
    features: [
      'Formulario digital de inscripción embebible en tu sitio web',
      'Seguimiento tipo CRM de familias interesadas en cada ciclo',
      'Validación digital de documentos (actas, CURP, cartillas)',
      'Asignación automática de grupos y matrícula una vez pagada'
    ],
    targetRoles: ['Admisiones', 'Relaciones Públicas', 'Dirección General'],
    icon: 'UserPlus',
    order: 5
  },
  {
    id: 'prod-seguridad',
    name: 'Seguridad Escolar & Entrega Controlada',
    tagline: 'Tranquilidad total para la comunidad escolar',
    category: 'Seguridad',
    badge: 'Alta Seguridad',
    description: 'Sistema integral para el control de accesos peatonales y vehiculares en las instalaciones del colegio. Código QR dinámico para entrega de alumnos a personas expresamente autorizadas por los padres.',
    features: [
      'Credencial digital con fotografía y código de seguridad',
      'Entrega segura de alumnos en puerta con confirmación en pantalla',
      'Registro de visitantes con fotografía y escaneo de identificación',
      'Bitácora histórica de ingresos y salidas con marcas de tiempo'
    ],
    targetRoles: ['Seguridad en Puerta', 'Prefectura', 'Directores'],
    icon: 'ShieldCheck',
    order: 6
  }
];

export const defaultUpdates: PlatformUpdate[] = [
  {
    id: 'upd-1',
    title: 'Lanzamiento del Motor de Facturación CFDI 4.0 con Complemento IEDU 2026',
    summary: 'Actualizamos nuestro motor de timbrado automático para cumplir con las últimas disposiciones del SAT para deducción de colegiaturas.',
    content: 'Nos complace anunciar la liberación de la versión 4.2 del módulo de Facturación Escolar de My College. Ahora los colegios privados pueden emitir masivamente los comprobantes fiscales con el complemento IEDU (Instituciones Educativas Privadas), permitiendo a los padres deducir impuestos de manera automática sin intervención manual del personal contable.',
    category: 'Finanzas y Fiscal',
    date: '25 de Septiembre de 2026',
    badge: 'Nuevo Módulo',
    author: 'Equipo de Producto My College',
    isPublished: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'upd-2',
    title: 'Nueva Versión de la App Móvil para Familias con Modo Offline y Calendario Dinámico',
    summary: 'La versión 3.8 de la App My College incluye sincronización inteligente de eventos, justificantes médicos y pagos rápidos.',
    content: 'Los padres de familia ahora disfrutan de una experiencia más fluida: el calendario institucional se sincroniza directamente con Google Calendar y Apple Calendar, permitiendo marcar recordatorios de juntas de padres, festivales deportivos y semanas de evaluación sin perder detalle.',
    category: 'App Móvil',
    date: '18 de Septiembre de 2026',
    badge: 'Actualización App',
    author: 'Innovación Tecnológica',
    isPublished: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'upd-3',
    title: 'Integración de Entrega Segura por QR Dinámico en Puerta Escolar',
    summary: 'Optimizamos los tiempos de salida de los alumnos de primaria y preescolar en un 40% garantizando máxima seguridad.',
    content: 'El nuevo sistema de Entrega Segura permite a los directores y prefectos verificar al instante en tabletas si la persona que acude por el alumno está autorizada en la plataforma, generando alertas si el tutor ha delegado temporalmente la recogida a un familiar con código verificado.',
    category: 'Seguridad Escolar',
    date: '02 de Septiembre de 2026',
    badge: 'Seguridad',
    author: 'Dirección de Operaciones',
    isPublished: true,
    createdAt: new Date().toISOString()
  }
];

export const defaultPrivacyPolicy: PrivacyPolicyContent = {
  title: 'Política de Privacidad y Protección de Datos Personales',
  lastUpdated: 'Septiembre 2026',
  introduction: 'En My College (en adelante "La Plataforma"), operada en beneficio de instituciones educativas privadas y su comunidad escolar, la privacidad, confidencialidad y resguardo de los datos personales —en especial los relativos a niñas, niños y adolescentes— constituyen un compromiso prioritario e innegociable.',
  sections: [
    {
      id: 'sec-1',
      title: '1. Responsable del Tratamiento de los Datos',
      content: 'My College actúa en calidad de Encargado y/o Responsable del tratamiento de datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y estándares internacionales de ciberseguridad. Los datos son tratados exclusivamente con la finalidad de proveer los servicios de gestión académica, administrativa, financiera y de comunicación contratados por los Colegios Privados.'
    },
    {
      id: 'sec-2',
      title: '2. Información que Recabamos',
      content: 'Para la operación de la plataforma escolar, se recaban datos de identificación de los estudiantes (nombre completo, CURP o identificación oficial, fecha de nacimiento, grupo, grado), datos de contacto de padres o tutores (correo electrónico, teléfono, domicilio), registros académicos (calificaciones, asistencia, reportes pedagógicos) e información fiscal para la emisión de comprobantes de pago de colegiaturas.'
    },
    {
      id: 'sec-3',
      title: '3. Protección Especial de Datos de Menores de Edad',
      content: 'Reconocemos el interés superior de la niñez. La información de los alumnos menores de edad únicamente es accesible para el personal docente y directivo debidamente acreditado del colegio, así como para sus padres o tutores legales. No comercializamos, cedemos ni utilizamos bajo ninguna circunstancia datos de menores para fines publicitarios, mercadológicos ni de perfilamiento comercial.'
    },
    {
      id: 'sec-4',
      title: '4. Medidas de Seguridad y Encriptación',
      content: 'Implementamos protocolos de seguridad informática de grado bancario, incluyendo cifrado en tránsito (TLS 1.3 con certificados SSL de 256 bits), cifrado en reposo en bases de datos Firestore/Cloud de alta disponibilidad, autenticación con tokens seguros, registros de auditoría y copias de respaldo continuas.'
    },
    {
      id: 'sec-5',
      title: '5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)',
      content: 'Los titulares o sus representantes legales pueden ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación u Oposición respecto de sus datos personales, contactando a nuestro Oficial de Privacidad a través del correo armando.villanueva@mycollege.com.mx o mediante la coordinación administrativa del colegio respectivo.'
    },
    {
      id: 'sec-6',
      title: '6. Cambios a esta Política',
      content: 'Cualquier modificación a esta Política de Privacidad será publicada de manera visible en este portal y notificada a los colegios afiliados con antelación a su entrada en vigor.'
    }
  ],
  dataProtectionOfficer: 'Oficial de Cumplimiento y Protección de Datos - My College',
  contactEmail: 'armando.villanueva@mycollege.com.mx'
};
