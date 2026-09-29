import React from 'react';
import { SiteContent } from '../types';
import { useAppTheme } from '../themeContext';
import { MyCollegeLogo } from './MyCollegeLogo';
import { 
  Award, 
  Users, 
  Clock, 
  ShieldCheck
} from 'lucide-react';

interface AboutSectionProps {
  content: SiteContent;
  onOpenAdmin: () => void;
  textAlign?: 'left' | 'center';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content, textAlign }) => {
  const { themeConfig } = useAppTheme();
  const isLight = themeConfig.navVariant === 'light';
  const isCentered = textAlign ? textAlign === 'center' : (content.textAlignment === 'center' || true);

  return (
    <section id="nosotros" className={`py-20 border-t-2 border-[#D4AF37]/20 relative transition-colors duration-300 ${
      isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-16 ${isCentered ? 'text-center mx-auto' : 'text-left'}`}>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0B2545] text-[#F5B82E] border-2 border-[#D4AF37] mb-3 ${isCentered ? 'mx-auto' : ''}`}>
            <Award className="w-3.5 h-3.5" />
            <span>IDENTIDAD & COMPROMISO INSTITUCIONAL</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-[#081D3C]' : 'text-white'
          }`}>
            {content.aboutTitle || 'Quiénes Somos'}
          </h2>
          <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
            isLight ? 'text-[#081D3C]/80' : 'text-white/85'
          }`}>
            {content.aboutSummary || 'My College nació con la convicción de que los colegios privados de excelencia merecen herramientas tecnológicas a la altura de sus estándares pedagógicos y administrativos.'}
          </p>
        </div>

        {/* Two Column Layout: Story + Visual Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Escudo Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className={`p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37] w-full max-w-md text-center relative overflow-hidden shadow-2xl ${
              isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
            }`}>
              
              <div className="flex justify-center mb-6">
                <MyCollegeLogo size="lg" layout="stacked" showText={true} animated={true} />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-[#081D3C] text-[#F5B82E] text-xs font-bold uppercase tracking-wider mb-2 border border-[#D4AF37]/40">
                Sello de Calidad Escolar
              </div>

              <h3 className={`text-xl font-bold font-serif ${isLight ? 'text-[#081D3C]' : 'text-white'}`}>
                Diseñado Exclusivamente para Colegios
              </h3>

              <p className={`text-xs sm:text-sm mt-3 leading-relaxed ${isLight ? 'text-[#081D3C]/75' : 'text-white/80'}`}>
                Entendemos que cada colegio privado tiene su propio modelo educativo, su escudo, sus tradiciones y sus exigencias de servicio a los padres de familia.
              </p>

              <div className="mt-6 pt-6 border-t border-[#D4AF37]/30 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-black text-[#D4AF37]">100%</div>
                  <div className={`text-[11px] font-bold ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>Enfoque Privado</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#D4AF37]">24/7</div>
                  <div className={`text-[11px] font-bold ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>Soporte Directivo</div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Editorial Narrative & Institutional Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl ${
              isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
            }`}>
              <h3 className={`text-xl sm:text-2xl font-bold mb-4 font-serif ${
                isLight ? 'text-[#081D3C]' : 'text-white'
              }`}>
                Nuestra Trayectoria y Enfoque Especializado
              </h3>
              <p className={`text-sm sm:text-base leading-relaxed ${
                isLight ? 'text-[#081D3C]/80' : 'text-white/85'
              }`}>
                {content.aboutStory || 'Fundada por especialistas en dirección escolar y arquitectura de software, My College sustituye las hojas de cálculo dispersas, los softwares obsoletos y los grupos desordenados de mensajería con una plataforma centralizada en la nube que eleva el prestigio institucional y simplifica la vida de directores, maestros y familias.'}
              </p>
            </div>

            {/* 3 Value Propositions Pillars (Azul, Dorado y Blanco) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-5 rounded-2xl border-2 border-[#D4AF37]/30 shadow-md ${
                isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
              }`}>
                <div className="p-3 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 w-fit mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-1">
                  Seguridad Máxima
                </h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>
                  Cifrado de grado bancario para información de menores y cobros.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border-2 border-[#D4AF37]/30 shadow-md ${
                isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
              }`}>
                <div className="p-3 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 w-fit mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-1">
                  Ahorro Operativo
                </h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>
                  Más de 35 horas mensuales ahorradas por cada coordinador y docente.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border-2 border-[#D4AF37]/30 shadow-md ${
                isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
              }`}>
                <div className="p-3 rounded-xl bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/40 w-fit mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-1">
                  Familias Conectadas
                </h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>
                  Comunicación transparente que fortalece la retención de matrícula.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
