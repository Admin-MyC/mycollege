import React, { useState, useEffect } from 'react';
import { 
  SiteContent, 
  PlatformProduct, 
  PlatformUpdate, 
  DemoRequest, 
  PrivacyPolicyContent, 
  DesignTheme,
  CardColorSettings,
  DEFAULT_CARD_COLORS,
  SectionItem,
  SectionId,
  DEFAULT_PAGE_SECTIONS
} from '../types';
import { 
  updateSiteContent, 
  createUpdate, 
  deleteUpdate, 
  updatePrivacyPolicy, 
  getDemoRequests,
  saveActiveTheme,
  getAdminSecurityConfig,
  updateAdminSecurityConfig,
  saveProduct,
  deleteProduct,
  savePageLayout
} from '../firebase';
import { useAppTheme, THEMES } from '../themeContext';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Check, 
  Settings, 
  Bell, 
  Layers, 
  Target, 
  Inbox, 
  Palette, 
  ShieldCheck, 
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  KeyRound,
  LogOut,
  MousePointerClick,
  Link as LinkIcon,
  Keyboard,
  Phone,
  Mail,
  MapPin,
  Clock,
  Video,
  Calendar,
  Sparkles,
  PhoneCall,
  LayoutGrid,
  LifeBuoy,
  CreditCard,
  GraduationCap,
  AlignLeft,
  AlignCenter,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  RotateCcw
} from 'lucide-react';
import { MyCollegeLogo } from './MyCollegeLogo';

