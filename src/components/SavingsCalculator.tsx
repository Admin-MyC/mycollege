import React, { useState } from 'react';
import { useAppTheme } from '../themeContext';
import { Calculator, Clock, DollarSign, Leaf, ArrowRight } from 'lucide-react';

interface SavingsCalculatorProps {
  onNavigateToDemo: () => void;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ onNavigateToDemo }) => {
  const { themeConfig } = useAppTheme();
  const [students, setStudents] = useState<number>(450);
  const isLight = themeConfig.navVariant === 'light';

  // Estimations
  const hoursSaved = Math.round(students * 0.22);
  const paperSheetsSaved = students * 36;
  const recoveredMoney = Math.round(students * 185);

  return (
    <section className={`py-20 relative transition-colors duration-300 border-t-2 border-[#D4AF37]/20 ${
      isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`p-8 sm:p-12 rounded-3xl border-2 border-[#D4AF37] shadow-2xl ${
          isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
        }`}>
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#081D3C] text-[#F5B82E] border-2 border-[#D4AF37] mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>SIMULADOR DE IMPACTO FINANCIERO & OPERATIVO</span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-[#081D3C]' : 'text-white'}`}>
              Calcula el Retorno de Inversión para tu Colegio
            </h3>
            <p className={`mt-2 text-xs sm:text-sm font-medium ${isLight ? 'text-[#081D3C]/75' : 'text-white/80'}`}>
              Mueve el selector para ver el impacto estimado en horas y recursos con la suite My College.
            </p>
          </div>

          {/* Student Slider Control */}
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-sm font-bold mb-3">
              <span className={isLight ? 'text-[#081D3C]' : 'text-white'}>Matrícula del Colegio:</span>
              <span className="text-xl font-extrabold text-[#D4AF37] bg-[#081D3C] px-4 py-1 rounded-xl border border-[#D4AF37]">
                {students.toLocaleString()} alumnos
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={2500}
              step={25}
              value={students}
              onChange={(e) => setStudents(Number(e.target.value))}
              className="w-full h-3 bg-[#081D3C] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
            <div className={`flex justify-between text-[11px] font-bold mt-1.5 ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>
              <span>100 alumnos</span>
              <span>1,200 alumnos</span>
              <span>2,500+ alumnos</span>
            </div>
          </div>

          {/* Results Grid (Strictly Azul, Dorado y Blanco) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
            
            <div className="p-6 rounded-2xl bg-[#081D3C] border-2 border-[#D4AF37]/50 shadow-md">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#0B2545] text-[#D4AF37] flex items-center justify-center mb-3 border border-[#D4AF37]/40">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-[#D4AF37] font-sans">
                +{hoursSaved} hrs
              </div>
              <div className="text-xs font-bold text-white/80 mt-1">
                Ahorradas al mes en trámites administrativos
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#081D3C] border-2 border-[#D4AF37]/50 shadow-md">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#0B2545] text-[#D4AF37] flex items-center justify-center mb-3 border border-[#D4AF37]/40">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-[#F5B82E] font-sans">
                ~${recoveredMoney.toLocaleString()} MXN
              </div>
              <div className="text-xs font-bold text-white/80 mt-1">
                Recuperación promedio de cobranza vencida
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#081D3C] border-2 border-[#D4AF37]/50 shadow-md">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#0B2545] text-[#D4AF37] flex items-center justify-center mb-3 border border-[#D4AF37]/40">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white font-sans">
                {paperSheetsSaved.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-white/80 mt-1">
                Hojas de papel y boletas impresas ahorradas al año
              </div>
            </div>

          </div>

          {/* CTA Box */}
          <div className="text-center">
            <button
              onClick={onNavigateToDemo}
              className={`px-8 py-3.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-lg ${themeConfig.primaryButton}`}
            >
              <span>Agendar Webinar de Diagnóstico y Ahorro para tu Colegio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
