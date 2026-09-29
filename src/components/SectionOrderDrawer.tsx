import React, { useState } from 'react';
import { SectionItem, SectionId, DEFAULT_PAGE_SECTIONS } from '../types';
import { 
  X, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Check, 
  Layers, 
  Sparkles,
  GripVertical,
  AlignLeft,
  AlignCenter,
  Trash2,
  Plus,
  PlusCircle,
  Bookmark
} from 'lucide-react';

interface SectionOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SectionItem[];
  onChangeSections: (sections: SectionItem[]) => void;
  onSaveAll: () => Promise<void>;
  isSaving: boolean;
}

export const SectionOrderDrawer: React.FC<SectionOrderDrawerProps> = ({
  isOpen,
  onClose,
  sections,
  onChangeSections,
  onSaveAll,
  isSaving,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    badge: 'Institucional',
    customTitle: '',
    customSubtitle: '',
    customContent: '',
    textAlign: 'left' as 'left' | 'center',
  });

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);
    onChangeSections(newSections);
  };

  const handleToggle = (id: SectionId) => {
    const newSections = sections.map((s) => 
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    onChangeSections(newSections);
  };

  const handleToggleTextAlign = (id: SectionId) => {
    const newSections = sections.map((s) => {
      if (s.id === id) {
        const nextAlign: 'left' | 'center' = s.textAlign === 'center' ? 'left' : 'center';
        return { ...s, textAlign: nextAlign };
      }
      return s;
    });
    onChangeSections(newSections);
  };

  const handleRemove = (id: SectionId) => {
    const sec = sections.find(s => s.id === id);
    if (!sec) return;
    if (confirm(`¿Quitar el apartado "${sec.name}" de la página? Podrás volver a agregarlo en cualquier momento.`)) {
      const newSections = sections.filter(s => s.id !== id);
      onChangeSections(newSections);
    }
  };

  const handleSetAllAlign = (align: 'left' | 'center') => {
    const newSections = sections.map(s => ({ ...s, textAlign: align }));
    onChangeSections(newSections);
  };

  const handleResetToDefault = () => {
    if (confirm('¿Restablecer todos los apartados y orden al valor predeterminado del colegio?')) {
      onChangeSections(DEFAULT_PAGE_SECTIONS);
    }
  };

  // Find default sections that are currently NOT in sections
  const existingIds = new Set(sections.map(s => s.id));
  const missingDefaults = DEFAULT_PAGE_SECTIONS.filter(s => !existingIds.has(s.id));

  const handleReaddDefault = (defaultSection: SectionItem) => {
    onChangeSections([...sections, { ...defaultSection, visible: true }]);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.name.trim()) return;

    const newSection: SectionItem = {
      id: `custom-${Date.now()}`,
      name: customForm.name.trim(),
      badge: customForm.badge.trim() || 'Nuevo Apartado',
      description: customForm.customSubtitle.trim() || customForm.name.trim(),
      visible: true,
      textAlign: customForm.textAlign,
      isCustom: true,
      customTitle: customForm.customTitle.trim() || customForm.name.trim(),
      customSubtitle: customForm.customSubtitle.trim(),
      customContent: customForm.customContent.trim(),
    };

    onChangeSections([...sections, newSection]);
    setShowAddModal(false);
    setCustomForm({
      name: '',
      badge: 'Institucional',
      customTitle: '',
      customSubtitle: '',
      customContent: '',
      textAlign: 'left',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051226]/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#081D3C] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#D4AF37] text-[#081D3C]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                <span>Gestión de Apartados (Secciones)</span>
              </h3>
              <p className="text-xs text-white/70">
                Agrega, quita, reordena y centra textos de los apartados de tu plataforma.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#0B2545] text-white hover:text-[#D4AF37] border border-[#D4AF37]/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Toolbar: Centrar todos, Alinear Izq, Agregar Apartado */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/70">Alineación rápida:</span>
            <button
              type="button"
              onClick={() => handleSetAllAlign('center')}
              className="px-2.5 py-1.5 rounded-lg bg-[#0B2545] border border-[#D4AF37]/40 text-[#F5B82E] text-xs font-bold hover:bg-[#D4AF37] hover:text-[#081D3C] flex items-center gap-1.5 transition-all"
              title="Centrar títulos y textos en todos los apartados"
            >
              <AlignCenter className="w-3.5 h-3.5" />
              <span>Centrar Todos</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetAllAlign('left')}
              className="px-2.5 py-1.5 rounded-lg bg-[#0B2545] border border-white/20 text-white/80 text-xs font-bold hover:bg-white/10 flex items-center gap-1.5 transition-all"
              title="Alinear a la izquierda todos los apartados"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Alinear a la Izquierda</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] text-xs font-extrabold flex items-center gap-1.5 shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Apartado</span>
          </button>
        </div>

        {/* Section List (Scrollable) */}
        <div className="py-4 overflow-y-auto flex-1 space-y-2.5 pr-1">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                section.visible
                  ? 'bg-[#0B2545] border-[#D4AF37]/40 hover:border-[#D4AF37]'
                  : 'bg-rose-950/20 border-rose-500/30 opacity-60'
              }`}
            >
              {/* Order number & name */}
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#081D3C] text-[#F5B82E] font-bold text-xs flex items-center justify-center border border-[#D4AF37]/40 shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{section.name}</span>
                    {section.badge && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/30">
                        {section.badge}
                      </span>
                    )}
                    {section.isCustom && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        Personalizado
                      </span>
                    )}
                    {section.textAlign === 'center' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-400/40">
                        Centrado
                      </span>
                    )}
                  </div>
                  {section.description && (
                    <p className="text-[11px] text-white/60 line-clamp-1">{section.description}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Text Alignment */}
                <button
                  onClick={() => handleToggleTextAlign(section.id)}
                  className="p-2 rounded-xl border bg-[#081D3C] border-[#D4AF37]/40 text-[#F5B82E] hover:bg-[#D4AF37] hover:text-[#081D3C] transition-all"
                  title={section.textAlign === 'center' ? 'Alinear textos a la izquierda' : 'Centrar textos de este apartado'}
                >
                  {section.textAlign === 'center' ? <AlignLeft className="w-4 h-4" /> : <AlignCenter className="w-4 h-4" />}
                </button>

                {/* Up */}
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className={`p-2 rounded-xl border transition-all ${
                    idx === 0
                      ? 'opacity-30 border-white/10 text-white/30 cursor-not-allowed'
                      : 'bg-[#081D3C] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#081D3C]'
                  }`}
                  title="Subir apartado"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Down */}
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === sections.length - 1}
                  className={`p-2 rounded-xl border transition-all ${
                    idx === sections.length - 1
                      ? 'opacity-30 border-white/10 text-white/30 cursor-not-allowed'
                      : 'bg-[#081D3C] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#081D3C]'
                  }`}
                  title="Bajar apartado"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Visibility */}
                <button
                  onClick={() => handleToggle(section.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    section.visible
                      ? 'bg-[#081D3C] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-white/10'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  }`}
                  title={section.visible ? 'Ocultar sección' : 'Mostrar sección'}
                >
                  {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Quitar Apartado */}
                <button
                  onClick={() => handleRemove(section.id)}
                  className="p-2 rounded-xl border bg-rose-950/40 text-rose-300 border-rose-500/40 hover:bg-rose-600 hover:text-white transition-all"
                  title="Quitar este apartado"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Missing Default Sections Banner (if any was deleted, allow re-adding) */}
        {missingDefaults.length > 0 && (
          <div className="py-2.5 px-3 mb-2 rounded-xl bg-[#0B2545] border border-[#D4AF37]/30 text-xs shrink-0 flex items-center justify-between gap-3">
            <span className="text-white/80">
              Apartados originales disponibles para reincorporar ({missingDefaults.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingDefaults.map(def => (
                <button
                  key={def.id}
                  onClick={() => handleReaddDefault(def)}
                  className="px-2 py-1 rounded-lg bg-[#081D3C] text-[#F5B82E] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#081D3C] font-bold text-[11px] transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{def.name.split('(')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer with Reset and Master Save */}
        <div className="pt-4 border-t-2 border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white border border-white/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Apartados</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2545] text-white border border-[#D4AF37]/30 hover:bg-[#0E2F57]"
            >
              Listo (Cerrar)
            </button>

            <button
              onClick={async () => {
                await onSaveAll();
                onClose();
              }}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] shadow-lg flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Guardando en BD...' : 'Guardar y Fijar en BD'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* MODAL: AGREGAR NUEVO APARTADO */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#081D3C] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30 mb-4">
              <h4 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#D4AF37]" />
                <span>Agregar Nuevo Apartado</span>
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full bg-[#0B2545] text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Nombre del Apartado (Identificador) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Vida Estudiantil, Alianzas, Eventos..."
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Insignia / Badge</label>
                  <input
                    type="text"
                    placeholder="Ej. COMUNIDAD, INSTITUCIONAL..."
                    value={customForm.badge}
                    onChange={(e) => setCustomForm({ ...customForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-[#F5B82E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Alineación del Texto</label>
                  <select
                    value={customForm.textAlign}
                    onChange={(e) => setCustomForm({ ...customForm, textAlign: e.target.value as 'left' | 'center' })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white font-bold"
                  >
                    <option value="left">A la Izquierda</option>
                    <option value="center">Centrado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Título Principal Visible</label>
                <input
                  type="text"
                  placeholder="Título grande que verán los directivos y familias..."
                  value={customForm.customTitle}
                  onChange={(e) => setCustomForm({ ...customForm, customTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Subtítulo / Resumen</label>
                <input
                  type="text"
                  placeholder="Descripción complementaria del apartado..."
                  value={customForm.customSubtitle}
                  onChange={(e) => setCustomForm({ ...customForm, customSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white/90"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Contenido / Viñetas (1 por renglón)</label>
                <textarea
                  rows={4}
                  placeholder="Escribe cada punto o párrafo en un renglón separado..."
                  value={customForm.customContent}
                  onChange={(e) => setCustomForm({ ...customForm, customContent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2545] text-white/80 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] text-xs font-extrabold shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Incorporar Apartado</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
