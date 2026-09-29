import React from 'react';
import { SectionItem } from '../types';
import { useAppTheme } from '../themeContext';
import { Sparkles, CheckCircle2, Bookmark } from 'lucide-react';

interface CustomSectionProps {
  section: SectionItem;
}

export const CustomSection: React.FC<CustomSectionProps> = ({ section }) => {
  const { themeConfig, cardColors } = useAppTheme();
  const isLight = themeConfig.navVariant === 'light';
  const isCentered = section.textAlign === 'center';

  const paragraphs = (section.customContent || '')
    .split('\n')
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <section 
      id={section.id} 
      className={`py-20 border-t-2 border-[#D4AF37]/20 relative transition-colors duration-300 ${
        isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-12 ${isCentered ? 'text-center mx-auto' : 'text-left'}`}>
          {section.badge && (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#081D3C] text-[#F5B82E] border-2 border-[#D4AF37] mb-3 ${isCentered ? 'mx-auto' : ''}`}>
              <Bookmark className="w-3.5 h-3.5" />
              <span>{section.badge.toUpperCase()}</span>
            </div>
          )}

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-[#081D3C]' : 'text-white'
          }`}>
            {section.customTitle || section.name}
          </h2>

          {section.customSubtitle && (
            <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
              isLight ? 'text-[#081D3C]/80' : 'text-white/85'
            }`}>
              {section.customSubtitle}
            </p>
          )}
        </div>

        {/* Content Box */}
        {paragraphs.length > 0 && (
          <div 
            style={{
              backgroundColor: cardColors?.cardBg || '#FFFFFF',
              borderColor: cardColors?.cardBorder || '#D4AF37',
              color: cardColors?.cardText || '#081D3C',
            }}
            className={`p-8 sm:p-10 rounded-3xl border-2 shadow-xl ${
              cardColors?.cardGlow ? 'shadow-[0_0_25px_rgba(212,175,55,0.15)]' : ''
            } ${isCentered ? 'text-center mx-auto max-w-4xl' : 'text-left max-w-4xl'}`}
          >
            <div className="space-y-4">
              {paragraphs.map((p, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 text-sm sm:text-base leading-relaxed ${
                    isCentered ? 'justify-center items-center' : 'items-start'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="font-medium opacity-90">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
