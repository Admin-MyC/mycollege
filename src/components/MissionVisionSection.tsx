import React from 'react';
import { SiteContent } from '../types';
import { useAppTheme } from '../themeContext';
import { Target, Compass } from 'lucide-react';

interface MissionVisionSectionProps {
  content: SiteContent;
  onOpenAdmin: () => void;
  textAlign?: 'left' | 'center';
}

export const MissionVisionSection: React.FC<MissionVisionSectionProps> = ({ content, textAlign }) => {
  const { themeConfig } = useAppTheme();
  const isLight = themeConfig.navVariant === 'light';
  const isCentered = textAlign ? textAlign === 'center' : (content.textAlignment === 'center' || true);

  return (
    <section
      id="mision-vision"
      className={`py-20 relative transition-colors duration-300 border-t-2 border-[#D4AF37]/20 ${
        isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-16 ${isCentered ? 'text-center mx-auto' : 'text-left'}`}>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#081D3C] text-[#F5B82E] border-2 border-[#D4AF37] mb-3 ${isCentered ? 'mx-auto' : ''}`}>
            <Compass className="w-3.5 h-3.5" />
            <span>PROPÓSITO & RUMBO INSTITUCIONAL</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-[#081D3C]' : 'text-white'
          }`}>
            Misión, Visión & Valores
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${
            isLight ? 'text-[#081D3C]/80' : 'text-white/85'
          }`}>
            Nuestros principios orientan cada línea de código y cada interacción con directores, maestros, alumnos y padres de familia.
          </p>
        </div>

        {/* Mission and Vision Dual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Misión Card */}
          <div className={`relative p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-xl overflow-hidden ${
            isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
          }`}>
            {/* Top Golden Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#D4AF37]" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="p-3.5 rounded-2xl bg-[#081D3C] text-[#D4AF37] border-2 border-[#D4AF37]/40">
                <Target className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#081D3C] bg-[#D4AF37] px-3.5 py-1 rounded-full font-sans">
                Nuestra Razón de Ser
              </span>
            </div>

            <h3 className={`text-2xl sm:text-3xl font-extrabold mb-4 font-serif ${
              isLight ? 'text-[#081D3C]' : 'text-white'
            }`}>
              Misión
            </h3>

            <p className={`text-base sm:text-lg leading-relaxed italic ${
              isLight ? 'text-[#081D3C]/85' : 'text-white/90'
            }`}>
              &ldquo;{content.mission || 'Empoderar a las instituciones educativas privadas con soluciones tecnológicas de vanguardia que simplifiquen su operación administrativa, fortalezcan la comunicación familiar y potencien el rendimiento académico en un entorno confiable, moderno y seguro.'}&rdquo;
            </p>

            <div className="mt-8 pt-6 border-t-2 border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#D4AF37] font-bold">
              <span>My College • Compromiso de Excelencia</span>
              <span>Propósito Permanente</span>
            </div>
          </div>

          {/* Visión Card */}
          <div className={`relative p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-xl overflow-hidden ${
            isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
          }`}>
            {/* Top Golden Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#D4AF37]" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="p-3.5 rounded-2xl bg-[#081D3C] text-[#D4AF37] border-2 border-[#D4AF37]/40">
                <Compass className="w-8 h-8" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#081D3C] bg-[#D4AF37] px-3.5 py-1 rounded-full font-sans">
                Hacia Dónde Vamos
              </span>
            </div>

            <h3 className={`text-2xl sm:text-3xl font-extrabold mb-4 font-serif ${
              isLight ? 'text-[#081D3C]' : 'text-white'
            }`}>
              Visión
            </h3>

            <p className={`text-base sm:text-lg leading-relaxed italic ${
              isLight ? 'text-[#081D3C]/85' : 'text-white/90'
            }`}>
              &ldquo;{content.vision || 'Ser el estándar tecnológico de excelencia para colegios y colegios bilingües en América Latina, liderando la transformación digital de la educación privada a través de innovación continua, calidez humana e inteligencia operativa.'}&rdquo;
            </p>

            <div className="mt-8 pt-6 border-t-2 border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#D4AF37] font-bold">
              <span>Horizontes 2026 - 2030</span>
              <span>Liderazgo en Educación Privada</span>
            </div>
          </div>

        </div>

        {/* Core Values Grid */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className={`text-xl sm:text-2xl font-bold font-serif ${
              isLight ? 'text-[#081D3C]' : 'text-white'
            }`}>
              Nuestros Valores Rectores
            </h3>
            <p className={`text-xs sm:text-sm mt-1 font-medium ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>
              Pilares éticos y profesionales que rigen nuestra plataforma y soporte
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(content.values || []).map((val, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border-2 border-[#D4AF37]/30 shadow-md ${
                  isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#081D3C] text-[#F5B82E] flex items-center justify-center font-black text-sm mb-4 border-2 border-[#D4AF37]">
                  0{idx + 1}
                </div>
                <h4 className="text-base font-bold mb-2 text-[#D4AF37]">
                  {val.title}
                </h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-[#081D3C]/75' : 'text-white/75'}`}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
