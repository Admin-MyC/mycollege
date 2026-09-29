import React, { useState } from 'react';
import { MyCollegeLogo } from './MyCollegeLogo';
import { useAppTheme } from '../themeContext';
import { 
  Menu, 
  X, 
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  onTriggerSecretAdmin: () => void;
  onNavigateToDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onTriggerSecretAdmin,
  onNavigateToDemo,
}) => {
  const { themeConfig } = useAppTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Triple-click backdoor detection on Shield
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleShieldClick = (e: React.MouseEvent) => {
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

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Misión & Visión', href: '#mision-vision' },
    { label: 'Objetivos', href: '#objetivos' },
    { label: 'Productos', href: '#productos' },
    { label: 'Actualizaciones', href: '#actualizaciones' },
    { label: 'Webinar & Contacto', href: '#contacto' },
  ];

  const isDarkNav = themeConfig.navVariant === 'dark';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${themeConfig.headerBg}`}>
      {/* Top Notice Banner (Tri-color: Azul, Dorado y Blanco) */}
      <div className="bg-[#D4AF37] text-[#081D3C] text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner border-b border-[#F5B82E]">
        <span 
          onClick={onTriggerSecretAdmin}
          className="inline-flex items-center gap-1 font-bold cursor-pointer hover:opacity-80 transition-opacity select-none"
          title="my college"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          my college
        </span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline font-semibold">
          Plataforma Integral de Gestión para Colegios
        </span>
        <span 
          onClick={onTriggerSecretAdmin}
          className="hidden sm:inline-block ml-1 text-[11px] bg-[#081D3C] text-white px-2.5 py-0.5 rounded-full font-bold cursor-pointer hover:bg-[#0B2545] transition-colors select-none"
          title="Acceso Secreto Directivo"
        >
          Calidad & Excelencia
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand with Secret Backdoor Click Detection */}
          <div 
            onClick={handleShieldClick}
            className="group flex items-center gap-3 cursor-pointer select-none"
            title="My College"
          >
            <MyCollegeLogo
              size="md"
              textVariant={isDarkNav ? 'light' : 'dark'}
              animated={true}
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-[#D4AF37] ${
                  isDarkNav ? 'text-white/90 hover:text-[#F5B82E]' : 'text-[#081D3C] hover:text-[#D4AF37]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions: Clean & Visitor-Focused */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#productos"
              className={`text-xs font-bold transition-colors ${
                isDarkNav ? 'text-white/80 hover:text-white' : 'text-[#081D3C]/80 hover:text-[#081D3C]'
              }`}
            >
              Ver Módulos
            </a>

            {/* Primary Action Button */}
            <button
              onClick={onNavigateToDemo}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${themeConfig.primaryButton}`}
            >
              Agendar Webinar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${isDarkNav ? 'text-white' : 'text-[#081D3C]'}`}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`xl:hidden border-b-2 border-[#D4AF37]/30 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200 ${
          isDarkNav ? 'bg-[#081D3C] text-white' : 'bg-white text-[#081D3C]'
        }`}>
          <div className="space-y-2 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isDarkNav ? 'hover:bg-white/10' : 'hover:bg-[#081D3C]/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-[#D4AF37]/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToDemo();
              }}
              className={`w-full py-3 rounded-xl text-xs font-bold text-center ${themeConfig.primaryButton}`}
            >
              Agendar Webinar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