export type CMSTab = 
  | 'general' 
  | 'contact' 
  | 'cards' 
  | 'sections'
  | 'objectives' 
  | 'updates' 
  | 'products' 
  | 'privacy' 
  | 'leads' 
  | 'identity' 
  | 'security';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteContent: SiteContent;
  products: PlatformProduct[];
  updates: PlatformUpdate[];
  privacyPolicy: PrivacyPolicyContent;
  onRefreshData: () => Promise<void>;
  initialTab?: CMSTab;
  onLogout?: () => void;
  sections?: SectionItem[];
  onSaveSections?: (sections: SectionItem[]) => Promise<void>;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  siteContent,
  products,
  updates,
  privacyPolicy,
  onRefreshData,
  initialTab = 'general',
  onLogout,
  sections = DEFAULT_PAGE_SECTIONS,
  onSaveSections,
}) => {
  const { 
    currentTheme, 
    setTheme, 
    saveAsDefault, 
    fixedThemeInDb, 
    cardColors, 
    setCardColors, 
    saveCardColorsToDb 
  } = useAppTheme();

  const [activeTab, setActiveTab] = useState<CMSTab>(initialTab);

  // Security password state
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [currentSecurityKey, setCurrentSecurityKey] = useState('mc2709');

  // Form states
  const [generalData, setGeneralData] = useState<SiteContent>(siteContent);
  const [privacyData, setPrivacyData] = useState<PrivacyPolicyContent>(privacyPolicy);
  const [leads, setLeads] = useState<DemoRequest[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Products / Módulos state
  const [productList, setProductList] = useState<PlatformProduct[]>(products);
  const [newProduct, setNewProduct] = useState({
    name: '',
    tagline: '',
    category: 'Academico' as PlatformProduct['category'],
    description: '',
    badge: 'Nuevo Módulo',
    icon: 'Layers',
  });
  const [featuresInput, setFeaturesInput] = useState('Acceso seguro en la nube\nSoporte directo para colegios\nSincronización en tiempo real');

  // Sections / Apartados state
  const [sectionsList, setSectionsList] = useState<SectionItem[]>(sections);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionForm, setNewSectionForm] = useState({
    name: '',
    badge: 'Institucional',
    customTitle: '',
    customSubtitle: '',
    customContent: '',
    textAlign: 'left' as 'left' | 'center',
  });

  useEffect(() => {
    setProductList(products);
  }, [products]);

  useEffect(() => {
    if (sections && sections.length > 0) {
      setSectionsList(sections);
    }
  }, [sections]);

  // Card colors customization state
  const [cardColorsData, setCardColorsData] = useState<CardColorSettings>(() => {
    return generalData.cardColors || cardColors || DEFAULT_CARD_COLORS;
  });

  // New Update Form State
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    category: 'Innovación Académica',
    summary: '',
    content: '',
    badge: 'Novedad',
    author: 'Dirección My College',
    date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setGeneralData(siteContent);
    if (siteContent.cardColors) {
      setCardColorsData(siteContent.cardColors);
    }
  }, [siteContent]);

  useEffect(() => {
    setPrivacyData(privacyPolicy);
  }, [privacyPolicy]);

  useEffect(() => {
    if (activeTab === 'leads') {
      loadLeads();
    }
    if (activeTab === 'security') {
      getAdminSecurityConfig().then(cfg => {
        if (cfg?.adminKey) {
          setCurrentSecurityKey(cfg.adminKey);
        }
      });
    }
  }, [activeTab]);

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const data = await getDemoRequests();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Save New Security Key
  const handleSaveSecurityKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPassword.trim()) {
      notify('Por favor escribe la nueva clave', 'error');
      return;
    }
    if (newAdminPassword.length < 5) {
      notify('La clave debe tener al menos 5 caracteres', 'error');
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      notify('Las claves no coinciden', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await updateAdminSecurityConfig({ adminKey: newAdminPassword.trim() });
      setCurrentSecurityKey(newAdminPassword.trim());
      setNewAdminPassword('');
      setConfirmAdminPassword('');
      notify('¡Clave de acceso directiva actualizada en Firestore!');
    } catch (err) {
      notify('Error al guardar la clave en Firestore', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Save General (Hero, Nosotros, Misión, Visión)
  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      await updateSiteContent(generalData);
      await onRefreshData();
      notify('¡Contenido institucional actualizado en Firestore!');
    } catch (err) {
      notify('Error al guardar en Firestore', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Contact Methods
  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
      await updateSiteContent({
        contactEmail: generalData.contactEmail,
        contactPhone: generalData.contactPhone,
        contactWhatsapp: generalData.contactWhatsapp,
        address: generalData.address,
        schedule: generalData.schedule,
        supportEmail: generalData.supportEmail,
        salesPhone: generalData.salesPhone,
        linkedinUrl: generalData.linkedinUrl,
        facebookUrl: generalData.facebookUrl,
        instagramUrl: generalData.instagramUrl,
        youtubeUrl: generalData.youtubeUrl,
      });
      await onRefreshData();
      notify('¡Medios de contacto guardados en la base de datos!');
    } catch (err) {
      notify('Error al guardar medios de contacto', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Card Colors
  const handleSaveCardColors = async () => {
    setIsSaving(true);
    try {
      await saveCardColorsToDb(cardColorsData);
      await updateSiteContent({ cardColors: cardColorsData });
      setCardColors(cardColorsData);
      await onRefreshData();
      notify('¡Colores de recuadros guardados en Firestore!');
    } catch (err) {
      notify('Error al guardar los colores de los recuadros', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Objectives
  const handleSaveObjectives = async () => {
    setIsSaving(true);
    try {
      await updateSiteContent({ objectives: generalData.objectives });
      await onRefreshData();
      notify('¡Objetivos estratégicos actualizados en Firestore!');
    } catch (err) {
      notify('Error al guardar en Firestore', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Create News Update
  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.title || !newUpdate.summary) {
      notify('El título y resumen son obligatorios', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await createUpdate(newUpdate);
      await onRefreshData();
      setNewUpdate({
        title: '',
        category: 'Innovación Académica',
        summary: '',
        content: '',
        badge: 'Novedad',
        author: 'Dirección My College',
        date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
      });
      notify('¡Publicación guardada y visible en el sitio!');
    } catch (err) {
      notify('Error al publicar la actualización', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Update
  const handleDeleteUpdate = async (id: string) => {
    if (!confirm('¿Eliminar esta publicación de forma definitiva?')) return;
    try {
      await deleteUpdate(id);
      await onRefreshData();
      notify('Publicación eliminada');
    } catch (err) {
      notify('Error al eliminar', 'error');
    }
  };

  // Save Privacy Policy
  const handleSavePrivacy = async () => {
    setIsSaving(true);
    try {
      await updatePrivacyPolicy(privacyData);
      await onRefreshData();
      notify('¡Política de Privacidad actualizada!');
    } catch (err) {
      notify('Error al actualizar política', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Permanently save fixed default theme in Firestore
  const handleSaveDefaultTheme = async (themeKey: DesignTheme) => {
    setIsSaving(true);
    try {
      await saveAsDefault(themeKey);
      notify(`¡Diseño "${THEMES[themeKey].name}" fijado en la Base de Datos!`);
    } catch (err) {
      notify('Error al fijar el diseño en Firestore', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Product / Módulo handlers
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;
    setIsSaving(true);
    try {
      const featuresArr = featuresInput.split('\n').map(f => f.trim()).filter(Boolean);
      const prodToSave: PlatformProduct = {
        id: `prod-${Date.now()}`,
        name: newProduct.name.trim(),
        tagline: newProduct.tagline.trim(),
        category: newProduct.category,
        description: newProduct.description.trim(),
        badge: newProduct.badge?.trim() || undefined,
        features: featuresArr.length > 0 ? featuresArr : ['Módulo oficial'],
        targetRoles: ['Directores', 'Administrativos'],
        icon: newProduct.icon,
        order: productList.length + 1,
      };
      await saveProduct(prodToSave);
      setProductList([...productList, prodToSave]);
      await onRefreshData();
      notify('¡Módulo agregado con éxito a la plataforma!');
      setNewProduct({
        name: '',
        tagline: '',
        category: 'Academico',
        description: '',
        badge: 'Nuevo Módulo',
        icon: 'Layers',
      });
      setFeaturesInput('');
    } catch (err) {
      console.error(err);
      notify('Error al agregar el módulo', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar el módulo "${name}" de la plataforma?`)) return;
    setIsSaving(true);
    try {
      await deleteProduct(id);
      setProductList(productList.filter(p => p.id !== id));
      await onRefreshData();
      notify('Módulo eliminado de la plataforma');
    } catch (err) {
      console.error(err);
      notify('Error al eliminar el módulo', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Section / Apartado Handlers
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sectionsList.length) return;
    const copy = [...sectionsList];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    setSectionsList(copy);
  };

  const handleToggleSectionVisibility = (id: SectionId) => {
    setSectionsList(sectionsList.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const handleToggleSectionTextAlign = (id: SectionId) => {
    setSectionsList(sectionsList.map(s => {
      if (s.id === id) {
        return { ...s, textAlign: s.textAlign === 'center' ? 'left' : 'center' };
      }
      return s;
    }));
  };

  const handleRemoveSection = (id: SectionId) => {
    const sec = sectionsList.find(s => s.id === id);
    if (!sec) return;
    if (confirm(`¿Quitar el apartado "${sec.name}" de la página? Podrás volver a agregarlo en cualquier momento.`)) {
      setSectionsList(sectionsList.filter(s => s.id !== id));
    }
  };

  const handleSetAllSectionsAlign = (align: 'left' | 'center') => {
    setSectionsList(sectionsList.map(s => ({ ...s, textAlign: align })));
  };

  const handleReaddDefaultSection = (def: SectionItem) => {
    setSectionsList([...sectionsList, { ...def, visible: true }]);
  };

  const handleCreateCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionForm.name.trim()) return;
    const newSec: SectionItem = {
      id: `custom-${Date.now()}`,
      name: newSectionForm.name.trim(),
      badge: newSectionForm.badge.trim() || 'Apartado',
      description: newSectionForm.customSubtitle.trim() || newSectionForm.name.trim(),
      visible: true,
      textAlign: newSectionForm.textAlign,
      isCustom: true,
      customTitle: newSectionForm.customTitle.trim() || newSectionForm.name.trim(),
      customSubtitle: newSectionForm.customSubtitle.trim(),
      customContent: newSectionForm.customContent.trim(),
    };
    setSectionsList([...sectionsList, newSec]);
    setShowAddSectionModal(false);
    setNewSectionForm({
      name: '',
      badge: 'Institucional',
      customTitle: '',
      customSubtitle: '',
      customContent: '',
      textAlign: 'left',
    });
  };

  const handleSaveSections = async () => {
    setIsSaving(true);
    try {
      await savePageLayout(sectionsList);
      if (onSaveSections) {
        await onSaveSections(sectionsList);
      }
      await onRefreshData();
      notify('¡Apartados guardados y fijados en Firestore!');
    } catch (err) {
      console.error(err);
      notify('Error al guardar los apartados', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#081D3C]/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-6xl bg-[#081D3C] text-white rounded-3xl shadow-2xl border-2 border-[#D4AF37] max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b-2 border-[#D4AF37]/30 bg-[#0B2545] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <MyCollegeLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#081D3C]">
                  Panel Directivo
                </span>
                <span className="text-xs text-white/70">Usuario: desingMC • Firestore Conectado</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                Editor Integral My College
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {statusMessage && (
              <span className={`text-xs px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 animate-in fade-in ${
                statusMessage.type === 'error' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                <Check className="w-3.5 h-3.5" />
                {statusMessage.text}
              </span>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 transition-colors"
                title="Cerrar Sesión Directiva"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#081D3C] text-white hover:text-[#D4AF37] border border-[#D4AF37]/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 border-b-2 border-[#D4AF37]/30 bg-[#06152B] overflow-x-auto flex gap-2 shrink-0 py-2.5">
          {[
            { id: 'general', label: 'Textos & Misión', icon: Settings },
            { id: 'sections', label: `Apartados (${sectionsList.length})`, icon: Layers },
            { id: 'products', label: `Módulos (${productList.length})`, icon: Sparkles },
            { id: 'contact', label: 'Medios de Contacto', icon: PhoneCall },
            { id: 'cards', label: 'Colores de Recuadros', icon: LayoutGrid },
            { id: 'objectives', label: 'Objetivos', icon: Target },
            { id: 'updates', label: 'Actualizaciones (Blog)', icon: Bell },
            { id: 'privacy', label: 'Privacidad', icon: ShieldCheck },
            { id: 'leads', label: `Solicitudes Webinar (${leads.length})`, icon: Video },
            { id: 'identity', label: 'Escudo & Colores Oficiales', icon: Palette },
            { id: 'security', label: 'Seguridad & Clave', icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CMSTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#081D3C] border-[#F5B82E] shadow-md'
                    : 'bg-[#0B2545] text-white border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: GENERAL & NOSOTROS & MISIÓN/VISIÓN */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Textos Principales & Propósito</h3>
                  <p className="text-xs text-white/70">Modifica el encabezado, quiénes somos, misión y visión institucional.</p>
                </div>
                <button
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>

              {/* Alineación de Textos y Títulos */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                      Alineación de Textos y Títulos del Sitio
                    </h4>
                    <p className="text-xs text-white/70">
                      Elige si prefieres que los textos y encabezados de la plataforma se muestren alineados a la izquierda o centrados.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setGeneralData({ ...generalData, textAlignment: 'left', heroAlignment: 'left' })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border-2 transition-all ${
                        (generalData.textAlignment || 'left') === 'left'
                          ? 'bg-[#D4AF37] text-[#081D3C] border-[#F5B82E] shadow-md font-extrabold'
                          : 'bg-[#081D3C] text-white/80 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                      <span>A la Izquierda</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGeneralData({ ...generalData, textAlignment: 'center', heroAlignment: 'center' })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border-2 transition-all ${
                        generalData.textAlignment === 'center'
                          ? 'bg-[#D4AF37] text-[#081D3C] border-[#F5B82E] shadow-md font-extrabold'
                          : 'bg-[#081D3C] text-white/80 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                      <span>Centrado</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hero Banner Section */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Portada Hero: Textos Principales</h4>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Badge Superior</label>
                  <input
                    type="text"
                    value={generalData.heroBadge}
                    onChange={(e) => setGeneralData({ ...generalData, heroBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Título Principal (Hero)</label>
                  <input
                    type="text"
                    value={generalData.heroTitle}
                    onChange={(e) => setGeneralData({ ...generalData, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Subtítulo / Propuesta de Valor</label>
                  <textarea
                    rows={2}
                    value={generalData.heroSubtitle}
                    onChange={(e) => setGeneralData({ ...generalData, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>
              </div>

              {/* Hero Highlights (4 Viñetas con Palomita) */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Portada Hero: Viñetas de Beneficios (Checkmarks)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const current = generalData.heroHighlights || [];
                      setGeneralData({
                        ...generalData,
                        heroHighlights: [...current, 'Nuevo beneficio escolar']
                      });
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#081D3C] border border-[#D4AF37]/40 text-[11px] font-bold text-white hover:text-[#D4AF37]"
                  >
                    <Plus className="w-3 h-3 text-[#D4AF37]" />
                    <span>Agregar Viñeta</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(generalData.heroHighlights || [
                    'Cobranza y Facturación CFDI 4.0',
                    'App Móvil con Identidad del Colegio',
                    'Boletas Oficiales SEP y Kárdex Digital',
                    'Ciberseguridad y Resguardo Cloud'
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const current = [...(generalData.heroHighlights || [
                            'Cobranza y Facturación CFDI 4.0',
                            'App Móvil con Identidad del Colegio',
                            'Boletas Oficiales SEP y Kárdex Digital',
                            'Ciberseguridad y Resguardo Cloud'
                          ])];
                          current[idx] = e.target.value;
                          setGeneralData({ ...generalData, heroHighlights: current });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = (generalData.heroHighlights || []).filter((_, i) => i !== idx);
                          setGeneralData({ ...generalData, heroHighlights: current });
                        }}
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                        title="Eliminar viñeta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Métricas Clave (3 Datos) */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Portada Hero: 3 Métricas de Confianza (Números Inferiores)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(generalData.heroMetrics || [
                    { value: '99.8%', label: 'Puntualidad en Pagos' },
                    { value: '+120', label: 'Colegios Afiliados' },
                    { value: '15 seg', label: 'Pase de Lista Digital' }
                  ]).map((metric, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#081D3C] border border-[#D4AF37]/30 space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-white/70 mb-1">Dato / Número #{idx + 1}</label>
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => {
                            const current = [...(generalData.heroMetrics || [
                              { value: '99.8%', label: 'Puntualidad en Pagos' },
                              { value: '+120', label: 'Colegios Afiliados' },
                              { value: '15 seg', label: 'Pase de Lista Digital' }
                            ])];
                            current[idx] = { ...current[idx], value: e.target.value };
                            setGeneralData({ ...generalData, heroMetrics: current });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg text-sm bg-[#0B2545] border border-[#D4AF37]/50 text-[#F5B82E] font-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/70 mb-1">Etiqueta / Descripción</label>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => {
                            const current = [...(generalData.heroMetrics || [
                              { value: '99.8%', label: 'Puntualidad en Pagos' },
                              { value: '+120', label: 'Colegios Afiliados' },
                              { value: '15 seg', label: 'Pase de Lista Digital' }
                            ])];
                            current[idx] = { ...current[idx], label: e.target.value };
                            setGeneralData({ ...generalData, heroMetrics: current });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg text-xs bg-[#0B2545] border border-[#D4AF37]/50 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Tarjeta Derecha (Escaparate Interactivo) */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Portada Hero: Tarjeta Escaparate Derecha (Recuadro del Campus)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Título Superior</label>
                    <input
                      type="text"
                      value={generalData.heroCard?.headerTitle ?? 'my college'}
                      onChange={(e) => setGeneralData({
                        ...generalData,
                        heroCard: {
                          ...(generalData.heroCard || {}),
                          headerTitle: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Ciclo Escolar / Subtítulo</label>
                    <input
                      type="text"
                      value={generalData.heroCard?.headerSubtitle ?? 'Ciclo Escolar 2026 – 2027'}
                      onChange={(e) => setGeneralData({
                        ...generalData,
                        heroCard: {
                          ...(generalData.heroCard || {}),
                          headerSubtitle: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Insignia Estado</label>
                    <input
                      type="text"
                      value={generalData.heroCard?.badgeStatus ?? 'En Línea'}
                      onChange={(e) => setGeneralData({
                        ...generalData,
                        heroCard: {
                          ...(generalData.heroCard || {}),
                          badgeStatus: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-[#F5B82E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Nombre del Colegio Demostrativo</label>
                    <input
                      type="text"
                      value={generalData.heroCard?.schoolName ?? 'Colegio Privado Modelo'}
                      onChange={(e) => setGeneralData({
                        ...generalData,
                        heroCard: {
                          ...(generalData.heroCard || {}),
                          schoolName: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-[#F5B82E] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Subtítulo del Colegio</label>
                    <input
                      type="text"
                      value={generalData.heroCard?.schoolSubtitle ?? 'Gestión Integral Centralizada • Primaria, Secundaria y Preparatoria'}
                      onChange={(e) => setGeneralData({
                        ...generalData,
                        heroCard: {
                          ...(generalData.heroCard || {}),
                          schoolSubtitle: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                    />
                  </div>
                </div>

                {/* 3 Módulos interiores de la tarjeta */}
                <div className="space-y-3 pt-2 border-t border-[#D4AF37]/20">
                  <span className="text-[11px] font-bold text-white/70 block">
                    3 Filas de Módulos Destacados en la Tarjeta:
                  </span>

                  {(generalData.heroCard?.items || [
                    {
                      title: 'Kárdex & Calificaciones',
                      subtitle: 'Boletas SEP 100% digitalizadas',
                      badge: '100% Al día',
                      iconType: 'kardex' as const
                    },
                    {
                      title: 'Cobranza Automatizada',
                      subtitle: 'CFDI 4.0 timbrado al instante',
                      badge: '+98.5% Cobrado',
                      iconType: 'cobranza' as const
                    },
                    {
                      title: 'App Familias & Alumnos',
                      subtitle: 'Circulares, avisos y tareas push',
                      badge: 'Push Activo',
                      iconType: 'app' as const
                    }
                  ]).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#081D3C] border border-[#D4AF37]/30 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-white/60 mb-0.5">Título #{idx + 1}</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const current = [...(generalData.heroCard?.items || [
                              { title: 'Kárdex & Calificaciones', subtitle: 'Boletas SEP 100% digitalizadas', badge: '100% Al día', iconType: 'kardex' as const },
                              { title: 'Cobranza Automatizada', subtitle: 'CFDI 4.0 timbrado al instante', badge: '+98.5% Cobrado', iconType: 'cobranza' as const },
                              { title: 'App Familias & Alumnos', subtitle: 'Circulares, avisos y tareas push', badge: 'Push Activo', iconType: 'app' as const }
                            ])];
                            current[idx] = { ...current[idx], title: e.target.value };
                            setGeneralData({
                              ...generalData,
                              heroCard: { ...(generalData.heroCard || {}), items: current }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#0B2545] border border-[#D4AF37]/40 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/60 mb-0.5">Subtítulo</label>
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={(e) => {
                            const current = [...(generalData.heroCard?.items || [
                              { title: 'Kárdex & Calificaciones', subtitle: 'Boletas SEP 100% digitalizadas', badge: '100% Al día', iconType: 'kardex' as const },
                              { title: 'Cobranza Automatizada', subtitle: 'CFDI 4.0 timbrado al instante', badge: '+98.5% Cobrado', iconType: 'cobranza' as const },
                              { title: 'App Familias & Alumnos', subtitle: 'Circulares, avisos y tareas push', badge: 'Push Activo', iconType: 'app' as const }
                            ])];
                            current[idx] = { ...current[idx], subtitle: e.target.value };
                            setGeneralData({
                              ...generalData,
                              heroCard: { ...(generalData.heroCard || {}), items: current }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#0B2545] border border-[#D4AF37]/40 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/60 mb-0.5">Insignia / Estado</label>
                        <input
                          type="text"
                          value={item.badge}
                          onChange={(e) => {
                            const current = [...(generalData.heroCard?.items || [
                              { title: 'Kárdex & Calificaciones', subtitle: 'Boletas SEP 100% digitalizadas', badge: '100% Al día', iconType: 'kardex' as const },
                              { title: 'Cobranza Automatizada', subtitle: 'CFDI 4.0 timbrado al instante', badge: '+98.5% Cobrado', iconType: 'cobranza' as const },
                              { title: 'App Familias & Alumnos', subtitle: 'Circulares, avisos y tareas push', badge: 'Push Activo', iconType: 'app' as const }
                            ])];
                            current[idx] = { ...current[idx], badge: e.target.value };
                            setGeneralData({
                              ...generalData,
                              heroCard: { ...(generalData.heroCard || {}), items: current }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#0B2545] border border-[#D4AF37]/40 text-[#F5B82E] font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Pie Izquierdo (Seguridad)</label>
                    <input
                      type="text"
                      value={generalData.heroCard?.footerSecurity ?? 'Servidores Cloud Cifrados'}
                      onChange={(e) => setGeneralData({
                        ...generalData,
                        heroCard: {
                          ...(generalData.heroCard || {}),
                          footerSecurity: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-[#F5B82E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Pie Derecho (Disponibilidad)</label>
                    <input
                      type="text"
                      value={generalData.heroCard?.footerAvailability ?? 'Disponibilidad 99.9%'}
                      onChange={(e) => setGeneralData({
                        ...generalData,
                        heroCard: {
                          ...(generalData.heroCard || {}),
                          footerAvailability: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-semibold"
                    />
                  </div>
                </div>

              </div>

              {/* Nosotros */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Quiénes Somos (Nosotros)</h4>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Título de la Sección</label>
                  <input
                    type="text"
                    value={generalData.aboutTitle}
                    onChange={(e) => setGeneralData({ ...generalData, aboutTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Resumen Inicial</label>
                  <textarea
                    rows={2}
                    value={generalData.aboutSummary}
                    onChange={(e) => setGeneralData({ ...generalData, aboutSummary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Historia y Razón de Ser</label>
                  <textarea
                    rows={3}
                    value={generalData.aboutStory}
                    onChange={(e) => setGeneralData({ ...generalData, aboutStory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>
              </div>

              {/* Misión y Visión */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Misión y Visión</h4>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Misión Institucional</label>
                  <textarea
                    rows={3}
                    value={generalData.mission}
                    onChange={(e) => setGeneralData({ ...generalData, mission: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Visión Institucional</label>
                  <textarea
                    rows={3}
                    value={generalData.vision}
                    onChange={(e) => setGeneralData({ ...generalData, vision: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MEDIOS DE CONTACTO EDITABLES */}
          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Medios de Contacto & Canales Directos</h3>
                  <p className="text-xs text-white/70">Edita teléfonos, WhatsApp, correo directivo, dirección y redes sociales.</p>
                </div>
                <button
                  onClick={handleSaveContact}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Medios de Contacto'}</span>
                </button>
              </div>

              {/* Atención Inmediata */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  <span>Atención Telefónica y Digital</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      Correo Electrónico Directivo *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="email"
                        value={generalData.contactEmail}
                        onChange={(e) => setGeneralData({ ...generalData, contactEmail: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      WhatsApp de Atención Inmediata *
                    </label>
                    <input
                      type="text"
                      placeholder="+52 55 1234 5678"
                      value={generalData.contactWhatsapp}
                      onChange={(e) => setGeneralData({ ...generalData, contactWhatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      Teléfono Conmutador Directivo *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="text"
                        placeholder="+52 (55) 8432-9000"
                        value={generalData.contactPhone}
                        onChange={(e) => setGeneralData({ ...generalData, contactPhone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      Correo de Soporte a Colegios
                    </label>
                    <div className="relative">
                      <LifeBuoy className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="email"
                        placeholder="soporte@mycollege.com.mx"
                        value={generalData.supportEmail || ''}
                        onChange={(e) => setGeneralData({ ...generalData, supportEmail: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicación y Horarios */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Ubicación y Horarios de Atención</span>
                </h4>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    Dirección de Oficinas Corporativas
                  </label>
                  <input
                    type="text"
                    value={generalData.address}
                    onChange={(e) => setGeneralData({ ...generalData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    Horario de Atención para Colegios
                  </label>
                  <input
                    type="text"
                    value={generalData.schedule}
                    onChange={(e) => setGeneralData({ ...generalData, schedule: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>
              </div>

              {/* Redes Sociales y Enlaces Oficiales */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Redes Sociales y Enlaces
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">LinkedIn Institucional</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/mycollege"
                      value={generalData.linkedinUrl || ''}
                      onChange={(e) => setGeneralData({ ...generalData, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Facebook</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/mycollege.mx"
                      value={generalData.facebookUrl || ''}
                      onChange={(e) => setGeneralData({ ...generalData, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Instagram</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/mycollege.mx"
                      value={generalData.instagramUrl || ''}
                      onChange={(e) => setGeneralData({ ...generalData, instagramUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Canal de YouTube</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@mycollege"
                      value={generalData.youtubeUrl || ''}
                      onChange={(e) => setGeneralData({ ...generalData, youtubeUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PERSONALIZADOR DE COLORES DE RECUADROS */}
          {activeTab === 'cards' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Personalizador de Colores de Recuadros & Tarjetas</h3>
                  <p className="text-xs text-white/70">Ajusta los fondos, orlas, bordes y textos de los bloques en toda la plataforma.</p>
                </div>
                <button
                  onClick={handleSaveCardColors}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Colores en BD'}</span>
                </button>
              </div>

              {/* Paletas Rápidas en 1 Clic */}
              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Paletas Oficiales: Blanco (Mayormente), Azul Marino y Dorado
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      name: 'Blanco Puro & Dorado (Predeterminado)',
                      bg: '#FFFFFF',
                      border: '#D4AF37',
                      text: '#081D3C',
                      accent: '#D4AF37',
                    },
                    {
                      name: 'Blanco Nieve & Oro Brillante',
                      bg: '#FFFFFF',
                      border: '#F5B82E',
                      text: '#081D3C',
                      accent: '#F5B82E',
                    },
                    {
                      name: 'Blanco Suave & Borde Azul',
                      bg: '#F8FAFC',
                      border: '#081D3C',
                      text: '#081D3C',
                      accent: '#D4AF37',
                    },
                    {
                      name: 'Azul Marino & Borde Dorado',
                      bg: '#081D3C',
                      border: '#D4AF37',
                      text: '#FFFFFF',
                      accent: '#F5B82E',
                    },
                    {
                      name: 'Azul Noche & Borde Oro',
                      bg: '#0B2545',
                      border: '#D4AF37',
                      text: '#FFFFFF',
                      accent: '#F5B82E',
                    },
                    {
                      name: 'Blanco & Borde Azul Suave',
                      bg: '#FFFFFF',
                      border: '#0B2545',
                      text: '#081D3C',
                      accent: '#D4AF37',
                    }
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCardColorsData({
                        ...cardColorsData,
                        cardBg: p.bg,
                        cardBorder: p.border,
                        cardText: p.text,
                        cardAccent: p.accent
                      })}
                      className="p-3 rounded-xl border border-white/20 text-left hover:border-[#D4AF37] transition-all flex items-center justify-between"
                      style={{ backgroundColor: p.bg }}
                    >
                      <div>
                        <div className="font-bold text-xs" style={{ color: p.text }}>{p.name}</div>
                        <div className="text-[10px]" style={{ color: p.accent }}>Fondo {p.bg}</div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: p.bg, borderColor: p.border }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine-Tuning Controls + Live Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Color Controls */}
                <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Controles de Color del Recuadro
                  </h4>

                  {/* Card Background */}
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Color de Fondo del Recuadro</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cardColorsData.cardBg.startsWith('#') ? cardColorsData.cardBg : '#0B2545'}
                        onChange={(e) => setCardColorsData({ ...cardColorsData, cardBg: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={cardColorsData.cardBg}
                        onChange={(e) => setCardColorsData({ ...cardColorsData, cardBg: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Card Border */}
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Color del Borde del Recuadro</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cardColorsData.cardBorder.startsWith('#') ? cardColorsData.cardBorder : '#D4AF37'}
                        onChange={(e) => setCardColorsData({ ...cardColorsData, cardBorder: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={cardColorsData.cardBorder}
                        onChange={(e) => setCardColorsData({ ...cardColorsData, cardBorder: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Card Text Color */}
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Color de Texto Interior</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cardColorsData.cardText.startsWith('#') ? cardColorsData.cardText : '#FFFFFF'}
                        onChange={(e) => setCardColorsData({ ...cardColorsData, cardText: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={cardColorsData.cardText}
                        onChange={(e) => setCardColorsData({ ...cardColorsData, cardText: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Card Accent Color */}
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Color de Acentos & Insignias</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cardColorsData.cardAccent.startsWith('#') ? cardColorsData.cardAccent : '#F5B82E'}
                        onChange={(e) => setCardColorsData({ ...cardColorsData, cardAccent: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={cardColorsData.cardAccent}
                        onChange={(e) => setCardColorsData({ ...cardColorsData, cardAccent: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Radius */}
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Redondez de Esquinas</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['rounded-xl', 'rounded-2xl', 'rounded-3xl'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCardColorsData({ ...cardColorsData, cardRadius: r })}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                            cardColorsData.cardRadius === r
                              ? 'bg-[#D4AF37] text-[#081D3C] border-[#D4AF37]'
                              : 'bg-[#081D3C] text-white border-white/20'
                          }`}
                        >
                          {r.replace('rounded-', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right: Live Preview Box */}
                <div className="p-5 rounded-2xl bg-[#081D3C] border-2 border-[#D4AF37]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-3">
                      Vista Previa en Tiempo Real
                    </span>

                    {/* Preview Element */}
                    <div
                      style={{
                        backgroundColor: cardColorsData.cardBg,
                        borderColor: cardColorsData.cardBorder,
                        color: cardColorsData.cardText,
                      }}
                      className={`p-6 border-2 transition-all shadow-xl ${cardColorsData.cardRadius || 'rounded-3xl'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          className="p-2.5 rounded-xl border"
                          style={{ borderColor: cardColorsData.cardBorder }}
                        >
                          <GraduationCap className="w-5 h-5" style={{ color: cardColorsData.cardAccent }} />
                        </div>
                        <span 
                          className="text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase"
                          style={{ borderColor: cardColorsData.cardBorder, color: cardColorsData.cardAccent }}
                        >
                          Módulo Escolar
                        </span>
                      </div>

                      <h4 className="text-lg font-bold font-serif mb-1" style={{ color: cardColorsData.cardText }}>
                        Cobranza CFDI 4.0 & Facturación
                      </h4>
                      <p className="text-xs opacity-80 leading-relaxed mb-4">
                        Ejemplo visual de cómo se ven los títulos, textos y bordes en este recuadro.
                      </p>

                      <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: `${cardColorsData.cardBorder}40` }}>
                        <span style={{ color: cardColorsData.cardAccent }} className="font-bold">
                          -85% Morosidad
                        </span>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg text-xs font-extrabold shadow"
                          style={{
                            backgroundColor: cardColorsData.cardAccent,
                            color: '#081D3C'
                          }}
                        >
                          Agendar Webinar
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-white/60 mt-4 leading-relaxed">
                    Al dar clic en <strong>Guardar Colores en BD</strong>, los recuadros de toda la plataforma adoptarán esta configuración exacta.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: OBJETIVOS */}
          {activeTab === 'objectives' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Gestión de Objetivos Institucionales</h3>
                  <p className="text-xs text-white/70">Edita los objetivos y métricas que se muestran en el sitio.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newObj = {
                        id: `obj-${Date.now()}`,
                        title: 'Nuevo Objetivo Estratégico',
                        description: 'Descripción detallada de la meta para colegios privados.',
                        metric: '100% Eficiencia',
                        iconName: 'Target'
                      };
                      setGeneralData({
                        ...generalData,
                        objectives: [...generalData.objectives, newObj]
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B2545] border border-[#D4AF37]/40 text-xs font-bold text-white"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Agregar Objetivo</span>
                  </button>
                  <button
                    onClick={handleSaveObjectives}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Guardando...' : 'Guardar Objetivos'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {generalData.objectives.map((obj, index) => (
                  <div key={obj.id} className="p-4 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#D4AF37]">Objetivo #{index + 1}</span>
                      <button
                        onClick={() => {
                          const updated = generalData.objectives.filter(o => o.id !== obj.id);
                          setGeneralData({ ...generalData, objectives: updated });
                        }}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-white/80 mb-1">Título del Objetivo</label>
                        <input
                          type="text"
                          value={obj.title}
                          onChange={(e) => {
                            const updated = [...generalData.objectives];
                            updated[index].title = e.target.value;
                            setGeneralData({ ...generalData, objectives: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">Métrica Destacada</label>
                        <input
                          type="text"
                          value={obj.metric || ''}
                          onChange={(e) => {
                            const updated = [...generalData.objectives];
                            updated[index].metric = e.target.value;
                            setGeneralData({ ...generalData, objectives: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-[#F5B82E] font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">Descripción</label>
                      <textarea
                        rows={2}
                        value={obj.description}
                        onChange={(e) => {
                          const updated = [...generalData.objectives];
                          updated[index].description = e.target.value;
                          setGeneralData({ ...generalData, objectives: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: ACTUALIZACIONES & BLOG */}
          {activeTab === 'updates' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="pb-3 border-b border-[#D4AF37]/30">
                <h3 className="text-lg font-bold text-white font-serif">Publicar Actualizaciones y Novedades</h3>
                <p className="text-xs text-white/70">Comparte avisos, mejoras del sistema y eventos con la comunidad escolar.</p>
              </div>

              {/* Form to Create New Update */}
              <form onSubmit={handleCreateUpdate} className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/40 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Crear Nueva Publicación</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-white/80 mb-1">Título de la Actualización *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Integración de nuevo módulo de admisiones"
                      value={newUpdate.title}
                      onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Categoría</label>
                    <input
                      type="text"
                      value={newUpdate.category}
                      onChange={(e) => setNewUpdate({ ...newUpdate, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Insignia / Badge</label>
                    <input
                      type="text"
                      value={newUpdate.badge}
                      onChange={(e) => setNewUpdate({ ...newUpdate, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-[#F5B82E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Autor</label>
                    <input
                      type="text"
                      value={newUpdate.author}
                      onChange={(e) => setNewUpdate({ ...newUpdate, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Fecha de Publicación</label>
                    <input
                      type="text"
                      value={newUpdate.date}
                      onChange={(e) => setNewUpdate({ ...newUpdate, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Resumen Corto *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Breve descripción que se verá en la tarjeta del blog..."
                    value={newUpdate.summary}
                    onChange={(e) => setNewUpdate({ ...newUpdate, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Contenido Completo (Opcional)</label>
                  <textarea
                    rows={4}
                    placeholder="Detalles ampliados de la novedad o comunicado institucional..."
                    value={newUpdate.content}
                    onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar en la Plataforma</span>
                </button>
              </form>

              {/* Existing Updates List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Publicaciones Existentes ({updates.length})
                </h4>

                {updates.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/20 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#081D3C] text-[#F5B82E] border border-[#D4AF37]/40">
                          {item.category}
                        </span>
                        <span className="text-xs text-white/60">{item.date}</span>
                      </div>
                      <h5 className="font-bold text-sm text-white">{item.title}</h5>
                      <p className="text-xs text-white/70 line-clamp-1">{item.summary}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteUpdate(item.id)}
                      className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 shrink-0"
                      title="Eliminar publicación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: APARTADOS & ESTRUCTURA */}
          {activeTab === 'sections' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D4AF37]/30">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Gestión de Apartados & Estructura ({sectionsList.length})</h3>
                  <p className="text-xs text-white/70">Agrega o quita apartados, centra sus textos o reordena los bloques del sitio.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSectionModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B2545] border border-[#D4AF37]/50 text-xs font-bold text-[#F5B82E] hover:bg-[#D4AF37] hover:text-[#081D3C] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Agregar Apartado</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSections}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Guardando...' : 'Guardar Apartados'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Alignment Actions */}
              <div className="p-4 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white/80">Alineación rápida de todos los apartados:</span>
                  <button
                    type="button"
                    onClick={() => handleSetAllSectionsAlign('center')}
                    className="px-3 py-1.5 rounded-lg bg-[#081D3C] border border-[#D4AF37]/40 text-[#F5B82E] text-xs font-bold hover:bg-[#D4AF37] hover:text-[#081D3C] flex items-center gap-1.5 transition-all"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                    <span>Centrar Todos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllSectionsAlign('left')}
                    className="px-3 py-1.5 rounded-lg bg-[#081D3C] border border-white/20 text-white/80 text-xs font-bold hover:bg-white/10 flex items-center gap-1.5 transition-all"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Alinear Todos Izquierda</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Restablecer los apartados a su configuración original?')) {
                      setSectionsList(DEFAULT_PAGE_SECTIONS);
                    }
                  }}
                  className="text-xs text-white/70 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer iniciales</span>
                </button>
              </div>

              {/* Sections List */}
              <div className="space-y-3">
                {sectionsList.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                      sec.visible
                        ? 'bg-[#0B2545] border-[#D4AF37]/30'
                        : 'bg-rose-950/20 border-rose-500/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-[#081D3C] text-[#F5B82E] font-bold text-xs flex items-center justify-center border border-[#D4AF37]/40 shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{sec.name}</span>
                          {sec.badge && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#081D3C] text-[#D4AF37] border border-[#D4AF37]/30">
                              {sec.badge}
                            </span>
                          )}
                          {sec.isCustom && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              Personalizado
                            </span>
                          )}
                          {sec.textAlign === 'center' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-400/40">
                              Centrado
                            </span>
                          )}
                        </div>
                        {sec.description && (
                          <p className="text-xs text-white/60 line-clamp-1">{sec.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Text Align */}
                      <button
                        type="button"
                        onClick={() => handleToggleSectionTextAlign(sec.id)}
                        className="p-2 rounded-xl bg-[#081D3C] border border-[#D4AF37]/40 text-[#F5B82E] hover:bg-[#D4AF37] hover:text-[#081D3C]"
                        title={sec.textAlign === 'center' ? 'Alinear a la izquierda' : 'Centrar textos'}
                      >
                        {sec.textAlign === 'center' ? <AlignLeft className="w-3.5 h-3.5" /> : <AlignCenter className="w-3.5 h-3.5" />}
                      </button>

                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-2 rounded-xl border ${idx === 0 ? 'opacity-30 border-white/10 text-white/30 cursor-not-allowed' : 'bg-[#081D3C] border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#081D3C]'}`}
                        title="Subir"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === sectionsList.length - 1}
                        className={`p-2 rounded-xl border ${idx === sectionsList.length - 1 ? 'opacity-30 border-white/10 text-white/30 cursor-not-allowed' : 'bg-[#081D3C] border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#081D3C]'}`}
                        title="Bajar"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Visibility */}
                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility(sec.id)}
                        className={`p-2 rounded-xl border ${sec.visible ? 'bg-[#081D3C] text-[#D4AF37] border-[#D4AF37]/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'}`}
                        title={sec.visible ? 'Ocultar apartado' : 'Mostrar apartado'}
                      >
                        {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Quitar Apartado */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(sec.id)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 border border-rose-500/40"
                        title="Quitar apartado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Re-add missing default sections */}
              {DEFAULT_PAGE_SECTIONS.filter(d => !sectionsList.some(s => s.id === d.id)).length > 0 && (
                <div className="p-4 rounded-2xl bg-[#081D3C] border border-[#D4AF37]/30 space-y-2">
                  <span className="text-xs font-bold text-[#F5B82E]">
                    Apartados originales disponibles para reincorporar:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_PAGE_SECTIONS.filter(d => !sectionsList.some(s => s.id === d.id)).map(def => (
                      <button
                        key={def.id}
                        type="button"
                        onClick={() => handleReaddDefaultSection(def)}
                        className="px-3 py-1.5 rounded-xl bg-[#0B2545] border border-[#D4AF37]/40 text-xs text-white font-bold hover:bg-[#D4AF37] hover:text-[#081D3C] flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{def.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal to Add Custom Section */}
              {showAddSectionModal && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                  <div className="relative w-full max-w-lg bg-[#081D3C] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30 mb-4">
                      <h4 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-[#D4AF37]" />
                        <span>Agregar Nuevo Apartado</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddSectionModal(false)}
                        className="p-1.5 rounded-full bg-[#0B2545] text-white/80 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateCustomSection} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">Nombre del Apartado *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Vida Estudiantil, Alianzas, Eventos..."
                          value={newSectionForm.name}
                          onChange={(e) => setNewSectionForm({ ...newSectionForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">Insignia / Badge</label>
                          <input
                            type="text"
                            placeholder="Ej. COMUNIDAD"
                            value={newSectionForm.badge}
                            onChange={(e) => setNewSectionForm({ ...newSectionForm, badge: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-[#F5B82E]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">Alineación del Texto</label>
                          <select
                            value={newSectionForm.textAlign}
                            onChange={(e) => setNewSectionForm({ ...newSectionForm, textAlign: e.target.value as 'left' | 'center' })}
                            className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white font-bold"
                          >
                            <option value="left">A la Izquierda</option>
                            <option value="center">Centrado</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">Título Principal</label>
                        <input
                          type="text"
                          placeholder="Título grande que verán los visitantes..."
                          value={newSectionForm.customTitle}
                          onChange={(e) => setNewSectionForm({ ...newSectionForm, customTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">Subtítulo / Resumen</label>
                        <input
                          type="text"
                          placeholder="Descripción breve..."
                          value={newSectionForm.customSubtitle}
                          onChange={(e) => setNewSectionForm({ ...newSectionForm, customSubtitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white/90"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">Contenido / Viñetas (1 por renglón)</label>
                        <textarea
                          rows={4}
                          placeholder="Escribe cada punto en un renglón separado..."
                          value={newSectionForm.customContent}
                          onChange={(e) => setNewSectionForm({ ...newSectionForm, customContent: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-[#0B2545] border-2 border-[#D4AF37]/40 text-white"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddSectionModal(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2545] text-white/80 hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] text-xs font-extrabold shadow-md flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar Apartado</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: MÓDULOS / PRODUCTOS */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="pb-3 border-b border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Módulos de la Plataforma ({productList.length})</h3>
                  <p className="text-xs text-white/70">Agrega o quita los módulos de software integrados en My College.</p>
                </div>
              </div>

              {/* Form to Add New Module */}
              <form onSubmit={handleAddProduct} className="p-6 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/40 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-2 border-b border-[#D4AF37]/20">
                  <PlusCircle className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="text-sm font-bold text-white font-serif">Agregar Nuevo Módulo</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Nombre del Módulo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Control de Biblioteca, Caja Digital, Transporte..."
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Categoría</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as PlatformProduct['category'] })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-bold"
                    >
                      <option value="Academico">Académico</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Comunicacion">Comunicación</option>
                      <option value="Seguridad">Seguridad</option>
                      <option value="Gestion">Gestión</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Lema / Subtítulo Corto</label>
                    <input
                      type="text"
                      placeholder="Ej. Gestión transparente de pagos escolares en segundos"
                      value={newProduct.tagline}
                      onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Insignia / Badge</label>
                    <input
                      type="text"
                      placeholder="Ej. CFDI 4.0, SEP Oficial, Push Móvil"
                      value={newProduct.badge}
                      onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-[#F5B82E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Descripción del Módulo *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Explica qué resuelve este módulo para los directores y maestros..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Características Clave (1 por renglón)</label>
                  <textarea
                    rows={3}
                    placeholder="Escribe cada característica en un renglón separado..."
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Nuevo Módulo en la Plataforma'}</span>
                </button>
              </form>

              {/* Existing Modules Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Módulos Activos en el Sistema ({productList.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productList.map((prod) => (
                    <div key={prod.id} className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#D4AF37] uppercase">{prod.category}</span>
                        <div className="flex items-center gap-2">
                          {prod.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#081D3C] text-[#F5B82E] border border-[#D4AF37]">
                              {prod.badge}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 border border-rose-500/40 transition-colors"
                            title="Quitar módulo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-base text-white">{prod.name}</h4>
                      <p className="text-xs text-white/80">{prod.description}</p>
                      <div className="space-y-1 pt-2 border-t border-[#D4AF37]/20">
                        {prod.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="text-[11px] text-white/70 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-[#D4AF37]" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: POLÍTICA DE PRIVACIDAD */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Aviso y Política de Privacidad</h3>
                  <p className="text-xs text-white/70">Marco legal de resguardo de datos personales de menores y directivos.</p>
                </div>
                <button
                  onClick={handleSavePrivacy}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Política'}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Título del Documento</label>
                  <input
                    type="text"
                    value={privacyData.title}
                    onChange={(e) => setPrivacyData({ ...privacyData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Oficial de Protección de Datos</label>
                    <input
                      type="text"
                      value={privacyData.dataProtectionOfficer}
                      onChange={(e) => setPrivacyData({ ...privacyData, dataProtectionOfficer: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Correo de Privacidad</label>
                    <input
                      type="email"
                      value={privacyData.contactEmail}
                      onChange={(e) => setPrivacyData({ ...privacyData, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">Introducción Legal</label>
                  <textarea
                    rows={4}
                    value={privacyData.introduction}
                    onChange={(e) => setPrivacyData({ ...privacyData, introduction: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: SOLICITUDES DE WEBINAR */}
          {activeTab === 'leads' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#D4AF37]" />
                    <span>Solicitudes de Webinar ({leads.length})</span>
                  </h3>
                  <p className="text-xs text-white/70">Colegios privados que han solicitado una sesión virtual de demostración.</p>
                </div>
                <button
                  onClick={loadLeads}
                  disabled={loadingLeads}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B2545] border border-[#D4AF37]/40 text-xs font-bold text-white hover:bg-[#0E2F57]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0B2545] border-2 border-dashed border-[#D4AF37]/30">
                  <Video className="w-10 h-10 mx-auto text-[#D4AF37]/50 mb-3" />
                  <h4 className="font-bold text-white">No hay solicitudes de Webinar aún</h4>
                  <p className="text-xs text-white/70 mt-1">Cuando los directores completen el formulario en la página, aparecerán aquí.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-black uppercase text-[#D4AF37]">{lead.schoolName}</span>
                          <h4 className="text-sm font-bold text-white">{lead.contactName}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#081D3C] text-[#F5B82E] font-bold border border-[#D4AF37]">
                            {lead.studentCount}
                          </span>
                          <div className="text-[11px] text-white/70 mt-0.5">
                            {lead.createdAt ? new Date(lead.createdAt).toLocaleString('es-MX') : ''}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80 bg-[#081D3C] p-3 rounded-xl border border-[#D4AF37]/20">
                        <div><strong>Email:</strong> <a href={`mailto:${lead.email}`} className="text-[#D4AF37] underline">{lead.email}</a></div>
                        <div><strong>Teléfono:</strong> <a href={`tel:${lead.phone}`} className="text-[#D4AF37] underline">{lead.phone || 'No especificado'}</a></div>
                        {lead.webinarTopic && <div><strong>Tema de Interés:</strong> <span className="text-[#F5B82E] font-bold">{lead.webinarTopic}</span></div>}
                        {(lead.preferredDate || lead.preferredTime) && (
                          <div>
                            <strong>Horario Sugerido:</strong> {lead.preferredDate} {lead.preferredTime}
                          </div>
                        )}
                        {lead.currentSystem && <div><strong>Sistema actual:</strong> {lead.currentSystem}</div>}
                      </div>

                      {lead.message && (
                        <div className="p-3 rounded-xl bg-[#081D3C] text-xs text-white/90 italic border border-[#D4AF37]/30">
                          &ldquo;{lead.message}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: ESCUDO & COLORES OFICIALES */}
          {activeTab === 'identity' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              
              {/* Escudo Information Box */}
              <div className="p-6 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37] flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0 p-3 bg-[#081D3C] rounded-2xl border border-[#D4AF37]">
                  <MyCollegeLogo size="lg" layout="stacked" showText={true} />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Escudo Oficial y Tríada Cromática
                  </span>
                  <h4 className="text-xl font-bold font-serif text-white">
                    Azul Marino, Oro Imperial y Blanco
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Todos los diseños visuales de la plataforma utilizan estrictamente estos 3 colores del escudo: el azul marino del birrete y fondo, el dorado brillante de la orla, borla y libro abierto, y el blanco puro para contraste y claridad tipográfica.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#081D3C] text-xs font-bold text-white border border-white/20">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#081D3C] border border-white" /> Azul (#081D3C)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#081D3C] text-xs font-bold text-[#F5B82E] border border-[#D4AF37]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" /> Dorado (#D4AF37)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#081D3C] text-xs font-bold text-white border border-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-white" /> Blanco (#FFFFFF)
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Locked Theme Notice */}
              <div className="p-6 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#D4AF37]" />
                    <h4 className="text-base font-bold text-white font-serif">
                      Diseño General Único & Oficial: Blanco, Azul y Dorado
                    </h4>
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#081D3C]">
                    EXCLUSIVO & FIJADO
                  </span>
                </div>

                <p className="text-xs text-white/80 leading-relaxed">
                  Se han retirado las opciones alternativas oscuras y secundarias. La plataforma opera de forma fija y homogénea con un lienzo <strong>blanco (mayormente)</strong> luminoso y elegante, tipografía en <strong>azul marino institucional</strong> y orlas en <strong>dorado oficial</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-white text-[#081D3C] border-2 border-[#D4AF37] text-center shadow">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#D4AF37] mx-auto mb-2 shadow-inner" />
                    <div className="font-extrabold text-xs">Blanco Puro</div>
                    <div className="text-[10px] text-[#081D3C]/70">Fondo Principal (Mayormente)</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#081D3C] text-white border-2 border-[#D4AF37] text-center shadow">
                    <div className="w-8 h-8 rounded-full bg-[#081D3C] border-2 border-[#D4AF37] mx-auto mb-2" />
                    <div className="font-extrabold text-xs">Azul Marino</div>
                    <div className="text-[10px] text-white/70">Títulos, Textos & Botones</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#D4AF37] text-[#081D3C] border-2 border-[#F5B82E] text-center shadow">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] border-2 border-white mx-auto mb-2" />
                    <div className="font-extrabold text-xs">Oro Escolar</div>
                    <div className="text-[10px] text-[#081D3C]/80">Orlas, Borde y Escudo</div>
                  </div>
                </div>

                <p className="text-[11px] text-[#D4AF37] italic pt-2">
                  * Si deseas modificar los tonos individuales o fondos de las tarjetas, puedes hacerlo en la pestaña «Colores de Recuadros».
                </p>
              </div>
            </div>
          )}

          {/* TAB 10: SEGURIDAD & ENTRADA TRASERA */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="pb-3 border-b border-[#D4AF37]/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] px-2.5 py-0.5 rounded-full bg-[#0B2545] border border-[#D4AF37]/40">
                    Control de Acceso Privado
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-serif text-white">
                  Entrada Trasera y Clave Maestra
                </h3>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Para mantener la página 100% limpia para los colegios y padres de familia, los accesos de edición están ocultos. Solo tú puedes acceder mediante las siguientes opciones secretas.
                </p>
              </div>

              {/* 3 Backdoor Methods Cards */}
              <div>
                <h4 className="text-sm font-bold text-[#D4AF37] mb-3 uppercase tracking-wider">
                  Tus Métodos de Entrada Trasera Habilitados:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Method 1: URL Secreta */}
                  <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 flex flex-col justify-between">
                    <div>
                      <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] w-fit mb-3 border border-[#D4AF37]/40">
                        <LinkIcon className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-sm text-white mb-1">1. URL Secreta Directa</h5>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Ingresa a tu sitio agregando <code className="text-[#F5B82E] font-bold">?secret=desingMC</code> o <code className="text-[#F5B82E] font-bold">#desingMC</code> al final de la dirección web.
                      </p>
                      <p className="text-[11px] text-[#D4AF37] mt-1 font-mono">
                        Usuario: desingMC • Clave: mc2709
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 text-[11px] text-[#D4AF37] font-bold">
                      Abre el login automático
                    </div>
                  </div>

                  {/* Method 2: Triple Clic Secreto */}
                  <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 flex flex-col justify-between">
                    <div>
                      <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] w-fit mb-3 border border-[#D4AF37]/40">
                        <MousePointerClick className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-sm text-white mb-1">2. Clic en Escudo / Cintilla</h5>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Haz <strong>3 clics rápidos</strong> sobre el Escudo oficial, o un clic sobre «Calidad & Excelencia» en la cintilla dorada superior.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 text-[11px] text-[#D4AF37] font-bold">
                      Invisible para visitantes
                    </div>
                  </div>

                  {/* Method 3: Atajo de Teclado */}
                  <div className="p-5 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/30 flex flex-col justify-between">
                    <div>
                      <div className="p-2.5 rounded-xl bg-[#081D3C] text-[#D4AF37] w-fit mb-3 border border-[#D4AF37]/40">
                        <Keyboard className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-sm text-white mb-1">3. Atajo de Teclado</h5>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Presiona en cualquier momento la combinación: <br />
                        <kbd className="px-2 py-0.5 rounded bg-[#081D3C] border border-[#D4AF37]/60 text-white font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-2 py-0.5 rounded bg-[#081D3C] border border-[#D4AF37]/60 text-white font-mono text-[10px]">Shift</kbd> + <kbd className="px-2 py-0.5 rounded bg-[#081D3C] border border-[#D4AF37]/60 text-white font-mono text-[10px]">A</kbd>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 text-[11px] text-[#D4AF37] font-bold">
                      Acceso instantáneo
                    </div>
                  </div>

                </div>
              </div>

              {/* Form to change password */}
              <div className="p-6 rounded-2xl bg-[#0B2545] border-2 border-[#D4AF37]/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#D4AF37]" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Cambiar Clave Maestra de Acceso
                    </h4>
                  </div>
                  <span className="text-xs text-white/60">
                    Clave actual activa: <span className="font-mono text-[#D4AF37] font-bold">{currentSecurityKey}</span>
                  </span>
                </div>

                <form onSubmit={handleSaveSecurityKey} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Nueva Clave Maestra</label>
                    <input
                      type="password"
                      placeholder="Mínimo 5 caracteres"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">Confirmar Nueva Clave</label>
                    <input
                      type="password"
                      placeholder="Vuelve a escribir la clave"
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-[#081D3C] border-2 border-[#D4AF37]/40 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold text-xs shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Nueva Clave en Firestore</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
