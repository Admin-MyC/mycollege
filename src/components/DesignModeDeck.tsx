import React from 'react';
import { 
  Palette, 
  Settings, 
  Save, 
  CheckCircle2, 
  X, 
  ArrowUpDown,
  PhoneCall,
  LayoutGrid
} from 'lucide-react';
import { CMSTab } from './AdminCMSModal';

interface DesignModeDeckProps {
  onOpenOrderDrawer: () => void;
  onOpenCMS: (tab?: CMSTab) => void;
  onSaveAllToDatabase: () => Promise<void>;
  onExitDesignMode: () => void;
  isSaving: boolean;
  saveSuccessMessage: string | null;
}

export const DesignModeDeck: React.FC<DesignModeDeckProps> = ({
  onOpenOrderDrawer,
  onOpenCMS,
  onSaveAllToDatabase,
  onExitDesignMode,
  isSaving,
  saveSuccessMessage,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-[#061426] text-white border-b-2 border-[#D4AF37] px-4 py-2.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Status indicator & official theme */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#081D3C] font-black tracking-wide uppercase text-xs shadow-md">
            <Palette className="w-4 h-4" />
            <span>MODO DISEÑO & EDICIÓN</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-white/90">
            <span className="text-white/60">Paleta Oficial:</span>
            <span className="font-bold text-[#F5B82E] bg-[#0B2545] px-2.5 py-0.5 rounded-lg border border-[#D4AF37]/30">
              Blanco (Mayormente) • Azul • Dorado
            </span>
          </div>

          {saveSuccessMessage && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Acomodar Apartados (Reorder Sections) */}
          <button
            onClick={onOpenOrderDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2545] hover:bg-[#0E2F57] text-[#F5B82E] border border-[#D4AF37]/50 font-extrabold shadow-sm transition-all"
            title="Acomodar el orden de todos los apartados de la página"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Acomodar Apartados</span>
          </button>

          {/* Colores de Recuadros */}
          <button
            onClick={() => onOpenCMS('cards')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2545] hover:bg-[#0E2F57] text-[#F5B82E] border border-[#D4AF37]/40 font-bold shadow-sm transition-all"
            title="Personalizar los colores de fondo, bordes y orlas de los recuadros"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Colores Recuadros</span>
          </button>

          {/* Medios de Contacto */}
          <button
            onClick={() => onOpenCMS('contact')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2545] hover:bg-[#0E2F57] text-white border border-[#D4AF37]/30 font-bold shadow-sm transition-all"
            title="Editar correos, teléfonos y WhatsApp"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden md:inline">Contactos</span>
          </button>

          {/* Editar Textos CMS */}
          <button
            onClick={() => onOpenCMS('general')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2545] hover:bg-[#0E2F57] text-white border border-[#D4AF37]/30 font-bold shadow-sm transition-all"
            title="Editar textos del Hero, Tarjeta del Campus, Misión, Visión y Nosotros"
          >
            <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden md:inline">Editar Textos & Hero</span>
          </button>

          {/* MASTER SAVE BUTTON: Guardar Todo Tal Cual en Firestore */}
          <button
            onClick={onSaveAllToDatabase}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-black shadow-lg shadow-[#D4AF37]/25 border border-[#FDE382] transition-all"
            title="Guardar de forma definitiva todos los cambios, el orden, los colores y los textos en Firebase Firestore"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando en BD...' : 'GUARDAR EN BD'}</span>
          </button>

          {/* Exit / Cerrar Sesión */}
          <button
            onClick={onExitDesignMode}
            className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold transition-colors ml-1"
            title="Cerrar Modo Diseño"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
