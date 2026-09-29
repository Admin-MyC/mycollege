import React, { useState } from 'react';
import { PlatformUpdate } from '../types';
import { useAppTheme } from '../themeContext';
import { 
  Bell, 
  Calendar, 
  ArrowRight, 
  PlusCircle, 
  User, 
  X,
  Sparkles
} from 'lucide-react';

interface UpdatesSectionProps {
  updates: PlatformUpdate[];
  isAdmin?: boolean;
  onOpenAdminToUpdates: () => void;
  textAlign?: 'left' | 'center';
}

export const UpdatesSection: React.FC<UpdatesSectionProps> = ({
  updates,
  isAdmin = false,
  onOpenAdminToUpdates,
  textAlign,
}) => {
  const { themeConfig } = useAppTheme();
  const [selectedUpdate, setSelectedUpdate] = useState<PlatformUpdate | null>(null);
  const isLight = themeConfig.navVariant === 'light';
  const isCentered = textAlign === 'center';

  return (
    <section
      id="actualizaciones"
      className={`py-20 relative transition-colors duration-300 border-t-2 border-[#D4AF37]/20 ${
        isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-6 mb-14 ${isCentered ? 'text-center' : ''}`}>
          <div className={isCentered ? 'mx-auto' : ''}>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0B2545] text-[#F5B82E] border-2 border-[#D4AF37] mb-3 ${isCentered ? 'mx-auto' : ''}`}>
              <Bell className="w-3.5 h-3.5" />
              <span>NOVEDADES & LIBERACIONES EN VIVO</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
              isLight ? 'text-[#081D3C]' : 'text-white'
            }`}>
              Actualizaciones del Sistema
            </h2>
            <p className={`mt-2 text-sm sm:text-base ${
              isLight ? 'text-[#081D3C]/80' : 'text-white/85'
            }`}>
              Descubre las mejoras pedagógicas, fiscales y tecnológicas más recientes de My College.
            </p>
          </div>

          {/* Action: Only visible to authenticated admin */}
          {isAdmin ? (
            <button
              onClick={onOpenAdminToUpdates}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs sm:text-sm shadow-lg shadow-[#D4AF37]/20 transition-all shrink-0 border border-[#FDE382]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Nueva Actualización</span>
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-[#D4AF37] bg-[#0B2545] px-4 py-2 rounded-xl border border-[#D4AF37]/30">
              <Sparkles className="w-4 h-4" />
              <span>Boletín de Innovación Continua</span>
            </div>
          )}
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.map((update) => (
            <article
              key={update.id}
              onClick={() => setSelectedUpdate(update)}
              className={`p-6 sm:p-7 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between group shadow-lg ${
                isLight
                  ? 'bg-white border-[#081D3C]/15 hover:border-[#D4AF37] hover:shadow-xl'
                  : 'bg-[#0B2545] border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-2xl'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#081D3C] text-[#F5B82E] border border-[#D4AF37]/40">
                    {update.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className={isLight ? 'text-[#081D3C]/70' : 'text-white/70'}>{update.date}</span>
                  </div>
                </div>

                <h3 className={`text-xl font-bold font-serif mb-3 leading-snug group-hover:text-[#D4AF37] transition-colors ${
                  isLight ? 'text-[#081D3C]' : 'text-white'
                }`}>
                  {update.title}
                </h3>

                <p className={`text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6 ${
                  isLight ? 'text-[#081D3C]/75' : 'text-white/80'
                }`}>
                  {update.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs font-bold text-[#D4AF37]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]">{update.author || 'Equipo My College'}</span>
                </div>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Leer detalle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081D3C]/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#081D3C] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUpdate(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#0B2545] text-white hover:text-[#D4AF37] border border-[#D4AF37]/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#D4AF37] text-[#081D3C]">
                {selectedUpdate.category}
              </span>
              <span className="text-xs text-white/70">{selectedUpdate.date}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-4 text-white">
              {selectedUpdate.title}
            </h3>

            <div className="p-4 rounded-2xl bg-[#0B2545] border border-[#D4AF37]/30 mb-6">
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic">
                "{selectedUpdate.summary}"
              </p>
            </div>

            <div className="text-xs sm:text-sm text-white/80 leading-relaxed space-y-4 whitespace-pre-line">
              {selectedUpdate.content}
            </div>

            <div className="mt-8 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-white/60">
              <span>Publicado por: <strong className="text-white">{selectedUpdate.author || 'Equipo My College'}</strong></span>
              <button
                onClick={() => setSelectedUpdate(null)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#081D3C] font-bold text-xs hover:bg-[#F5B82E]"
              >
                Cerrar Noticia
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
