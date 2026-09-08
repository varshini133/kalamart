/**
 * KalaConnect - Complete Authentication & User Role Service
 * Supports: Artisan, Buyer, B2B Buyer, Admin roles with session persistence,
 * credential validation, onboarding state tracking, and account management.
 */

import { User, UserRole, Language } from '../types';
import { RAMDEV_PORTRAIT } from '../data/mockData';

export interface StoredAccount extends User {
  passwordHash: string;
  createdAt: string;
}

export interface SignUpFormData {
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  preferredLanguage?: Language;
  location?: string;
  craftSpecialization?: string;
  businessName?: string;
  gstNumber?: string;
}

export interface LoginFormData {
  identifier: string; // Email or phone
  password: string;
  expectedRole?: UserRole;
}

export interface ArtisanOnboardingData {
  fullName?: string;
  avatar?: string;
  phone?: string;
  preferredLanguage?: Language;
  craftSpecialization: string;
  craftCategory: string;
  yearsOfExperience: string;
  location: string;
  specialtyTechnique: string;
  guildName?: string;
  heritageStory?: string;
  storyAudioUrl?: string;
  storyVoiceDuration?: string;
  madeToOrder?: boolean;
  bulkOrdersAccepted?: boolean;
  minBulkQuantity?: number;
  productionTime?: string;
  giCertified?: boolean;
}

const STORAGE_DRAFT_ONBOARDING_KEY = 'kalaconnect_artisan_onboarding_draft';

export const saveArtisanOnboardingDraft = (userId: string, draft: Partial<ArtisanOnboardingData>): void => {
  try {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_DRAFT_ONBOARDING_KEY) || '{}');
    drafts[userId] = {
      ...drafts[userId],
      ...draft,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_DRAFT_ONBOARDING_KEY, JSON.stringify(drafts));
  } catch {}
};

export const getArtisanOnboardingDraft = (userId: string): (Partial<ArtisanOnboardingData> & { savedAt?: string }) | null => {
  try {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_DRAFT_ONBOARDING_KEY) || '{}');
    return drafts[userId] || null;
  } catch {
    return null;
  }
};

export const clearArtisanOnboardingDraft = (userId: string): void => {
  try {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_DRAFT_ONBOARDING_KEY) || '{}');
    delete drafts[userId];
    localStorage.setItem(STORAGE_DRAFT_ONBOARDING_KEY, JSON.stringify(drafts));
  } catch {}
};

const STORAGE_SESSION_KEY = 'kalaconnect_user';
const STORAGE_ROLE_KEY = 'kalaconnect_selected_role';
const STORAGE_ACCOUNTS_KEY = 'kalaconnect_accounts_db';
// Legacy keys fallback
const LEGACY_STORAGE_KEY = 'kalamart_user';

// PRE-SEEDED VERIFIED ACCOUNTS FOR INSTANT TESTING & EVALUATION
const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: 'artisan-seed-1',
    role: 'artisan',
    name: 'Ramdev Kumbhar',
    email: 'artisan@kalaconnect.com',
    phone: '9876543210',
    passwordHash: 'artisan123',
    location: 'Bhuj, Kutch, Gujarat',
    guildName: 'Kumbhar Terracotta Guild • Bhuj',
    craftSpecialization: 'Terracotta Pottery & Indus Clay Vessels',
    giCertified: true,
    hasCompletedOnboarding: true,
    avatar: RAMDEV_PORTRAIT,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'buyer-seed-1',
    role: 'buyer',
    name: 'Priya Sharma',
    email: 'buyer@kalaconnect.com',
    phone: '9123456780',
    passwordHash: 'buyer123',
    location: 'Bangalore, Karnataka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'b2b-seed-1',
    role: 'b2b',
    name: 'Vikram Malhotra',
    email: 'b2b@kalaconnect.com',
    phone: '9811223344',
    passwordHash: 'b2b123',
    location: 'Nariman Point, Mumbai, Maharashtra',
    businessName: 'Heritage Living Crafts Pvt Ltd',
    gstNumber: '27AAACH7409R1ZZ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-02-01T00:00:00.000Z'
  },
  {
    id: 'admin-seed-1',
    role: 'admin',
    name: 'Platform Custodian',
    email: 'admin@kalaconnect.com',
    phone: '9900112233',
    passwordHash: 'admin123',
    location: 'KalaConnect Trust HQ, New Delhi',
    adminRole: 'Senior Trust & GI Verification Custodian',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

// Initialize accounts database
const getAccountsDatabase = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(SEED_ACCOUNTS));
      return SEED_ACCOUNTS;
    }
    const accounts: StoredAccount[] = JSON.parse(raw);
    // Ensure seed accounts exist
    let updated = false;
    for (const seed of SEED_ACCOUNTS) {
      if (!accounts.some(a => a.email === seed.email || a.phone === seed.phone)) {
        accounts.push(seed);
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
    return accounts;
  } catch {
    return SEED_ACCOUNTS;
  }
};

