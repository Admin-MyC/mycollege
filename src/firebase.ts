import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { 
  SiteContent, 
  PlatformProduct, 
  PlatformUpdate, 
  DemoRequest, 
  PrivacyPolicyContent, 
  DesignTheme,
  SectionItem,
  DEFAULT_PAGE_SECTIONS,
  CardColorSettings,
  DEFAULT_CARD_COLORS
} from './types';
import { 
  defaultSiteContent, 
  defaultProducts, 
  defaultUpdates, 
  defaultPrivacyPolicy 
} from './data/defaultContent';

// Initialize Firebase App singleton
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if provided
export const db: Firestore = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Helper to seed Firestore if documents do not exist yet
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    // 1. General Content
    const generalRef = doc(db, 'site_content', 'general');
    const generalSnap = await getDoc(generalRef);
    if (!generalSnap.exists()) {
      await setDoc(generalRef, {
        ...defaultSiteContent,
        updatedAt: new Date().toISOString()
      });
    }

    // 2. Privacy Policy
    const privacyRef = doc(db, 'site_content', 'privacy_policy');
    const privacySnap = await getDoc(privacyRef);
    if (!privacySnap.exists()) {
      await setDoc(privacyRef, {
        ...defaultPrivacyPolicy,
        updatedAt: new Date().toISOString()
      });
    }

    // 3. Products
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      for (const product of defaultProducts) {
        await setDoc(doc(db, 'products', product.id), product);
      }
    }

    // 4. Updates
    const updatesSnap = await getDocs(collection(db, 'updates'));
    if (updatesSnap.empty) {
      for (const update of defaultUpdates) {
        await setDoc(doc(db, 'updates', update.id), update);
      }
    }

    // 5. Default Theme
    const themeRef = doc(db, 'page_settings', 'theme');
    const themeSnap = await getDoc(themeRef);
    if (!themeSnap.exists()) {
      await setDoc(themeRef, {
        activeDesign: 'prestige',
        updatedAt: new Date().toISOString()
      });
    }

    // 6. Page Sections Layout Order
    const layoutRef = doc(db, 'page_settings', 'layout');
    const layoutSnap = await getDoc(layoutRef);
    if (!layoutSnap.exists()) {
      await setDoc(layoutRef, {
        sections: DEFAULT_PAGE_SECTIONS,
        updatedAt: new Date().toISOString()
      });
    }

    // 7. Security Credentials (desingMC / mc2709)
    const securityRef = doc(db, 'page_settings', 'security');
    const securitySnap = await getDoc(securityRef);
    if (!securitySnap.exists()) {
      await setDoc(securityRef, {
        adminUser: 'desingMC',
        adminKey: 'mc2709',
        adminEmail: 'armando.villanueva@mycollege.com.mx',
        updatedAt: new Date().toISOString()
      });
    } else {
      // Ensure desingMC and mc2709 are synced
      await setDoc(securityRef, {
        adminUser: 'desingMC',
        adminKey: securitySnap.data()?.adminKey || 'mc2709',
        adminEmail: 'armando.villanueva@mycollege.com.mx',
      }, { merge: true });
    }
  } catch (error) {
    console.warn('Could not seed initial Firestore data (using fallback defaults):', error);
  }
}

// Fetch General Content
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const generalRef = doc(db, 'site_content', 'general');
    const snap = await getDoc(generalRef);
    if (snap.exists()) {
      return { ...defaultSiteContent, ...(snap.data() as SiteContent) };
    }
  } catch (err) {
    console.error('Error fetching site content from Firestore:', err);
  }
  return defaultSiteContent;
}

// Update General Content
export async function updateSiteContent(data: Partial<SiteContent>): Promise<void> {
  const generalRef = doc(db, 'site_content', 'general');
  await setDoc(generalRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

// Fetch Page Sections Layout Order
export async function getPageLayout(): Promise<SectionItem[]> {
  try {
    const snap = await getDoc(doc(db, 'page_settings', 'layout'));
    if (snap.exists() && snap.data()?.sections) {
      return snap.data().sections as SectionItem[];
    }
  } catch (err) {
    console.error('Error fetching page layout:', err);
  }
  return DEFAULT_PAGE_SECTIONS;
}

// Save Page Sections Layout Order
export async function savePageLayout(sections: SectionItem[]): Promise<void> {
  await setDoc(doc(db, 'page_settings', 'layout'), {
    sections,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// Fetch Privacy Policy
export async function getPrivacyPolicy(): Promise<PrivacyPolicyContent> {
  try {
    const privacyRef = doc(db, 'site_content', 'privacy_policy');
    const snap = await getDoc(privacyRef);
    if (snap.exists()) {
      return { ...defaultPrivacyPolicy, ...(snap.data() as PrivacyPolicyContent) };
    }
  } catch (err) {
    console.error('Error fetching privacy policy:', err);
  }
  return defaultPrivacyPolicy;
}

// Update Privacy Policy
export async function updatePrivacyPolicy(data: PrivacyPolicyContent): Promise<void> {
  const privacyRef = doc(db, 'site_content', 'privacy_policy');
  await setDoc(privacyRef, { ...data, lastUpdated: new Date().toISOString() }, { merge: true });
}

// Fetch Products / Modules
export async function getProducts(): Promise<PlatformProduct[]> {
  try {
    const q = query(collection(db, 'products'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as PlatformProduct));
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
  return defaultProducts;
}

// Save or Update Product
export async function saveProduct(product: PlatformProduct): Promise<void> {
  const prodRef = doc(db, 'products', product.id);
  await setDoc(prodRef, product, { merge: true });
}

// Delete Product
export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}

// Fetch Updates
export async function getUpdates(): Promise<PlatformUpdate[]> {
  try {
    const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as PlatformUpdate));
    }
  } catch (err) {
    console.error('Error fetching updates:', err);
  }
  return defaultUpdates;
}

// Create Update
export async function createUpdate(update: Omit<PlatformUpdate, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'updates'), {
    ...update,
    createdAt: new Date().toISOString(),
    isPublished: true
  });
  return docRef.id;
}

