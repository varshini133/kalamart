import React, { useState } from 'react';
import { BRAND_LOGO } from '../data/mockData';
import { Language, ScreenType, User } from '../types';
import { getTranslations } from '../services/localizationService';

interface NavigationHeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenVoice: () => void;
  onOpenCart: () => void;
  onOpenNotifications?: () => void;
  onOpenDemo?: () => void;
  cartCount: number;
  unreadNotificationCount?: number;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  user?: User | null;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenVoice,
  onOpenCart,
  onOpenNotifications,
  onOpenDemo,
  cartCount,
  unreadNotificationCount = 0,
  currentLanguage,
  onLanguageChange,
  user
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = getTranslations(currentLanguage);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'discover':
        return t.navMarketplace;
      case 'guilds':
        return t.navGuilds;
      case 'product-detail':
        return t.screenProductDetail;
      case 'studio':
        return t.navStudio;
      case 'voice-cataloging':
        return t.voiceCatalogingTitle;
      case 'orders':
        return t.navOrders;
      case 'profile':
        return t.navProfile;
      case 'b2b-portal':
        return t.b2bPortal;
      case 'admin-portal':
        return t.adminTrustPortal;
      case 'my-products':
        return t.myProducts;
      case 'product-manage':
        return t.productManagement;
      default:
        return 'KalaMart';
    }
  };

  const isDetailOrSubScreen = 
    currentScreen === 'product-detail' || 
    currentScreen === 'voice-cataloging' || 
    currentScreen === 'b2b-portal' || 
    currentScreen === 'admin-portal' ||
    currentScreen === 'my-products' ||
    currentScreen === 'product-manage';

  const handleBackNavigation = () => {
    if (currentScreen === 'product-manage') {
      onNavigate('my-products');
    } else if (currentScreen === 'my-products' || currentScreen === 'voice-cataloging') {
      onNavigate('studio');
    } else {
      onNavigate(user?.role === 'artisan' ? 'studio' : 'discover');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(42,27,64,0.05)] border-b border-outline-variant/30">
      <div className="h-24 px-4 flex flex-col justify-between pb-2">
        {/* Top Mini Status Bar */}
        <div className="w-full flex items-center justify-between text-on-surface pt-1 px-1">
          <span className="text-[11px] font-bold tracking-tight text-primary">9:41</span>
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[15px] leading-none">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[15px] leading-none">wifi</span>
            <span className="material-symbols-outlined text-[16px] leading-none">battery_full</span>
          </div>
        </div>

        {/* Main Header Action Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Back or Title */}
          <div className="flex items-center gap-1.5 min-w-0">
            {isDetailOrSubScreen ? (
              <button
                onClick={handleBackNavigation}
                aria-label={t.back}
                className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-primary hover:bg-surface-container active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
            ) : null}

            <button
              onClick={() => onNavigate(user?.role === 'artisan' ? 'studio' : 'discover')}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <img
                src={BRAND_LOGO}
                alt="KalaMart Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <div className="flex items-center leading-none">
                  <span className="text-[17px] font-bold font-serif text-primary tracking-tight">
                    Kala
                  </span>
                  <span className="text-[17px] font-extrabold font-sans text-secondary tracking-tight">
                    Mart
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium line-clamp-1 mt-0.5">
                  {getScreenTitle()}
                </span>
              </div>
            </button>
          </div>

          {/* Right actions: Language, Voice, Cart, Profile */}
          <div className="flex items-center gap-1.5">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="h-9 px-2.5 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-primary flex items-center gap-1 text-[11px] font-semibold transition-colors active:scale-95 border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">translate</span>
                <span>
                  {currentLanguage === 'en' ? 'EN' : currentLanguage === 'hi' ? 'हिं' : 'த'}
                </span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 top-11 w-32 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-1 z-50 text-[12px]">
                  <button
                    onClick={() => { onLanguageChange('en'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-surface-container-low ${currentLanguage === 'en' ? 'font-bold text-secondary' : 'text-on-surface'}`}
                  >
                    <span>English</span>
                    {currentLanguage === 'en' && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                  <button
                    onClick={() => { onLanguageChange('hi'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-surface-container-low ${currentLanguage === 'hi' ? 'font-bold text-secondary' : 'text-on-surface'}`}
                  >
                    <span>हिन्दी</span>
                    {currentLanguage === 'hi' && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                  <button
                    onClick={() => { onLanguageChange('ta'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-surface-container-low ${currentLanguage === 'ta' ? 'font-bold text-secondary' : 'text-on-surface'}`}
                  >
                    <span>தமிழ்</span>
                    {currentLanguage === 'ta' && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Voice Assistant Trigger */}
            <button
              onClick={onOpenVoice}
              aria-label="Voice Assistant"
              className="w-9 h-9 rounded-full bg-primary-container text-tertiary-fixed flex items-center justify-center hover:bg-primary shadow-[0_3px_10px_rgba(42,27,64,0.18)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>

            {/* Hackathon Demo Walkthrough Button */}
            {onOpenDemo && (
              <button
                type="button"
                id="header-demo-walkthrough-btn"
                onClick={onOpenDemo}
                aria-label={t.pitchDemo}
                title={t.pitchDemo}
                className="h-9 px-2.5 rounded-full bg-secondary/15 hover:bg-secondary/25 text-secondary flex items-center gap-1 text-[11px] font-extrabold border border-secondary/40 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                <span className="hidden sm:inline">{t.pitchDemo}</span>
              </button>
            )}

            {/* B2B Wholesale Hub Button */}
            <button
              onClick={() => onNavigate('b2b-portal')}
              aria-label={t.b2bPortal}
              title={t.b2bPortal}
              className={`h-9 px-2.5 rounded-full flex items-center gap-1 text-[11px] font-bold transition-all active:scale-95 border ${
                currentScreen === 'b2b-portal'
                  ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                  : 'bg-surface-container-high/80 text-primary border-outline-variant/40 hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">corporate_fare</span>
              <span className="hidden sm:inline">{t.b2b}</span>
            </button>

            {/* Notification Bell Button */}
            {onOpenNotifications && (
              <button
                id="header-notifications-btn"
                onClick={onOpenNotifications}
                aria-label={t.notifications}
                title={t.notifications}
                className="relative w-9 h-9 rounded-full bg-surface-container-high/80 text-primary flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-95 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center shadow animate-pulse">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label={t.viewCart}
              title={t.viewCart}
              className="relative w-9 h-9 rounded-full bg-surface-container-high/80 text-primary flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => onNavigate('profile')}
              aria-label={t.userProfile}
              title={t.userProfile}
              className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm hover:opacity-90 active:scale-95 transition-transform overflow-hidden ring-1 ring-secondary/30"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : user ? (
                <span className="font-bold text-xs">{user.name.charAt(0)}</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
