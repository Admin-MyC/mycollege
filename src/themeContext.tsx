import React, { createContext, useContext, useState, useEffect } from 'react';
import { DesignTheme, CardColorSettings, DEFAULT_CARD_COLORS } from './types';
import { 
  getActiveTheme, 
  saveActiveTheme, 
  subscribeToTheme,
  getCardColors,
  saveCardColors,
  subscribeToCardColors
} from './firebase';

export interface ThemeConfig {
  id: DesignTheme;
  name: string;
  badge: string;
  description: string;
  headerBg: string;
  bodyBg: string;
  heroBg: string;
  cardBg: string;
  cardBorder: string;
  textHeading: string;
  textBody: string;
  accentGold: string;
  primaryButton: string;
  secondaryButton: string;
  fontClass: string;
  navVariant: 'dark' | 'light';
  palette: {
    primary: string; // Azul Marino (#081D3C)
    accent: string;  // Dorado (#D4AF37)
    base: string;    // Blanco (#FFFFFF) - Mayormente
  };
}

// Single Official Design: Blanco (Mayormente), Azul Marino & Dorado
export const OFFICIAL_THEME: ThemeConfig = {
  id: 'modern',
  name: 'Blanco Institucional, Azul Marino & Dorado',
  badge: 'Blanco (Mayormente) • Azul • Dorado',
  description: 'Lienzo blanco luminoso y prestigioso, tipografía y botones en azul marino institucional, con orlas y detalles en dorado oficial.',
  headerBg: 'bg-white/95 backdrop-blur-md border-b-2 border-[#D4AF37]/30 shadow-sm',
  bodyBg: 'bg-white text-[#081D3C]',
  heroBg: 'bg-gradient-to-b from-slate-50 via-white to-slate-50 text-[#081D3C]',
  cardBg: 'bg-white',
  cardBorder: 'border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] shadow-xl shadow-[#081D3C]/5',
  textHeading: 'text-[#081D3C] font-serif font-black tracking-tight',
  textBody: 'text-[#081D3C]/85',
  accentGold: 'text-[#D4AF37]',
  primaryButton: 'bg-[#081D3C] hover:bg-[#0B2545] text-white font-extrabold shadow-lg shadow-[#081D3C]/20 border border-[#D4AF37]/60 transition-all',
  secondaryButton: 'bg-[#D4AF37] hover:bg-[#F5B82E] text-[#081D3C] font-extrabold shadow-md transition-all',
  fontClass: 'font-["Plus_Jakarta_Sans",_sans-serif]',
  navVariant: 'light',
  palette: {
    primary: '#081D3C',
    accent: '#D4AF37',
    base: '#FFFFFF'
  }
};

// All theme lookups strictly point to the single official White, Blue & Gold design
export const THEMES: Record<string, ThemeConfig> = {
  modern: OFFICIAL_THEME,
  prestige: OFFICIAL_THEME,
  minimal: OFFICIAL_THEME,
  impact: OFFICIAL_THEME,
  official: OFFICIAL_THEME
};

interface ThemeContextType {
  currentTheme: DesignTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: DesignTheme) => void;
  saveAsDefault: (theme: DesignTheme) => Promise<void>;
  isSavingTheme: boolean;
  fixedThemeInDb: DesignTheme;
  cardColors: CardColorSettings;
  setCardColors: (colors: CardColorSettings) => void;
  saveCardColorsToDb: (colors: CardColorSettings) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<DesignTheme>('modern');
  const [fixedThemeInDb, setFixedThemeInDb] = useState<DesignTheme>('modern');
  const [isSavingTheme, setIsSavingTheme] = useState(false);

  // Card colors customization state (predominantly White, Blue & Gold)
  const [cardColors, setCardColorsState] = useState<CardColorSettings>(() => {
    try {
      const cached = localStorage.getItem('my_college_card_colors');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return DEFAULT_CARD_COLORS;
  });

  useEffect(() => {
    // 1. Initial fetch directly from Firestore
    getActiveTheme().then(theme => {
      if (theme) {
        setCurrentTheme('modern');
        setFixedThemeInDb('modern');
        try {
          localStorage.setItem('my_college_fixed_theme', 'modern');
        } catch {}
      }
    });

    getCardColors().then(colors => {
      if (colors) {
        setCardColorsState(colors);
        try {
          localStorage.setItem('my_college_card_colors', JSON.stringify(colors));
        } catch {}
      }
    });

    // 2. Real-time listener for card styles
    const unsubCards = subscribeToCardColors((colorsFromDb) => {
      if (colorsFromDb) {
        setCardColorsState(colorsFromDb);
        try {
          localStorage.setItem('my_college_card_colors', JSON.stringify(colorsFromDb));
        } catch {}
      }
    });

    return () => {
      if (unsubCards) unsubCards();
    };
  }, []);

  const setTheme = (theme: DesignTheme) => {
    setCurrentTheme('modern');
  };

  const saveAsDefault = async (theme: DesignTheme) => {
    setIsSavingTheme(true);
    try {
      await saveActiveTheme('modern');
      setCurrentTheme('modern');
      setFixedThemeInDb('modern');
      try {
        localStorage.setItem('my_college_fixed_theme', 'modern');
      } catch {}
    } finally {
      setIsSavingTheme(false);
    }
  };

  const setCardColors = (colors: CardColorSettings) => {
    setCardColorsState(colors);
  };

  const saveCardColorsToDb = async (colors: CardColorSettings) => {
    await saveCardColors(colors);
    setCardColorsState(colors);
    try {
      localStorage.setItem('my_college_card_colors', JSON.stringify(colors));
    } catch {}
  };

  const themeConfig = OFFICIAL_THEME;

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeConfig,
        setTheme,
        saveAsDefault,
        isSavingTheme,
        fixedThemeInDb,
        cardColors,
        setCardColors,
        saveCardColorsToDb
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