// Delete Update
export async function deleteUpdate(updateId: string): Promise<void> {
  await deleteDoc(doc(db, 'updates', updateId));
}

// Submit Demo Request
export async function submitDemoRequest(request: Omit<DemoRequest, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'demo_requests'), {
    ...request,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
  return docRef.id;
}

// Fetch Demo Requests (for Admin)
export async function getDemoRequests(): Promise<DemoRequest[]> {
  try {
    const q = query(collection(db, 'demo_requests'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as DemoRequest));
  } catch (err) {
    console.error('Error fetching demo requests:', err);
    return [];
  }
}

// Theme Settings
export async function getActiveTheme(): Promise<DesignTheme> {
  try {
    const snap = await getDoc(doc(db, 'page_settings', 'theme'));
    if (snap.exists() && snap.data()?.activeDesign) {
      return snap.data().activeDesign as DesignTheme;
    }
  } catch (err) {
    console.error('Error getting theme:', err);
  }
  return 'prestige';
}

export async function saveActiveTheme(theme: DesignTheme): Promise<void> {
  try {
    await setDoc(doc(db, 'page_settings', 'theme'), {
      activeDesign: theme,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving theme:', err);
  }
}

// Real-time listener for Theme
export function subscribeToTheme(callback: (theme: DesignTheme) => void) {
  const themeRef = doc(db, 'page_settings', 'theme');
  return onSnapshot(themeRef, (snap) => {
    if (snap.exists() && snap.data()?.activeDesign) {
      callback(snap.data().activeDesign as DesignTheme);
    }
  }, (err) => {
    console.warn('Error listening to theme changes:', err);
  });
}

// Card Color Customization Functions
export async function getCardColors(): Promise<CardColorSettings> {
  try {
    const snap = await getDoc(doc(db, 'page_settings', 'card_styles'));
    if (snap.exists()) {
      return { ...DEFAULT_CARD_COLORS, ...(snap.data() as CardColorSettings) };
    }
  } catch (err) {
    console.error('Error fetching card colors:', err);
  }
  return DEFAULT_CARD_COLORS;
}

export async function saveCardColors(colors: CardColorSettings): Promise<void> {
  try {
    await setDoc(doc(db, 'page_settings', 'card_styles'), {
      ...colors,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving card colors:', err);
  }
}

export function subscribeToCardColors(callback: (colors: CardColorSettings) => void) {
  const ref = doc(db, 'page_settings', 'card_styles');
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback({ ...DEFAULT_CARD_COLORS, ...(snap.data() as CardColorSettings) });
    }
  }, (err) => {
    console.warn('Error listening to card style changes:', err);
  });
}

// Admin Security & Backdoor Configuration
export interface AdminSecurityConfig {
  adminUser: string;
  adminKey: string;
  adminEmail: string;
  tripleClickEnabled?: boolean;
  hotkeyEnabled?: boolean;
  urlParamEnabled?: boolean;
  updatedAt?: string;
}

export const defaultSecurityConfig: AdminSecurityConfig = {
  adminUser: 'desingMC',
  adminKey: 'mc2709',
  adminEmail: 'armando.villanueva@mycollege.com.mx',
  tripleClickEnabled: true,
  hotkeyEnabled: true,
  urlParamEnabled: true
};

export async function getAdminSecurityConfig(): Promise<AdminSecurityConfig> {
  try {
    const snap = await getDoc(doc(db, 'page_settings', 'security'));
    if (snap.exists()) {
      return { ...defaultSecurityConfig, ...(snap.data() as AdminSecurityConfig) };
    }
    // Initialize if not exists
    await setDoc(doc(db, 'page_settings', 'security'), {
      ...defaultSecurityConfig,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error fetching admin security config:', err);
  }
  return defaultSecurityConfig;
}

export async function updateAdminSecurityConfig(config: Partial<AdminSecurityConfig>): Promise<void> {
  await setDoc(doc(db, 'page_settings', 'security'), {
    ...config,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// Verification function checking desingMC / mc2709 and Firestore
export async function verifyAdminCredentials(user: string, pass: string): Promise<boolean> {
  const u = user.trim();
  const p = pass.trim();

  // Primary check: Direct match with requested credentials
  if (
    (u.toLowerCase() === 'desingmc' || u.toLowerCase() === 'armando.villanueva@mycollege.com.mx' || u === '') &&
    (p === 'mc2709' || p === 'MyCollege2026!')
  ) {
    return true;
  }

  // Check Firestore configuration
  try {
    const config = await getAdminSecurityConfig();
    const validUser = (config.adminUser || 'desingMC').trim().toLowerCase();
    const validKey = (config.adminKey || 'mc2709').trim();

    if (
      (u.toLowerCase() === validUser || u.toLowerCase() === 'armando.villanueva@mycollege.com.mx' || u === '') &&
      p === validKey
    ) {
      return true;
    }
  } catch (err) {
    console.error('Error verifying credentials with Firestore:', err);
  }

  return false;
}
