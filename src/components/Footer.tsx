import React, { useState } from 'react';
import { SiteContent } from '../types';
import { useAppTheme } from '../themeContext';
import { MyCollegeLogo } from './MyCollegeLogo';
import { ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  content: SiteContent;
  onOpenPrivacy: () => void;
  onTriggerSecretAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  content,
  onOpenPrivacy,
  onTriggerSecretAdmin,
}) => {
  const { themeConfig } = useAppTheme();

  // Triple-click backdoor detection on Shield
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleShieldClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 1200) {
      const newCount = clickCount + 1;
      if (newCount >= 3) {
        setClickCount(0);
        setLastClickTime(0);
        onTriggerSecretAdmin();
      } else {
        setClickCount(newCount);
        setLastClickTime(now);
      }
    } else {
      setClickCount(1);
      setLastClickTime(now);
    }
  };

  return (
    <footer className="bg-[#051226] text-white border-t-2 border-[#D4AF37]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#D4AF37]/20">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={handleShieldClick}
              className="cursor-pointer inline-block select-none"
              title="My College"
            >
              <MyCollegeLogo size="md" textVariant="light" animated={false} />
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm mt-3">
              Plataforma integral en la nube para la gestión escolar, académica, financiera y comunicativa de colegios privados y bilingües de excelencia.
            </p>
            <div className="pt-2 text-xs text-white/70">
              <span className="text-[#D4AF37] font-bold">Oficinas Corporativas:</span> {content.address}
            </div>
            <div className="text-xs text-white/70">
              <span className="text-[#D4AF37] font-bold">Atención Directiva:</span> {content.contactPhone}
            </div>
          </div>

          {/* Quick Links 1: Navegación */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#inicio" className="hover:text-[#D4AF37] transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-[#D4AF37] transition-colors">Quiénes Somos</a></li>
              <li><a href="#mision-vision" className="hover:text-[#D4AF37] transition-colors">Misión & Visión</a></li>
              <li><a href="#objetivos" className="hover:text-[#D4AF37] transition-colors">Objetivos</a></li>
              <li><a href="#productos" className="hover:text-[#D4AF37] transition-colors">Nuestros Módulos</a></li>
              <li><a href="#actualizaciones" className="hover:text-[#D4AF37] transition-colors">Actualizaciones</a></li>
            </ul>
          </div>

          {/* Quick Links 2: Módulos Clave */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Módulos Principales
            </h4>
            <ul className="space-y-2 text-xs text-white/80 font-medium">
              <li><span>Control Escolar & SEP</span></li>
              <li><span>Cobranza & Facturación CFDI</span></li>
              <li><span>App Móvil para Familias</span></li>
              <li><span>Portal del Profesor 360</span></li>
              <li><span>Admisiones & Matrícula Online</span></li>
              <li><span>Entrega Segura con QR</span></li>
            </ul>
          </div>

          {/* Institutional Values & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Contacto & Soporte
            </h4>
            <p className="text-xs text-white/75 leading-relaxed">
              Atención personalizada para directores, administradores y comités escolares.
            </p>
            <div className="space-y-1.5 text-xs text-white/75">
              <div><span className="text-[#D4AF37] font-bold">Email:</span> {content.contactEmail}</div>
              <div><span className="text-[#D4AF37] font-bold">WhatsApp:</span> {content.contactWhatsapp}</div>
            </div>
            <div className="pt-2">
              <a
                href="#contacto"
                className="inline-block px-4 py-2 rounded-xl bg-[#D4AF37] text-[#081D3C] font-extrabold text-xs shadow-md hover:bg-[#F5B82E] transition-all"
              >
                Agendar Webinar
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-white/75">
            <span>© {new Date().getFullYear()} My College. Todos los derechos reservados.</span>
            {/* Discrete Micro-Trigger for Backdoor: Clicking the golden dot opens admin */}
            <span 
              onClick={onTriggerSecretAdmin}
              className="cursor-pointer text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors p-1"
              title="Seguridad"
            >
              •
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 font-bold text-white/90"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Política de Privacidad</span>
            </button>

            {/* Discrete subtle lock trigger */}
            <button
              onClick={onTriggerSecretAdmin}
              className="text-white/20 hover:text-[#D4AF37] transition-colors p-1"
              title="Área de Seguridad"
              aria-label="Seguridad"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
