import React, { useState } from 'react';
import { PlatformProduct } from '../types';
import { useAppTheme } from '../themeContext';
import { 
  GraduationCap, 
  Receipt, 
  Smartphone, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Layers, 
  Check, 
  ArrowRight,
  Info,
  X
} from 'lucide-react';

interface ProductsSectionProps {
  products: PlatformProduct[];
  onNavigateToDemo: () => void;
  onOpenAdmin: () => void;
  textAlign?: 'left' | 'center';
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  onNavigateToDemo,
  textAlign,
}) => {
  const { themeConfig } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeModalProduct, setActiveModalProduct] = useState<PlatformProduct | null>(null);

  const isLight = themeConfig.navVariant === 'light';
  const isCentered = textAlign ? textAlign === 'center' : true;
  const categories = ['Todos', 'Academico', 'Finanzas', 'Comunicacion', 'Seguridad', 'Gestion'];

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const getProductIcon = (icon: string) => {
    switch (icon) {
      case 'GraduationCap':
        return <GraduationCap className="w-7 h-7" />;
      case 'Receipt':
        return <Receipt className="w-7 h-7" />;
      case 'Smartphone':
        return <Smartphone className="w-7 h-7" />;
      case 'Users':
        return <Users className="w-7 h-7" />;
      case 'UserPlus':
        return <UserPlus className="w-7 h-7" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7" />;
      default:
        return <Layers className="w-7 h-7" />;
    }
  };

  return (
    <section
      id="productos"
      className={`py-20 relative transition-colors duration-300 border-t-2 border-[#D4AF37]/20 ${
        isLight ? 'bg-white text-[#081D3C]' : 'bg-[#0B2545] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-12 ${isCentered ? 'text-center mx-auto' : 'text-left'}`}>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#081D3C] text-[#F5B82E] border-2 border-[#D4AF37] mb-3 ${isCentered ? 'mx-auto' : ''}`}>
            <Layers className="w-3.5 h-3.5" />
            <span>SUITE INTEGRAL MY COLLEGE</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-[#081D3C]' : 'text-white'
          }`}>
            Nuestros Productos & Módulos
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${
            isLight ? 'text-[#081D3C]/80' : 'text-white/85'
          }`}>
            Cada módulo funciona de manera autónoma o sincronizado a la perfección, brindando una experiencia educativa completa.
          </p>
        </div>

        {/* Category Filters (Strictly Azul, Dorado y Blanco) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border-2 ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-[#081D3C] border-[#F5B82E] shadow-md'
                  : isLight
                  ? 'bg-white text-[#081D3C] border-[#081D3C]/20 hover:border-[#D4AF37]'
                  : 'bg-[#081D3C] text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {cat === 'Academico' ? 'Académico' : cat === 'Comunicacion' ? 'Comunicación' : cat === 'Gestion' ? 'Gestión' : cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className={`p-7 rounded-3xl border-2 border-[#D4AF37]/35 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#D4AF37] hover:-translate-y-1.5 ${
                isLight ? 'bg-white text-[#081D3C]' : 'bg-[#081D3C] text-white'
              }`}
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-[#0B2545] text-[#D4AF37] border-2 border-[#D4AF37]/40 group-hover:scale-105 transition-transform">
                    {getProductIcon(prod.icon)}
                  </div>
                  {prod.badge && (
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#081D3C] text-[#F5B82E] border border-[#D4AF37]">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <h3 className={`text-xl font-bold mb-1.5 ${
                  isLight ? 'text-[#081D3C]' : 'text-white'
                }`}>
                  {prod.name}
                </h3>

                <p className="text-xs font-bold text-[#D4AF37] mb-3">
                  {prod.tagline}
                </p>

                <p className={`text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed ${
                  isLight ? 'text-[#081D3C]/75' : 'text-white/80'
                }`}>
                  {prod.description}
                </p>

                {/* Features Highlights */}
                <div className="space-y-2 mb-6">
                  {prod.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className={isLight ? 'text-[#081D3C]/80' : 'text-white/85'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveModalProduct(prod)}
                  className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 hover:underline"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Ver Ficha Completa</span>
                </button>

                <button
                  onClick={onNavigateToDemo}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${themeConfig.primaryButton}`}
                >
                  Agendar Webinar
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Product Details Modal (Azul, Dorado y Blanco) */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081D3C]/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#081D3C] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#0B2545] text-white hover:text-[#D4AF37] border border-[#D4AF37]/30"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3.5 rounded-2xl bg-[#0B2545] text-[#D4AF37] border-2 border-[#D4AF37]/40">
                {getProductIcon(activeModalProduct.icon)}
              </div>
              <div>
                <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">
                  Módulo My College
                </span>
                <h3 className="text-2xl font-bold font-serif text-white">
                  {activeModalProduct.name}
                </h3>
              </div>
            </div>

            <p className="text-sm font-bold text-[#F5B82E] mb-4">
              {activeModalProduct.tagline}
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-white/85 mb-6">
              {activeModalProduct.description}
            </p>

            {/* Target Roles */}
            {activeModalProduct.targetRoles && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  Usuarios que se benefician:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProduct.targetRoles.map((role, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B2545] text-white border border-[#D4AF37]/40">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Features */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
                Funcionalidades Incluidas:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeModalProduct.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-white/90">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalProduct(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B2545] text-white border border-white/20"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setActiveModalProduct(null);
                  onNavigateToDemo();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] shadow-lg flex items-center justify-center gap-2"
              >
                <span>Agendar Webinar de este Módulo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
