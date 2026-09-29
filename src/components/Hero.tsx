import React from 'react';
import { SiteContent } from '../types';
import { useAppTheme } from '../themeContext';
import { MyCollegeLogo } from './MyCollegeLogo';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Smartphone,
  CreditCard,
  Check
} from 'lucide-react';

interface HeroProps {
  content: SiteContent;
  onNavigateToDemo: () => void;
  onNavigateToProducts: () => void;
  textAlign?: 'left' | 'center';
}

export const Hero: React.FC<HeroProps> = ({
  content,
  onNavigateToDemo,
  onNavigateToProducts,
  textAlign,
}) => {
  const { themeConfig } = useAppTheme();
  const isLight = themeConfig.navVariant === 'light';
  const isCentered = textAlign === 'center' || content.heroAlignment === 'center' || content.textAlignment === 'center';

  // Dynamic Highlights from content or fallback
  const highlights = content.heroHighlights && content.heroHighlights.length > 0 
    ? content.heroHighlights 
    : [
        'Cobranza y Facturación CFDI 4.0',
        'App Móvil con Identidad del Colegio',
        'Boletas Oficiales SEP y Kárdex Digital',
        'Ciberseguridad y Resguardo Cloud'
      ];

  // Dynamic Metrics from content or fallback
  const metrics = content.heroMetrics && content.heroMetrics.length > 0
    ? content.heroMetrics
    : [
        { value: '99.8%', label: 'Puntualidad en Pagos' },
        { value: '+120', label: 'Colegios Afiliados' },
        { value: '15 seg', label: 'Pase de Lista Digital' }
      ];

  // Dynamic Hero Card
  const heroCard = content.heroCard || {};
  const cardItems = heroCard.items && heroCard.items.length > 0
    ? heroCard.items
    : [
        {
          title: 'Kárdex & Calificaciones',
          subtitle: 'Boletas SEP 100% digitalizadas',
          badge: '100% Al día',
          iconType: 'kardex' as const
        },
        {
          title: 'Cobranza Automatizada',
          subtitle: 'CFDI 4.0 timbrado al instante',
          badge: '+98.5% Cobrado',
          iconType: 'cobranza' as const
        },
        {
          title: 'App Familias & Alumnos',
          subtitle: 'Circulares, avisos y tareas push',
          badge: 'Push Activo',
          iconType: 'app' as const
        }
      ];

  const renderCardIcon = (type?: string) => {
    switch (type) {
      case 'cobranza':
        return <CreditCard className="w-4 h-4" />;
      case 'app':
        return <Smartphone className="w-4 h-4" />;
      case 'check':
        return <Check className="w-4 h-4" />;
      case 'kardex':
      default:
        return <GraduationCap className="w-4 h-4" />;
    }
  };

  return (
    <section id="inicio" className={`relative overflow-hidden transition-colors duration-300 ${themeConfig.heroBg} py-16 lg:py-24`}>
      {/* Decorative Aura: Strictly Gold & Blue */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#D4AF37]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 right-0 w-[500px] h-[400px] bg-[#081D3C]/10 blur-2xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className={`lg:col-span-7 space-y-6 ${
            isCentered 
              ? 'text-center flex flex-col items-center justify-center' 
              : 'text-center lg:text-left'
          }`}>
            
            {/* Golden Trust Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#D4AF37] bg-[#081D3C] text-xs sm:text-sm font-bold text-[#F5B82E] shadow-sm ${
              isCentered ? 'mx-auto' : ''
            }`}>
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{content.heroBadge || 'Tecnología Integral para la Educación de Élite'}</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] ${
              isLight ? 'text-[#081D3C]' : 'text-white'
            }`}>
              {content.heroTitle || 'La Plataforma Definitiva para la Gestión de Colegios'}
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl font-medium leading-relaxed max-w-2xl ${
              isCentered ? 'text-center mx-auto' : 'mx-auto lg:mx-0'
            } ${
              isLight ? 'text-[#081D3C]/80' : 'text-white/85'
            }`}>
              {content.heroSubtitle || 'Unificamos control escolar, cobranza y facturación electrónica, app para padres y planeación docente en un solo ecosistema elegante, seguro y de alto prestigio.'}
            </p>

            {/* Highlights List (Strictly Gold & Blue/White) */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm max-w-lg font-medium ${
              isCentered ? 'mx-auto justify-center text-center' : 'text-left mx-auto lg:mx-0'
            }`}>
              {highlights.map((item, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${isCentered ? 'justify-center' : ''}`}>
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className={isLight ? 'text-[#081D3C]' : 'text-white'}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={`pt-4 flex flex-col sm:flex-row items-center gap-4 ${
              isCentered ? 'justify-center' : 'justify-center lg:justify-start'
            }`}>
              <button
                onClick={onNavigateToDemo}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl text-base font-extrabold flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 ${themeConfig.primaryButton}`}
              >
                <span>Agendar Webinar Exclusivo</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onNavigateToProducts}
                className={`w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold transition-all ${themeConfig.secondaryButton}`}
              >
                Ver Módulos de la Plataforma
              </button>
            </div>

            {/* Key Trust Proof Metrics (Azul, Dorado y Blanco) */}
            <div className={`pt-6 border-t-2 border-[#D4AF37]/30 grid grid-cols-3 gap-4 ${
              isCentered ? 'text-center w-full max-w-lg' : 'text-center lg:text-left'
            }`}>
              {metrics.map((m, idx) => (
                <div key={idx}>
                  <div className="text-2xl sm:text-3xl font-black text-[#D4AF37]">{m.value}</div>
                  <div className={`text-xs font-bold ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Container in Azul, Dorado y Blanco */}
              <div className="relative rounded-3xl p-6 sm:p-8 bg-[#0B2545] text-white border-2 border-[#D4AF37] shadow-2xl">
                
                {/* Top Header of Card */}
                <div className="flex items-center justify-between pb-5 border-b border-[#D4AF37]/30">
                  <div className="flex items-center gap-3">
                    <MyCollegeLogo size="sm" showText={false} />
                    <div>
                      <div className="text-sm font-normal text-white">
                        {heroCard.headerTitle || 'my college'}
                      </div>
                      <div className="text-[11px] text-[#D4AF37] font-bold">
                        {heroCard.headerSubtitle || 'Ciclo Escolar 2026 – 2027'}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#081D3C] text-[#F5B82E] border border-[#D4AF37]">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                    {heroCard.badgeStatus || 'En Línea'}
                  </span>
                </div>

                {/* Central Shield Graphic Display */}
                <div className="py-6 flex flex-col items-center text-center">
                  <div className="relative group cursor-pointer my-2">
                    <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl rounded-full transform group-hover:scale-110 transition-transform duration-300" />
                    <MyCollegeLogo size="xl" layout="stacked" showText={true} animated={true} />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-[#F5B82E] font-serif">
                    {heroCard.schoolName || 'Colegio Privado Modelo'}
                  </h3>
                  <p className="text-xs text-white/80 max-w-xs mt-1">
                    {heroCard.schoolSubtitle || 'Gestión Integral Centralizada • Primaria, Secundaria y Preparatoria'}
                  </p>
                </div>

                {/* Modules Preview List */}
                <div className="space-y-2.5">
                  {cardItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#081D3C] border border-[#D4AF37]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
                          {renderCardIcon(item.iconType)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{item.title}</div>
                          <div className="text-[10px] text-white/70">{item.subtitle}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#F5B82E]">{item.badge}</span>
                    </div>
                  ))}
                </div>

                {/* Floating Bottom Info */}
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 flex items-center justify-between text-[11px] text-white/80">
                  <span className="flex items-center gap-1 text-[#F5B82E] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> {heroCard.footerSecurity || 'Servidores Cloud Cifrados'}
                  </span>
                  <span className="font-semibold">{heroCard.footerAvailability || 'Disponibilidad 99.9%'}</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