const saveAccountsDatabase = (accounts: StoredAccount[]): void => {
  try {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
};

// ROLE & SESSION STORAGE
export const getSelectedRole = (): UserRole | null => {
  try {
    return (localStorage.getItem(STORAGE_ROLE_KEY) as UserRole) || null;
  } catch {
    return null;
  }
};

export const setSelectedRole = (role: UserRole): void => {
  try {
    localStorage.setItem(STORAGE_ROLE_KEY, role);
  } catch {}
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(user));
    setSelectedRole(user.role);
  } catch {}
};

export const clearUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {}
};

// AUTHENTICATION: LOGIN
export const authenticateUser = async (
  formData: LoginFormData
): Promise<{ user: User; isNewUser: boolean }> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 350));

  const cleanId = formData.identifier.trim().toLowerCase();
  const cleanPhone = formData.identifier.replace(/\D/g, '');
  const accounts = getAccountsDatabase();

  // Find account matching email OR phone
  const account = accounts.find((acc) => {
    const emailMatch = acc.email && acc.email.toLowerCase() === cleanId;
    const phoneMatch = acc.phone && (acc.phone === formData.identifier.trim() || (cleanPhone.length >= 10 && acc.phone.includes(cleanPhone.slice(-10))));
    return emailMatch || phoneMatch;
  });

  if (!account) {
    throw new Error('USER_NOT_FOUND');
  }

  // Password verification
  if (formData.password !== account.passwordHash && account.passwordHash) {
    throw new Error('INVALID_PASSWORD');
  }

  // Sanitize user object (strip passwordHash)
  const { passwordHash: _, ...safeUser } = account;
  saveUser(safeUser);
  setSelectedRole(safeUser.role);

  const needsOnboarding = safeUser.role === 'artisan' && !safeUser.hasCompletedOnboarding;
  return { user: safeUser, isNewUser: needsOnboarding };
};

// AUTHENTICATION: SIGN UP
export const registerNewUser = async (
  formData: SignUpFormData
): Promise<{ user: User; isNewUser: boolean }> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 450));

  const name = formData.fullName.trim();
  if (!name || name.length < 2) {
    throw new Error('INVALID_NAME');
  }

  const cleanEmail = formData.email ? formData.email.trim().toLowerCase() : undefined;
  const cleanPhone = formData.phone ? formData.phone.trim() : undefined;

  if (!cleanEmail && !cleanPhone) {
    throw new Error('EMAIL_OR_PHONE_REQUIRED');
  }

  if (formData.password.length < 6) {
    throw new Error('PASSWORD_TOO_SHORT');
  }

  if (formData.password !== formData.confirmPassword) {
    throw new Error('PASSWORDS_DO_NOT_MATCH');
  }

  const accounts = getAccountsDatabase();

  // Check if account already exists
  const existing = accounts.find((acc) => {
    const emailMatch = cleanEmail && acc.email && acc.email.toLowerCase() === cleanEmail;
    const phoneMatch = cleanPhone && acc.phone && acc.phone === cleanPhone;
    return emailMatch || phoneMatch;
  });

  if (existing) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const isArtisan = formData.role === 'artisan';
  const newId = `${formData.role}-${Date.now()}`;

  const newAccount: StoredAccount = {
    id: newId,
    role: formData.role,
    name: name,
    email: cleanEmail,
    phone: cleanPhone,
    passwordHash: formData.password,
    location: formData.location?.trim() || (isArtisan ? 'Bhuj, Gujarat' : 'Bangalore, Karnataka'),
    guildName: isArtisan ? (formData.craftSpecialization ? `${formData.craftSpecialization} Guild` : 'Master Artisans Guild') : undefined,
    craftSpecialization: formData.craftSpecialization,
    businessName: formData.businessName,
    gstNumber: formData.gstNumber,
    giCertified: isArtisan ? true : undefined,
    hasCompletedOnboarding: isArtisan ? false : true, // Artisans must complete onboarding
    isNewUser: true,
    avatar: isArtisan
      ? RAMDEV_PORTRAIT
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString()
  };

  accounts.push(newAccount);
  saveAccountsDatabase(accounts);

  const { passwordHash: _, ...safeUser } = newAccount;
  saveUser(safeUser);
  setSelectedRole(safeUser.role);

  return { user: safeUser, isNewUser: isArtisan };
};

