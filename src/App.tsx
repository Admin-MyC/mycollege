import React, { useState, useEffect } from 'react';
import { 
  SiteContent, 
  PlatformProduct, 
  PlatformUpdate, 
  PrivacyPolicyContent,
  SectionItem,
  SectionId,
  DEFAULT_PAGE_SECTIONS
} from './types';
import { 
  defaultSiteContent, 
  defaultProducts, 
  defaultUpdates, 
  defaultPrivacyPolicy 
} from './data/defaultContent';
import { 
  seedInitialFirestoreData, 
  getSiteContent, 
  getProducts, 
  getUpdates, 
  getPrivacyPolicy,
  getPageLayout,
  savePageLayout,
  updateSiteContent
} from './firebase';
import { ThemeProvider, useAppTheme } from './themeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MissionVisionSection } from './components/MissionVisionSection';
import { ObjectivesSection } from './components/ObjectivesSection';
import { ProductsSection } from './components/ProductsSection';
import { SavingsCalculator } from './components/SavingsCalculator';
import { UpdatesSection } from './components/UpdatesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { DemoContactSection } from './components/DemoContactSection';
import { Footer } from './components/Footer';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AdminCMSModal, CMSTab } from './components/AdminCMSModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminBar } from './components/AdminBar';
import { DesignModeDeck } from './components/DesignModeDeck';
import { SectionContainer } from './components/SectionContainer';
import { SectionOrderDrawer } from './components/SectionOrderDrawer';
import { CustomSection } from './components/CustomSection';

