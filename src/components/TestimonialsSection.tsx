import React from 'react';
import { useAppTheme } from '../themeContext';
import { Star, Quote, Building } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { themeConfig } = useAppTheme();
  const isLight = themeConfig.navVariant === 'light';

  const testimonials = [
    {
      name: 'Mtra. Elena Carvajal de la Vega',
      role: 'Directora General',
      school: 'Instituto Thomas Jefferson Privado',
      students: '850 Alumnos',
      comment: 'Antes de My College, el cierre mensual de colegiaturas y la emisión de facturas era un caos que consumía dos semanas enteras. Hoy el 98% de los padres pagan puntualmente desde la app y la conciliación es instantánea. Es la mejor inversión que hemos hecho en 20 años de historia escolar.',
      rating: 5
    },
    {
      name: 'Lic. Rodrigo Mendizábal S.',
      role: 'Director Administrativo & Financiero',
      school: 'Colegio Bilingüe Miraflores',
      students: '1,200 Alumnos',
      comment: 'La integración con el timbrado CFDI 4.0 con complemento IEDU funciona a la perfección. La morosidad cayó drásticamente y los directores tenemos métricas en vivo en nuestros teléfonos para tomar decisiones estratégicas de matrícula.',
      rating: 5
    },
    {
      name: 'Dra. Sofía Albarrán',
      role: 'Coordinadora Académica & Control Escolar',
      school: 'Colegio Oxford Real',
      students: '620 Alumnos',
      comment: 'Los maestros adoran la rapidez con la que pasan lista y capturan notas. La generación de boletas oficiales SEP se realiza en solo dos clics, con un formato gráfico impecable que prestigia nuestra institución.',
      rating: 5
    }
  ];

  return (
    <section className={`py-20 relative transition-colors duration-300 border-t-2 border-[#D4AF37]/20 ${
      isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#081D3C] text-[#F5B82E] border-2 border-[#D4AF37] mb-3">
            <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            <span>TESTIMONIOS DE ALTA DIRECCIÓN</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-[#081D3C]' : 'text-white'
          }`}>
            Respaldado por Colegios de Prestigio
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${
            isLight ? 'text-[#081D3C]/80' : 'text-white/85'
          }`}>
            Historias reales de directores y administradores que elevaron la calidad operativa de sus instituciones.
          </p>
        </div>

        {/* Testimonials Grid (Strictly Azul, Dorado y Blanco) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border-2 border-[#D4AF37]/35 shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-[#D4AF37] hover:-translate-y-1 ${
                isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
              }`}
            >
              <div>
                {/* Stars and School Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <span className={`text-[11px] font-bold ${isLight ? 'text-[#081D3C]/70' : 'text-white/70'}`}>
                    {item.students}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-[#D4AF37]/30 mb-3" />

                <p className={`text-xs sm:text-sm leading-relaxed italic mb-6 ${
                  isLight ? 'text-[#081D3C]/80' : 'text-white/85'
                }`}>
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#D4AF37]/30">
                <div className="font-bold text-sm">
                  {item.name}
                </div>
                <div className="text-xs text-[#D4AF37] font-bold">
                  {item.role}
                </div>
                <div className={`text-[11px] mt-0.5 flex items-center gap-1 font-semibold ${
                  isLight ? 'text-[#081D3C]/70' : 'text-white/70'
                }`}>
                  <Building className="w-3 h-3 text-[#D4AF37]" />
                  {item.school}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