// GOOGLE AUTHENTICATION (OAUTH FLOW / POPUP SIMULATION)
export const authenticateWithGoogle = async (
  targetRole: UserRole,
  userProvidedEmail?: string,
  userProvidedName?: string
): Promise<{ user: User; isNewUser: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const email = (userProvidedEmail || 'santhanavarshini@gmail.com').toLowerCase();
  const accounts = getAccountsDatabase();

  // Check if this Google user already exists
  const existing = accounts.find((a) => a.email && a.email.toLowerCase() === email);

  if (existing) {
    const { passwordHash: _, ...safeUser } = existing;
    saveUser(safeUser);
    setSelectedRole(safeUser.role);
    const needsOnboarding = safeUser.role === 'artisan' && !safeUser.hasCompletedOnboarding;
    return { user: safeUser, isNewUser: needsOnboarding };
  }

  // Derive display name from email or name
  const name = userProvidedName || (email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
  const isArtisan = targetRole === 'artisan';

  const newAccount: StoredAccount = {
    id: `${targetRole}-g-${Date.now()}`,
    role: targetRole,
    name: name,
    email: email,
    passwordHash: 'google_oauth_authenticated',
    location: isArtisan ? 'Bhuj, Gujarat' : 'Bangalore, Karnataka',
    guildName: isArtisan ? 'All India Artisans Craft Guild' : undefined,
    giCertified: isArtisan,
    hasCompletedOnboarding: isArtisan ? false : true,
    isNewUser: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString()
  };

  accounts.push(newAccount);
  saveAccountsDatabase(accounts);

  const { passwordHash: _, ...safeUser } = newAccount;
  saveUser(safeUser);
  setSelectedRole(safeUser.role);

  return { user: safeUser, isNewUser: isArtisan };
};

// ARTISAN ONBOARDING COMPLETION
export const completeArtisanOnboarding = async (
  userId: string,
  data: ArtisanOnboardingData
): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const accounts = getAccountsDatabase();
  const index = accounts.findIndex((a) => a.id === userId);

  let updatedUser: User;
  if (index !== -1) {
    accounts[index] = {
      ...accounts[index],
      name: data.fullName || accounts[index].name,
      avatar: data.avatar || accounts[index].avatar,
      phone: data.phone || accounts[index].phone,
      preferredLanguage: data.preferredLanguage || accounts[index].preferredLanguage,
      craftSpecialization: data.craftSpecialization,
      craftCategory: data.craftCategory,
      yearsOfExperience: data.yearsOfExperience,
      location: data.location,
      specialtyTechnique: data.specialtyTechnique,
      guildName: data.guildName || (data.craftCategory ? `${data.craftCategory} Artisans Guild` : 'Master Artisans Guild'),
      bio: data.heritageStory,
      storyAudioUrl: data.storyAudioUrl,
      storyVoiceDuration: data.storyVoiceDuration,
      madeToOrder: data.madeToOrder ?? true,
      bulkOrdersAccepted: data.bulkOrdersAccepted ?? true,
      minBulkQuantity: data.minBulkQuantity ?? 25,
      productionTime: data.productionTime ?? '1-2 Weeks',
      giCertified: data.giCertified ?? true,
      hasCompletedOnboarding: true,
      isNewUser: false
    };
    saveAccountsDatabase(accounts);
    const { passwordHash: _, ...safeUser } = accounts[index];
    updatedUser = safeUser;
  } else {
    const current = getStoredUser();
    updatedUser = {
      ...(current || { id: userId, role: 'artisan', name: data.fullName || 'Master Maker' }),
      name: data.fullName || current?.name || 'Master Maker',
      avatar: data.avatar || current?.avatar,
      phone: data.phone || current?.phone,
      preferredLanguage: data.preferredLanguage || current?.preferredLanguage,
      craftSpecialization: data.craftSpecialization,
      craftCategory: data.craftCategory,
      yearsOfExperience: data.yearsOfExperience,
      location: data.location,
      specialtyTechnique: data.specialtyTechnique,
      guildName: data.guildName || (data.craftCategory ? `${data.craftCategory} Artisans Guild` : 'Master Artisans Guild'),
      bio: data.heritageStory,
      storyAudioUrl: data.storyAudioUrl,
      storyVoiceDuration: data.storyVoiceDuration,
      madeToOrder: data.madeToOrder ?? true,
      bulkOrdersAccepted: data.bulkOrdersAccepted ?? true,
      minBulkQuantity: data.minBulkQuantity ?? 25,
      productionTime: data.productionTime ?? '1-2 Weeks',
      giCertified: data.giCertified ?? true,
      hasCompletedOnboarding: true,
      isNewUser: false
    };
  }

  // Clear draft once completed
  clearArtisanOnboardingDraft(userId);

  saveUser(updatedUser);
  return updatedUser;
};

