import React from 'react';
import { PrivacyPolicyContent } from '../types';
import { ShieldCheck, X, Lock, Mail } from 'lucide-react';
import { MyCollegeLogo } from './MyCollegeLogo';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: PrivacyPolicyContent;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  policy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081D3C]/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#081D3C] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-3">
            <MyCollegeLogo size="sm" showText={false} />
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
                <ShieldCheck className="w-4 h-4" />
                <span>MARCO LEGAL & PROTECCIÓN DE MENORES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                {policy.title}
              </h2>
              <div className="text-xs text-white/70">
                Última actualización: {policy.lastUpdated}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#0B2545] text-white hover:text-[#D4AF37] border border-[#D4AF37]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto py-6 space-y-6 pr-2">
          
          {/* Introduction Box */}
          <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/40 text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            {policy.introduction}
          </div>

          {/* Policy Sections */}
          <div className="space-y-4">
            {policy.sections.map((sec) => (
              <div
                key={sec.id}
                className="p-5 rounded-2xl bg-[#0B2545] border border-[#D4AF37]/30"
              >
                <h3 className="text-base font-bold text-[#F5B82E] mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{sec.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed whitespace-pre-line">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* DPO & Contact Information */}
          <div className="p-5 rounded-2xl bg-[#051226] text-white border-2 border-[#D4AF37]/50">
            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
              Contacto del Oficial de Protección de Datos:
            </h4>
            <div className="text-xs text-white/80 space-y-1">
              <p>Responsable: {policy.dataProtectionOfficer}</p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Correo de atención ARCO: <strong className="text-[#D4AF37]">{policy.contactEmail}</strong></span>
              </p>
            </div>
          </div>

        </div>

        {/* Footer Close */}
        <div className="pt-4 border-t border-[#D4AF37]/30 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] transition-colors"
          >
            Entendido y Aceptado
          </button>
        </div>

      </div>
    </div>
  );
};
