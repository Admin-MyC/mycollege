import React from 'react';
import { useAppTheme } from '../themeContext';
import { 
  ShieldCheck, 
  Settings, 
  Palette, 
  PlusCircle, 
  LogOut, 
  Database,
  Layers,
  Sparkles,
  PhoneCall,
  LayoutGrid
} from 'lucide-react';
import { CMSTab } from './AdminCMSModal';

interface AdminBarProps {
  onOpenCMS: (tab?: CMSTab) => void;
  onLogout: () => void;
  isDesignMode: boolean;
  onToggleDesignMode: () => void;
  onOpenOrderDrawer: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({ 
  onOpenCMS, 
  onLogout,
  isDesignMode,
  onToggleDesignMode,
  onOpenOrderDrawer
}) => {
  const { themeConfig } = useAppTheme();

  return (
    <div className="sticky top-0 z-50 bg-[#061426] text-white border-b-2 border-[#D4AF37] px-4 py-2 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Admin Status & Fixed Theme Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#081D3C] font-black tracking-wide uppercase text-[11px] shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Modo Directivo (desingMC)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-white/90">
            <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-white/60">Paleta Oficial:</span>
            <span className="font-bold text-[#F5B82E] bg-[#081D3C] px-2 py-0.5 rounded border border-[#D4AF37]/30">
              Blanco (Mayormente) • Azul • Dorado
            </span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Toggle Interactive Design Mode */}
          <button
            onClick={onToggleDesignMode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-black transition-all text-xs border ${
              isDesignMode
                ? 'bg-[#D4AF37] text-[#081D3C] border-[#FDE382] shadow-md ring-2 ring-[#D4AF37]/50'
                : 'bg-[#0B2545] text-[#F5B82E] hover:bg-[#0E2F57] border-[#D4AF37]/50'
            }`}
            title="Activar o desactivar el modo diseño interactivo sobre la página"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{isDesignMode ? 'Modo Diseño [ACTIVO]' : 'Activar Modo Diseño'}</span>
          </button>

          {/* Reorder Sections */}
          <button
            onClick={onOpenOrderDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#0E2F57] text-white border border-[#D4AF37]/30 font-bold transition-all text-xs"
            title="Acomodar el orden de todos los apartados"
          >
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Acomodar Apartados</span>
          </button>

          {/* Colores de Recuadros */}
          <button
            onClick={() => onOpenCMS('cards')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#0E2F57] text-[#F5B82E] border border-[#D4AF37]/30 font-bold transition-all text-xs"
            title="Editar los colores de los recuadros"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden md:inline">Colores Recuadros</span>
          </button>

          {/* Medios de Contacto */}
          <button
            onClick={() => onOpenCMS('contact')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#0E2F57] text-white border border-[#D4AF37]/30 font-bold transition-all text-xs"
            title="Editar teléfonos, WhatsApp y correo"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden md:inline">Contactos</span>
          </button>

          {/* Full CMS Editor */}
          <button
            onClick={() => onOpenCMS('general')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold shadow-sm transition-all text-xs"
            title="Modificar textos de Misión, Visión, Nosotros y Propósito"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Editar Textos</span>
          </button>

          {/* Logout from Backdoor */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors ml-1"
            title="Cerrar sesión de administrador y bloquear entrada trasera"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Salir</span>
          </button>
        </div>

      </div>
    </div>
  );
};
