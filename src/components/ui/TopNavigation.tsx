import React from 'react';
import { Language, ScreenType, User } from '../../types';

export interface TopNavigationProps {
  currentScreen: ScreenType;
  user: User | null;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenCart?: () => void;
  cartCount?: number;
  isOnline?: boolean;
  onOpenAudioAssistant?: () => void;
  onLogout?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentScreen,
  user,
  currentLanguage,
  onLanguageChange,
  onNavigate,
  onOpenCart,
  cartCount = 0,
  isOnline = true,
  onOpenAudioAssistant,
  onLogout
}) => {
  // Don't show on initial welcome screen or auth screens
  if (
    currentScreen === 'welcome' ||
    currentScreen === 'artisan-auth' ||
    currentScreen === 'buyer-auth'
  ) {
    return null;
  }

  const getScreenTitle = (): string => {
    switch (currentScreen) {
      case 'discover':
        return currentLanguage === 'ta'
          ? 'கலாமார்ட் சந்தை'
          : currentLanguage === 'hi'
          ? 'कलामार्ट हाट'
          : 'KalaMart Marketplace';
      case 'guilds':
        return currentLanguage === 'ta'
          ? 'பாரம்பரிய கைவினை சங்கங்கள்'
          : currentLanguage === 'hi'
          ? 'शिल्पकार संघ एवं क्लस्टर'
          : 'Heritage Craft Guilds';
      case 'studio':
        return currentLanguage === 'ta'
          ? 'கைவினைஞர் அரங்கம்'
          : currentLanguage === 'hi'
          ? 'कारीगर स्टूडियो'
          : 'Artisan Studio';
      case 'voice-cataloging':
        return currentLanguage === 'ta'
          ? 'குரல் வழிக் பட்டியல்'
          : currentLanguage === 'hi'
          ? 'आवाज से उत्पाद जोड़ें'
          : 'Voice Cataloging Studio';
      case 'orders':
        return currentLanguage === 'ta'
          ? 'ஆர்டர்கள் & கண்காணிப்பு'
          : currentLanguage === 'hi'
          ? 'ऑर्डर एवं ट्रैकिंग'
          : 'Orders & Tracking';
      case 'profile':
        return currentLanguage === 'ta'
          ? 'சுயவிவரம்'
          : currentLanguage === 'hi'
          ? 'प्रोफाइल'
          : 'Profile & Settings';
      case 'b2b-portal':
        return currentLanguage === 'ta'
          ? 'மொத்த வர்த்தக மையம்'
          : currentLanguage === 'hi'
          ? 'थोक एवं निर्यात केंद्र'
          : 'B2B Wholesale Hub';
      case 'admin-portal':
        return currentLanguage === 'ta'
          ? 'சரிபார்ப்பு மையம்'
          : currentLanguage === 'hi'
          ? 'प्रशासक पोर्टल'
          : 'Admin Verification Portal';
      default:
        return 'KalaMart';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 transition-all">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Brand / Title Section */}
        <div className="flex items-center gap-2 min-w-0">
          {currentScreen !== 'discover' && currentScreen !== 'studio' && (
            <button
              type="button"
              onClick={() => onNavigate(user?.role === 'artisan' ? 'studio' : 'discover')}
              className="p-1 -ml-1 rounded-full text-primary hover:bg-surface-container transition-colors"
              title="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          )}

          <div className="truncate">
            <h1 className="font-serif font-bold text-base text-primary truncate leading-tight">
              {getScreenTitle()}
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              <span className="truncate">
                {user?.role === 'artisan' ? 'Master Studio' : 'Direct GI Crafts'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Strict Language Switcher */}
          <div className="flex items-center bg-surface-container rounded-full p-0.5 border border-outline-variant/30">
            {(['en', 'hi', 'ta'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                  currentLanguage === lang
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'த'}
              </button>
            ))}
          </div>

          {/* AI Voice Assistant Trigger */}
          {onOpenAudioAssistant && (
            <button
              type="button"
              onClick={onOpenAudioAssistant}
              className="p-2 rounded-full text-secondary hover:bg-secondary/10 transition-colors"
              title="Voice Assistant"
            >
              <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
            </button>
          )}

          {/* Cart Icon for Buyer */}
          {user?.role !== 'artisan' && onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 rounded-full text-primary hover:bg-surface-container transition-colors"
              title="Shopping Cart"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Logout / Switch Role */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-full text-outline hover:text-error hover:bg-error/10 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