function MainAppContent() {
  const { currentTheme, themeConfig, saveAsDefault, cardColors, saveCardColorsToDb } = useAppTheme();

  // Content state loaded from Firebase Firestore
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [products, setProducts] = useState<PlatformProduct[]>(defaultProducts);
  const [updates, setUpdates] = useState<PlatformUpdate[]>(defaultUpdates);
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicyContent>(defaultPrivacyPolicy);
  const [sections, setSections] = useState<SectionItem[]>(DEFAULT_PAGE_SECTIONS);
  const [, setLoading] = useState(true);

  // Admin authentication state (Backdoor)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('my_college_admin_auth') === 'true' ||
        sessionStorage.getItem('my_college_admin_auth') === 'true'
      );
    } catch {
      return false;
    }
  });

  // Modo Diseño State
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<CMSTab>('general');
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Load Firestore data
  const loadAllData = async () => {
    try {
      await seedInitialFirestoreData();
      
      const [fetchedContent, fetchedProducts, fetchedUpdates, fetchedPrivacy, fetchedLayout] = await Promise.all([
        getSiteContent(),
        getProducts(),
        getUpdates(),
        getPrivacyPolicy(),
        getPageLayout()
      ]);

      if (fetchedContent) setSiteContent(fetchedContent);
      if (fetchedProducts && fetchedProducts.length > 0) setProducts(fetchedProducts);
      if (fetchedUpdates && fetchedUpdates.length > 0) setUpdates(fetchedUpdates);
      if (fetchedPrivacy) setPrivacyPolicy(fetchedPrivacy);
      if (fetchedLayout && fetchedLayout.length > 0) setSections(fetchedLayout);
    } catch (err) {
      console.error('Error loading Firestore data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Backdoor Detection: URL query params, path, hash and keyboard shortcuts
  useEffect(() => {
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    const isSecretUrl = 
      search.includes('desingmc') || 
      search.includes('admin') || 
      search.includes('secret') ||
      search.includes('modo') ||
      hash.includes('desingmc') ||
      hash.includes('admin') ||
      hash.includes('diseno') ||
      path.includes('desingmc');

    if (isSecretUrl) {
      if (isAdminAuthenticated) {
        setIsDesignMode(true);
        setSaveSuccessMessage('¡Entrada Secreta verificada! Modo Diseño activado.');
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      } else {
        setLoginModalOpen(true);
      }
    }

    // Secret Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setIsDesignMode(prev => !prev);
        } else {
          setLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  // Backdoor Trigger Handler (from shield triple-click or footer discrete lock)
  const handleTriggerBackdoor = () => {
    if (isAdminAuthenticated) {
      setIsDesignMode(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  // Successful Login Handler (Credentials: desingMC / mc2709)
  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setLoginModalOpen(false);
    setIsDesignMode(true);
    setSaveSuccessMessage('¡Bienvenido! Modo Diseño activado para editar y acomodar los apartados.');
    setTimeout(() => setSaveSuccessMessage(null), 4500);
  };

  // Secure Logout Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('my_college_admin_auth');
      sessionStorage.removeItem('my_college_admin_auth');
    } catch {}
    setIsAdminAuthenticated(false);
    setIsDesignMode(false);
    setAdminOpen(false);
    setIsOrderDrawerOpen(false);
  };

  // Section Reordering Handlers for Modo Diseño
  const handleMoveSectionUp = (id: SectionId) => {
    const index = sections.findIndex(s => s.id === id);
    if (index <= 0) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(index - 1, 0, moved);
    setSections(newSections);
  };

  const handleMoveSectionDown = (id: SectionId) => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1 || index >= sections.length - 1) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(index + 1, 0, moved);
    setSections(newSections);
  };

  const handleToggleSectionVisibility = (id: SectionId) => {
    const newSections = sections.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    setSections(newSections);
  };

  const handleToggleSectionTextAlign = (id: SectionId) => {
    const newSections = sections.map(s => {
      if (s.id === id) {
        const next: 'left' | 'center' = s.textAlign === 'center' ? 'left' : 'center';
        return { ...s, textAlign: next };
      }
      return s;
    });
    setSections(newSections);
  };

  const handleRemoveSection = (id: SectionId) => {
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
  };

  const handleEditSpecificSection = (id: SectionId) => {
    switch (id) {
      case 'hero':
      case 'nosotros':
      case 'mision-vision':
        setAdminTab('general');
        break;
      case 'objetivos':
        setAdminTab('objectives');
        break;
      case 'productos':
        setAdminTab('products');
        break;
      case 'actualizaciones':
        setAdminTab('updates');
        break;
      case 'contacto':
        setAdminTab('contact');
        break;
      default:
        setAdminTab('general');
    }
    setAdminOpen(true);
  };

  // MASTER SAVE HANDLER: "cuando de clic en guardar todo quede tal cual lo deje"
  const handleSaveAllToDatabase = async () => {
    setIsSavingAll(true);
    try {
      // 1. Save sections layout order and visibility to Firestore
      await savePageLayout(sections);

      // 2. Save site content (mission, vision, hero, about, phones, etc.) to Firestore
      await updateSiteContent({
        ...siteContent,
        cardColors
      });

      // 3. Save active theme so it stays fixed for all visitors in Firestore
      await saveAsDefault(currentTheme);

      // 4. Save custom card colors
      if (cardColors) {
        await saveCardColorsToDb(cardColors);
      }

      // 5. Refresh local state
      await loadAllData();

      setSaveSuccessMessage('¡Éxito! Todo quedó guardado en Firestore tal cual lo configuraste.');
      setTimeout(() => setSaveSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Error saving all changes to Firestore:', err);
      alert('Error al guardar en la base de datos de Firebase. Por favor intenta de nuevo.');
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleNavigateToDemo = () => {
    const el = document.getElementById('contacto');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToProducts = () => {
    const el = document.getElementById('productos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeConfig.bodyBg} ${themeConfig.fontClass}`}>
      
      {/* Top Deck: When in Design Mode or Admin is logged in */}
      {isAdminAuthenticated && (
        isDesignMode ? (
          <DesignModeDeck
            onOpenOrderDrawer={() => setIsOrderDrawerOpen(true)}
            onOpenCMS={(tab) => {
              setAdminTab(tab || 'general');
              setAdminOpen(true);
            }}
            onSaveAllToDatabase={handleSaveAllToDatabase}
            onExitDesignMode={() => setIsDesignMode(false)}
            isSaving={isSavingAll}
            saveSuccessMessage={saveSuccessMessage}
          />
        ) : (
          <AdminBar
            onOpenCMS={(tab) => {
              setAdminTab(tab || 'general');
              setAdminOpen(true);
            }}
            onLogout={handleLogout}
            isDesignMode={isDesignMode}
            onToggleDesignMode={() => setIsDesignMode(true)}
            onOpenOrderDrawer={() => setIsOrderDrawerOpen(true)}
          />
        )
      )}

      {/* Navigation Header (Clean, visitor-oriented; shield holds secret triple-click backdoor) */}
      <Navbar
        onTriggerSecretAdmin={handleTriggerBackdoor}
        onNavigateToDemo={handleNavigateToDemo}
      />

      {/* Main Page: Dynamically Ordered & Controllable Sections */}
      <main>
        {sections.map((section, idx) => {
          let sectionComponent: React.ReactNode = null;
          const currentAlign = section.textAlign || siteContent.textAlignment || 'left';

          switch (section.id) {
            case 'hero':
              sectionComponent = (
                <Hero
                  content={siteContent}
                  onNavigateToDemo={handleNavigateToDemo}
                  onNavigateToProducts={handleNavigateToProducts}
                  textAlign={currentAlign}
                />
              );
              break;

            case 'nosotros':
              sectionComponent = (
                <AboutSection
                  content={siteContent}
                  onOpenAdmin={handleTriggerBackdoor}
                  textAlign={currentAlign}
                />
              );
              break;

            case 'mision-vision':
              sectionComponent = (
                <MissionVisionSection
                  content={siteContent}
                  onOpenAdmin={handleTriggerBackdoor}
                  textAlign={currentAlign}
                />
              );
              break;

            case 'objetivos':
              sectionComponent = (
                <ObjectivesSection
                  content={siteContent}
                  onOpenAdmin={() => {
                    setAdminTab('objectives');
                    setAdminOpen(true);
                  }}
                  textAlign={currentAlign}
                />
              );
              break;

            case 'productos':
              sectionComponent = (
                <ProductsSection
                  products={products}
                  onNavigateToDemo={handleNavigateToDemo}
                  onOpenAdmin={() => {
                    setAdminTab('products');
                    setAdminOpen(true);
                  }}
                  textAlign={currentAlign}
                />
              );
              break;

            case 'calculadora':
              sectionComponent = (
                <SavingsCalculator onNavigateToDemo={handleNavigateToDemo} />
              );
              break;

            case 'actualizaciones':
              sectionComponent = (
                <UpdatesSection
                  updates={updates}
                  isAdmin={isAdminAuthenticated}
                  onOpenAdminToUpdates={() => {
                    setAdminTab('updates');
                    setAdminOpen(true);
                  }}
                  textAlign={currentAlign}
                />
              );
              break;

            case 'testimonios':
              sectionComponent = <TestimonialsSection />;
              break;

            case 'contacto':
              sectionComponent = (
                <DemoContactSection 
                  content={siteContent} 
                  textAlign={currentAlign}
                />
              );
              break;

            default:
              if (section.isCustom) {
                sectionComponent = <CustomSection section={section} />;
              } else {
                sectionComponent = null;
              }
          }

          return (
            <SectionContainer
              key={section.id}
              section={section}
              index={idx}
              totalSections={sections.length}
              isDesignMode={isDesignMode}
              onMoveUp={handleMoveSectionUp}
              onMoveDown={handleMoveSectionDown}
              onToggleVisibility={handleToggleSectionVisibility}
              onEditSection={handleEditSpecificSection}
              onToggleTextAlign={handleToggleSectionTextAlign}
              onRemoveSection={handleRemoveSection}
            >
              {sectionComponent}
            </SectionContainer>
          );
        })}
      </main>

      {/* Footer (Clean, institutional; discrete micro-trigger in copyright dot and subtle lock) */}
      <Footer
        content={siteContent}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onTriggerSecretAdmin={handleTriggerBackdoor}
      />

      {/* Floating Save Button when in Design Mode and scrolled down */}
      {isDesignMode && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#081D3C] p-2 rounded-2xl border-2 border-[#D4AF37] shadow-2xl animate-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsOrderDrawerOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-[#0B2545] text-white hover:text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold transition-all"
            title="Acomodar todos los apartados"
          >
            Acomodar Apartados
          </button>

          <button
            onClick={handleSaveAllToDatabase}
            disabled={isSavingAll}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] text-xs font-black shadow-lg flex items-center gap-2 border border-[#FDE382] transition-all"
          >
            <span>{isSavingAll ? 'Guardando...' : '💾 GUARDAR EN BASE DE DATOS'}</span>
          </button>
        </div>
      )}

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        policy={privacyPolicy}
      />

      {/* Section Order Modal / Drawer (Acomodar Apartados) */}
      <SectionOrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        sections={sections}
        onChangeSections={setSections}
        onSaveAll={handleSaveAllToDatabase}
        isSaving={isSavingAll}
      />

      {/* Admin Backdoor Login Modal (Credenciales: desingMC / mc2709) */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Admin CMS Modal to edit all content, mission, vision, objectives, products, privacy, and theme */}
      <AdminCMSModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        siteContent={siteContent}
        products={products}
        updates={updates}
        privacyPolicy={privacyPolicy}
        onRefreshData={loadAllData}
        initialTab={adminTab}
        onLogout={handleLogout}
        sections={sections}
        onSaveSections={async (newSecs) => {
          setSections(newSecs);
          await savePageLayout(newSecs);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
