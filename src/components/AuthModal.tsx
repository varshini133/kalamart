import React, { useState, useEffect } from 'react';
import { User, UserRole, Language } from '../types';
import { RAMDEV_PORTRAIT } from '../data/mockData';
import { registerArtisan, registerBuyer } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onLoginSuccess: (user: User) => void;
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'buyer',
  onLoginSuccess,
  onShowToast
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Artisan Form State
  const [artisanName, setArtisanName] = useState('');
  const [artisanContact, setArtisanContact] = useState('');
  const [artisanPassword, setArtisanPassword] = useState('');
  const [artisanLanguage, setArtisanLanguage] = useState<Language>('hi');
  const [artisanLocation, setArtisanLocation] = useState('Bhuj, Gujarat');
  const [artisanCraftCategory, setArtisanCraftCategory] = useState('Earthen Terracotta & Pottery');

  // Buyer Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  if (!isOpen) return null;

  // 1-Click Instant Demo Login
  const handleQuickDemoLogin = (demoRole: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (demoRole === 'artisan') {
        const artisanUser: User = {
          id: 'artisan-ramdev-1',
          role: 'artisan',
          name: 'Ramdev Kumbhar',
          phone: '9876543210',
          location: 'Bhuj, Gujarat',
          guildName: 'Bhuj Terracotta Guild',
          giCertified: true,
          avatar: RAMDEV_PORTRAIT
        };
        onLoginSuccess(artisanUser);
        onShowToast('Welcome back, Ramdev Ji! Entered Artisan Studio.');
      } else {
        const buyerUser: User = {
          id: 'buyer-priya-1',
          role: 'buyer',
          name: 'Priya Sharma',
          phone: '9820012345',
          email: 'priya.sharma@heritage.in',
          location: 'Bangalore 560001',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        };
        onLoginSuccess(buyerUser);
        onShowToast('Welcome to KalaMart, Priya! Entered Marketplace.');
      }
      onClose();
    }, 400);
  };

  // Submit Artisan Form
  const handleArtisanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisanName.trim()) {
      onShowToast('Please enter your full name');
      return;
    }
    if (!artisanContact.trim()) {
      onShowToast('Please enter mobile number or email');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await registerArtisan({
        name: artisanName,
        phoneOrEmail: artisanContact,
        password: artisanPassword,
        preferredLanguage: artisanLanguage,
        location: artisanLocation,
        craftCategory: artisanCraftCategory
      });
      onLoginSuccess(user);
      onShowToast(`Namaste, ${user.name}! Your Artisan Studio is ready.`);
      onClose();
    } catch {
      onShowToast('Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Buyer Form
  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      onShowToast('Please enter your name');
      return;
    }
    if (!buyerEmail.trim()) {
      onShowToast('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await registerBuyer({
        name: buyerName,
        email: buyerEmail,
        password: buyerPassword
      });
      onLoginSuccess(user);
      onShowToast(`Welcome to KalaMart, ${user.name}!`);
      onClose();
    } catch {
      onShowToast('Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-sm max-h-[90vh] flex flex-col bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 overflow-hidden animate-scaleUp">
        {/* Header Bar */}
        <div className="p-4 bg-primary text-on-primary flex items-center justify-between relative overflow-hidden flex-shrink-0">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary/20 rounded-full blur-lg pointer-events-none"></div>
          <div className="flex items-center gap-2 relative z-10">
            <span className="material-symbols-outlined text-[22px] text-secondary">
              {role === 'artisan' ? 'palette' : 'storefront'}
            </span>
            <div>
              <h3 className="font-display font-bold text-base text-surface-bright leading-tight">
                {role === 'artisan' ? 'Artisan Studio' : 'Buyer Marketplace'}
              </h3>
              <p className="text-[10px] text-primary-fixed-dim">
                {authMode === 'signup' ? 'Create new verified account' : 'Sign in to continue'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-primary-container/80 text-on-primary flex items-center justify-center hover:bg-primary-container relative z-10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-container rounded-2xl border border-outline-variant/30 text-xs font-bold">
            <button
              onClick={() => setRole('buyer')}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                role === 'buyer'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
              <span>Buyer / खरीदार</span>
            </button>
            <button
              onClick={() => setRole('artisan')}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                role === 'artisan'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">palette</span>
              <span>Artisan / कारीगर</span>
            </button>
          </div>

          {/* 1-Click Instant Demo Access Strip */}
          <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-on-surface">
              <span className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Instant Demo Access</span>
              </span>
              <span className="text-[10px] text-outline">1-Click Test</span>
            </div>

            {role === 'artisan' ? (
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('artisan')}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between text-left hover:border-secondary transition-all active:scale-98 group"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={RAMDEV_PORTRAIT}
                    alt="Ramdev Ji"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-secondary"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-primary group-hover:text-secondary leading-tight">
                      Ramdev Kumbhar (Master Potter)
                    </h5>
                    <p className="text-[10px] text-on-surface-variant">Bhuj Terracotta Guild • GI Certified</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-[18px]">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer')}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between text-left hover:border-secondary transition-all active:scale-98 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs">
                    PS
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-primary group-hover:text-secondary leading-tight">
                      Priya Sharma (Art Patron)
                    </h5>
                    <p className="text-[10px] text-on-surface-variant">Bangalore • 4 Past Orders</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-[18px]">arrow_forward</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-outline uppercase font-bold tracking-wider justify-center">
            <div className="h-px flex-1 bg-outline-variant/30"></div>
            <span>Or Enter Your Custom Details</span>
            <div className="h-px flex-1 bg-outline-variant/30"></div>
          </div>

          {/* Signup vs Login Mode Toggle */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`font-bold pb-1 border-b-2 transition-colors ${
                authMode === 'signup'
                  ? 'text-primary border-primary'
                  : 'text-outline border-transparent'
              }`}
            >
              Sign Up (पंजीकरण)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`font-bold pb-1 border-b-2 transition-colors ${
                authMode === 'login'
                  ? 'text-primary border-primary'
                  : 'text-outline border-transparent'
              }`}
            >
              Log In (लॉग इन)
            </button>
          </div>

          {/* Form: ARTISAN SPECIFIC */}
          {role === 'artisan' && (
            <form onSubmit={handleArtisanSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Artisan Full Name (कारीगर का पूरा नाम)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muruganandam Velu or Anita Devi"
                  value={artisanName}
                  onChange={(e) => setArtisanName(e.target.value)}
                  className="w-full bg-surface-container-low text-xs font-semibold text-primary px-3 py-2.5 rounded-xl border border-outline-variant/40 outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Phone or Email (फ़ोन या ईमेल)
                </label>
                <input
                  type="text"
                  required
                  placeholder="98765 43210 or artisan@craft.in"
                  value={artisanContact}
                  onChange={(e) => setArtisanContact(e.target.value)}
                  className="w-full bg-surface-container-low text-xs font-semibold text-primary px-3 py-2.5 rounded-xl border border-outline-variant/40 outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Password (पासवर्ड)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={artisanPassword}
                  onChange={(e) => setArtisanPassword(e.target.value)}
                  className="w-full bg-surface-container-low text-xs font-semibold text-primary px-3 py-2.5 rounded-xl border border-outline-variant/40 outline-none focus:border-secondary"
                />
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-on-surface block mb-1">
                        Preferred Language
                      </label>
                      <select
                        value={artisanLanguage}
                        onChange={(e) => setArtisanLanguage(e.target.value as Language)}
                        className="w-full bg-surface-container-low text-xs font-medium text-primary px-2 py-2 rounded-xl border border-outline-variant/40 outline-none"
                      >
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="gu">ગુજરાતી (Gujarati)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-on-surface block mb-1">
                        Location (स्थान)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Thanjavur, TN"
                        value={artisanLocation}
                        onChange={(e) => setArtisanLocation(e.target.value)}
                        className="w-full bg-surface-container-low text-xs font-medium text-primary px-2 py-2 rounded-xl border border-outline-variant/40 outline-none"
                      >
                      </input>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-on-surface block mb-1">
                      Craft Category (शिल्प श्रेणी)
                    </label>
                    <select
                      value={artisanCraftCategory}
                      onChange={(e) => setArtisanCraftCategory(e.target.value)}
                      className="w-full bg-surface-container-low text-xs font-medium text-primary px-3 py-2 rounded-xl border border-outline-variant/40 outline-none"
                    >
                      <option value="Earthen Terracotta & Pottery">Earthen Terracotta & Pottery (मिट्टी के बर्तन)</option>
                      <option value="Handloom & Khadi Textiles">Handloom & Khadi Textiles (हथकरघा वस्त्र)</option>
                      <option value="Bronze & Bell Metal Casting">Bronze & Bell Metal Casting (धातु शिल्प)</option>
                      <option value="Wood Carving & Turned Lacquerware">Wood Carving & Toys (काष्ठ कला एवं खिलौने)</option>
                      <option value="Folk Art & Heritage Painting">Folk Art & Painting (पारंपरिक चित्रकला)</option>
                      <option value="Jewelry & Tribal Silver">Jewelry & Tribal Silver (पारंपरिक आभूषण)</option>
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all hover:bg-primary-container disabled:opacity-60 mt-2"
              >
                <span>{authMode === 'signup' ? 'Complete Artisan Registration' : 'Log In to Studio'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </form>
          )}

          {/* Form: BUYER SPECIFIC */}
          {role === 'buyer' && (
            <form onSubmit={handleBuyerSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Full Name (पूरा नाम)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-surface-container-low text-xs font-semibold text-primary px-3 py-2.5 rounded-xl border border-outline-variant/40 outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Email Address (ईमेल)
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full bg-surface-container-low text-xs font-semibold text-primary px-3 py-2.5 rounded-xl border border-outline-variant/40 outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface block mb-1">
                  Password (पासवर्ड)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={buyerPassword}
                  onChange={(e) => setBuyerPassword(e.target.value)}
                  className="w-full bg-surface-container-low text-xs font-semibold text-primary px-3 py-2.5 rounded-xl border border-outline-variant/40 outline-none focus:border-secondary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all hover:bg-secondary-container disabled:opacity-60 mt-2"
              >
                <span>{authMode === 'signup' ? 'Start Exploring Marketplace' : 'Log In to Account'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