// FORGOT PASSWORD / RESET PASSWORD
export const requestPasswordReset = async (
  identifier: string
): Promise<{ success: boolean; message: string; tempCode: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const cleanId = identifier.trim().toLowerCase();
  const accounts = getAccountsDatabase();
  const account = accounts.find(
    (a) => (a.email && a.email.toLowerCase() === cleanId) || (a.phone && a.phone === identifier.trim())
  );

  if (!account) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  // Generate 6 digit simulated verification code
  const tempCode = '839201';
  return {
    success: true,
    message: `Reset code sent to ${identifier}. For testing, use code: ${tempCode}`,
    tempCode
  };
};

export const resetPasswordWithCode = async (
  identifier: string,
  _code: string,
  newPassword: string
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const cleanId = identifier.trim().toLowerCase();
  const accounts = getAccountsDatabase();
  const index = accounts.findIndex(
    (a) => (a.email && a.email.toLowerCase() === cleanId) || (a.phone && a.phone === identifier.trim())
  );

  if (index === -1) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  if (newPassword.length < 6) {
    throw new Error('PASSWORD_TOO_SHORT');
  }

  accounts[index].passwordHash = newPassword;
  saveAccountsDatabase(accounts);
  return true;
};

// COMPATIBILITY METHODS FOR EXISTING CODEBASE
export const loginArtisan = async (identifier: string, password?: string): Promise<User> => {
  const result = await authenticateUser({
    identifier,
    password: password || 'artisan123',
    expectedRole: 'artisan'
  });
  return result.user;
};

export interface ArtisanSignUpData {
  name: string;
  email?: string;
  phone?: string;
  phoneOrEmail?: string;
  password?: string;
  confirmPassword?: string;
  preferredLanguage: Language;
  location: string;
  craftSpecialization?: string;
  craftCategory?: string;
  guildName?: string;
}

export const registerArtisan = async (data: ArtisanSignUpData): Promise<User> => {
  const emailVal = data.email?.trim() || (data.phoneOrEmail?.includes('@') ? data.phoneOrEmail.trim() : undefined);
  const phoneVal = data.phone?.trim() || (!data.phoneOrEmail?.includes('@') ? data.phoneOrEmail?.trim() : undefined);

  const result = await registerNewUser({
    fullName: data.name,
    email: emailVal,
    phone: phoneVal,
    password: data.password || 'artisan123',
    confirmPassword: data.confirmPassword || data.password || 'artisan123',
    role: 'artisan',
    preferredLanguage: data.preferredLanguage,
    location: data.location,
    craftSpecialization: data.craftSpecialization || data.craftCategory
  });
  return result.user;
};

export const loginBuyer = async (email: string, password?: string): Promise<User> => {
  const result = await authenticateUser({
    identifier: email,
    password: password || 'buyer123',
    expectedRole: 'buyer'
  });
  return result.user;
};

export interface BuyerSignUpData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  preferredLanguage?: Language;
}

export const registerBuyer = async (data: BuyerSignUpData): Promise<User> => {
  const result = await registerNewUser({
    fullName: data.name,
    email: data.email,
    password: data.password || 'buyer123',
    confirmPassword: data.confirmPassword || data.password || 'buyer123',
    role: 'buyer',
    preferredLanguage: data.preferredLanguage
  });
  return result.user;
};

export const getGreetingForUser = (user: User | null, language: Language = 'en'): string => {
  if (!user || !user.name) {
    if (language === 'ta') return 'கலாகனெக்ட்டிற்கு நல்வரவு';
    if (language === 'hi') return 'कलाकनेक्ट में आपका स्वागत है';
    return 'Welcome to KalaConnect';
  }

  const firstName = user.name.split(' ')[0] || user.name;

  if (language === 'ta') {
    return `வணக்கம், ${firstName} 👋`;
  }
  if (language === 'hi') {
    return `नमस्ते, ${firstName} जी 👋`;
  }
  return `Namaste, ${firstName} 👋`;
};
