import React from 'react';
import { SectionItem, SectionId } from '../types';
import { 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Edit3, 
  GripVertical,
  CheckCircle2,
  Sparkles,
  AlignLeft,
  AlignCenter,
  Trash2
} from 'lucide-react';

interface SectionContainerProps {
  section: SectionItem;
  index: number;
  totalSections: number;
  isDesignMode: boolean;
  onMoveUp: (id: SectionId) => void;
  onMoveDown: (id: SectionId) => void;
  onToggleVisibility: (id: SectionId) => void;
  onEditSection: (id: SectionId) => void;
  onToggleTextAlign?: (id: SectionId) => void;
  onRemoveSection?: (id: SectionId) => void;
  children: React.ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  section,
  index,
  totalSections,
  isDesignMode,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onEditSection,
  onToggleTextAlign,
  onRemoveSection,
  children,
}) => {
  // If not in design mode and section is hidden, don't render
  if (!isDesignMode && !section.visible) {
    return null;
  }

  if (!isDesignMode) {
    return <div id={section.id}>{children}</div>;
  }

  return (
    <div 
      id={section.id} 
      className={`relative my-6 transition-all rounded-3xl ${
        section.visible 
          ? 'ring-2 ring-dashed ring-[#D4AF37] p-2 bg-[#0B2545]/10' 
          : 'ring-2 ring-dashed ring-rose-400/50 p-2 bg-rose-950/20 opacity-60'
      }`}
    >
      {/* Design Mode Header Toolbar on Top of Section */}
      <div className="sticky top-20 z-30 mb-3 flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#081D3C] text-white border-2 border-[#D4AF37] shadow-2xl">
        
        {/* Left: Section Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#D4AF37] text-[#081D3C] flex items-center justify-center font-bold text-xs">
            #{index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white font-serif">
                {section.name}
              </span>
              {section.badge && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#0B2545] text-[#F5B82E] border border-[#D4AF37]/40">
                  {section.badge}
                </span>
              )}
              {section.textAlign === 'center' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-400/30">
                  Centrado
                </span>
              )}
            </div>
            {!section.visible && (
              <span className="text-[11px] text-rose-300 font-bold">
                (Oculto para los visitantes)
              </span>
            )}
          </div>
        </div>

        {/* Right: Section Controls (Move Up, Move Down, Alignment, Visibility, Remove, Edit) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Move Up */}
          <button
            onClick={() => onMoveUp(section.id)}
            disabled={index === 0}
            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
              index === 0
                ? 'opacity-30 border-white/20 text-white/40 cursor-not-allowed'
                : 'bg-[#0B2545] hover:bg-[#D4AF37] hover:text-[#081D3C] text-[#F5B82E] border-[#D4AF37]/50'
            }`}
            title="Mover este apartado arriba"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Subir</span>
          </button>

          {/* Move Down */}
          <button
            onClick={() => onMoveDown(section.id)}
            disabled={index === totalSections - 1}
            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
              index === totalSections - 1
                ? 'opacity-30 border-white/20 text-white/40 cursor-not-allowed'
                : 'bg-[#0B2545] hover:bg-[#D4AF37] hover:text-[#081D3C] text-[#F5B82E] border-[#D4AF37]/50'
            }`}
            title="Mover este apartado abajo"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Bajar</span>
          </button>

          {/* Toggle Text Alignment */}
          {onToggleTextAlign && (
            <button
              onClick={() => onToggleTextAlign(section.id)}
              className="p-1.5 px-2 rounded-lg bg-[#0B2545] border border-[#D4AF37]/50 text-[#F5B82E] hover:bg-[#D4AF37] hover:text-[#081D3C] text-xs font-bold flex items-center gap-1 transition-all"
              title={section.textAlign === 'center' ? 'Alinear a la izquierda' : 'Centrar textos'}
            >
              {section.textAlign === 'center' ? <AlignLeft className="w-3.5 h-3.5" /> : <AlignCenter className="w-3.5 h-3.5" />}
              <span className="hidden md:inline text-[11px]">{section.textAlign === 'center' ? 'Izq' : 'Centrar'}</span>
            </button>
          )}

          {/* Toggle Visibility */}
          <button
            onClick={() => onToggleVisibility(section.id)}
            className={`p-1.5 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
              section.visible
                ? 'bg-[#0B2545] text-white border-[#D4AF37]/40 hover:bg-white/10'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30'
            }`}
            title={section.visible ? 'Ocultar apartado en la página pública' : 'Mostrar apartado en la página pública'}
          >
            {section.visible ? <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{section.visible ? 'Visible' : 'Oculto'}</span>
          </button>

          {/* Quitar Apartado */}
          {onRemoveSection && (
            <button
              onClick={() => {
                if (confirm(`¿Quitar el apartado "${section.name}" de la página? Podrás volver a agregarlo en cualquier momento.`)) {
                  onRemoveSection(section.id);
                }
              }}
              className="p-1.5 px-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
              title="Quitar este apartado de la página"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Quitar</span>
            </button>
          )}

          {/* Edit Section Content */}
          <button
            onClick={() => onEditSection(section.id)}
            className="p-1.5 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
            title="Editar textos e información de este apartado"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
        </div>

      </div>

      {/* Actual Section Content */}
      <div className={section.visible ? '' : 'pointer-events-none'}>
        {children}
      </div>
    </div>
  );
};
