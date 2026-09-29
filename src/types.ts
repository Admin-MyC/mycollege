export type DesignTheme = 'prestige' | 'modern' | 'minimal' | 'impact';

export type SectionId = 
  | 'hero' 
  | 'nosotros' 
  | 'mision-vision' 
  | 'objetivos' 
  | 'productos' 
  | 'calculadora' 
  | 'actualizaciones' 
  | 'testimonios' 
  | 'contacto'
  | string;

export interface SectionItem {
  id: SectionId;
  name: string;
  visible: boolean;
  badge?: string;
  description?: string;
  textAlign?: 'left' | 'center';
  isCustom?: boolean;
  customTitle?: string;
  customSubtitle?: string;
  customContent?: string;
}

export interface PageLayoutConfig {
  sections: SectionItem[];
  updatedAt?: string;
}

export const DEFAULT_PAGE_SECTIONS: SectionItem[] = [
  { id: 'hero', name: 'Encabezado Principal (Hero & Escudo)', visible: true, textAlign: 'left', badge: 'Identidad', description: 'Titular, propuesta de valor, llamado al Webinar y escudo oficial' },
  { id: 'nosotros', name: 'Quiénes Somos (Nosotros & Pilares)', visible: true, textAlign: 'left', badge: 'Institucional', description: 'Historia, razón de ser y sello de calidad escolar' },
  { id: 'mision-vision', name: 'Misión, Visión & Valores', visible: true, textAlign: 'left', badge: 'Propósito', description: 'Compromiso pedagógico, visión de futuro y valores rectores' },
  { id: 'objetivos', name: 'Objetivos Estratégicos & Métricas', visible: true, textAlign: 'left', badge: 'Resultados', description: 'Metas cuantitativas: morosidad, tiempo administrativo y satisfacción' },
  { id: 'productos', name: 'Nuestros Módulos & Software', visible: true, textAlign: 'left', badge: 'Soluciones', description: 'Control escolar, cobranza CFDI, app familias y portal docente' },
  { id: 'calculadora', name: 'Calculadora de Ahorro y ROI', visible: true, textAlign: 'left', badge: 'Interactivo', description: 'Simulador dinámico de ahorro de horas y costos para el colegio' },
  { id: 'actualizaciones', name: 'Actualizaciones & Novedades', visible: true, textAlign: 'left', badge: 'Blog', description: 'Publicaciones y mejoras continuas de la plataforma' },
  { id: 'testimonios', name: 'Testimonios Escolares', visible: true, textAlign: 'left', badge: 'Social Proof', description: 'Opiniones y recomendaciones de directores de colegios privados' },
  { id: 'contacto', name: 'Contacto & Agendar Webinar', visible: true, textAlign: 'left', badge: 'Conversión', description: 'Formulario de solicitud de webinar en vivo conectado a Firestore' },
];

export interface ObjectiveItem {
  id: string;
  title: string;
  description: string;
  metric?: string;
  iconName?: string;
}

export interface CardColorSettings {
  cardBg: string;        // Color de fondo de los recuadros (ej. #0B2545)
  cardBorder: string;    // Color del borde de los recuadros (ej. #D4AF37)
  cardText: string;      // Color de texto interior (ej. #FFFFFF)
  cardAccent: string;    // Color de acentos y badges interiores (ej. #F5B82E)
  cardRadius?: string;   // rounded-2xl | rounded-3xl | rounded-xl
  cardGlow?: boolean;    // Resplandor dorado suave
}

export const DEFAULT_CARD_COLORS: CardColorSettings = {
  cardBg: '#FFFFFF',
  cardBorder: '#D4AF37',
  cardText: '#081D3C',
  cardAccent: '#D4AF37',
  cardRadius: 'rounded-3xl',
  cardGlow: true,
};

export interface SiteContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutSummary: string;
  aboutStory: string;
  mission: string;
  vision: string;
  values: Array<{ title: string; desc: string }>;
  objectives: ObjectiveItem[];
  // Medios de Contacto Editables
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  address: string;
  schedule: string;
  supportEmail?: string;
  salesPhone?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  // Hero Highlights (Lista de viñetas)
  heroHighlights?: string[];
  // Hero Métricas Inferiores (3 datos clave)
  heroMetrics?: Array<{ value: string; label: string }>;
  // Hero Tarjeta Flotante (Recuadro Derecho de la imagen)
  heroCard?: {
    headerTitle?: string;
    headerSubtitle?: string;
    badgeStatus?: string;
    schoolName?: string;
    schoolSubtitle?: string;
    items?: Array<{
      title: string;
      subtitle: string;
      badge: string;
      iconType?: 'kardex' | 'cobranza' | 'app' | 'check';
    }>;
    footerSecurity?: string;
    footerAvailability?: string;
  };
  // Personalización de Colores de Recuadros
  cardColors?: CardColorSettings;
  // Alineación de Textos
  textAlignment?: 'left' | 'center';
  heroAlignment?: 'left' | 'center';
  updatedAt?: string;
}

export interface PlatformProduct {
  id: string;
  name: string;
  tagline: string;
  category: 'Academico' | 'Finanzas' | 'Comunicacion' | 'Seguridad' | 'Gestion';
  description: string;
  badge?: string;
  features: string[];
  targetRoles: string[];
  icon: string;
  order: number;
}

export interface PlatformUpdate {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  badge?: string;
  author?: string;
  isPublished?: boolean;
  createdAt?: string;
}

export interface WebinarRequest {
  id?: string;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  studentCount: string;
  currentSystem?: string;
  webinarTopic?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  createdAt: string;
  status: 'pending' | 'scheduled' | 'completed';
}

export type DemoRequest = WebinarRequest;

export interface PrivacySection {
  id: string;
  title: string;
  content: string;
}

export interface PrivacyPolicyContent {
  title: string;
  lastUpdated: string;
  introduction: string;
  sections: PrivacySection[];
  dataProtectionOfficer: string;
  contactEmail: string;
}
