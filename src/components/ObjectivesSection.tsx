import React from 'react';
import { SiteContent } from '../types';
import { useAppTheme } from '../themeContext';
import { 
  Target, 
  CreditCard, 
  FileCheck, 
  Smartphone, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle
} from 'lucide-react';

interface ObjectivesSectionProps {
  content: SiteContent;
  onOpenAdmin: () => void;
  textAlign?: 'left' | 'center';
}

export const ObjectivesSection: React.FC<ObjectivesSectionProps> = ({ content, textAlign }) => {
  const { themeConfig } = useAppTheme();
  const isLight = themeConfig.navVariant === 'light';
  const isCentered = textAlign ? textAlign === 'center' : (content.textAlignment === 'center' || true);

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-6 h-6" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const objectives = content.objectives || [];

  return (
    <section
      id="objetivos"
      className={`py-20 relative transition-colors duration-300 border-t-2 border-[#D4AF37]/20 ${
        isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-16 ${isCentered ? 'text-center mx-auto' : 'text-left'}`}>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0B2545] text-[#F5B82E] border-2 border-[#D4AF37] mb-3 ${isCentered ? 'mx-auto' : ''}`}>
            <Target className="w-3.5 h-3.5" />
            <span>METAS & RESULTADOS VERIFICABLES</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-[#081D3C]' : 'text-white'
          }`}>
            Nuestros Objetivos Estratégicos
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${
            isLight ? 'text-[#081D3C]/80' : 'text-white/85'
          }`}>
            Diseñamos soluciones orientadas a resultados concretos que transforman la gestión de los colegios privados en semanas.
          </p>
        </div>

        {/* Objectives Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectives.map((obj, idx) => (
            <div
              key={obj.id || idx}
              className={`p-7 rounded-3xl border-2 border-[#D4AF37]/35 shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-[#D4AF37] hover:-translate-y-1 ${
                isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-[#081D3C] text-[#D4AF37] border-2 border-[#D4AF37]/40">
                    {renderIcon(obj.iconName)}
                  </div>
                  {obj.metric && (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#081D3C] text-[#F5B82E] border border-[#D4AF37]">
                      {obj.metric}
                    </span>
                  )}
                </div>

                <h3 className={`text-lg sm:text-xl font-bold mb-3 ${
                  isLight ? 'text-[#081D3C]' : 'text-white'
                }`}>
                  {obj.title}
                </h3>

                <p className={`text-sm leading-relaxed ${
                  isLight ? 'text-[#081D3C]/75' : 'text-white/80'
                }`}>
                  {obj.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D4AF37]/30 flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Impacto Institucional Garantizado</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
