import React from 'react';
import { Language, ScreenType, UserRole } from '../types';

interface BottomNavBarProps {
  currentScreen: ScreenType;
  role?: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onOpenCart?: () => void;
  cartCount?: number;
  activeOrdersCount?: number;
  currentLanguage: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  role = 'buyer',
  onNavigate,
  onOpenCart,
  cartCount = 0,
  activeOrdersCount = 2,
  currentLanguage
}) => {
  // Hide on welcome screen or dedicated auth/onboarding screens
  if (
    currentScreen === 'welcome' ||
    currentScreen === 'auth' ||
    currentScreen === 'artisan-auth' ||
    currentScreen === 'buyer-auth' ||
    currentScreen === 'artisan-onboarding'
  ) {
    return null;
  }

  const isArtisan = role === 'artisan';

  // ARTISAN LABELS
  const artisanLabels = {
    en: { home: 'Home', products: 'Products', create: 'Create Product', orders: 'Orders', profile: 'Profile' },
    hi: { home: 'होम', products: 'उत्पाद', create: 'नया उत्पाद', orders: 'ऑर्डर', profile: 'प्रोफाइल' },
    ta: { home: 'முகப்பு', products: 'பொருட்கள்', create: 'புதிய பொருள்', orders: 'ஆர்டர்கள்', profile: 'சுயவிவரம்' }
  }[currentLanguage] || { home: 'Home', products: 'Products', create: 'Create Product', orders: 'Orders', profile: 'Profile' };

  // BUYER LABELS
  const buyerLabels = {
    en: { home: 'Home', explore: 'Explore', cart: 'Cart', orders: 'Orders', profile: 'Profile' },
    hi: { home: 'होम', explore: 'खोजें', cart: 'कार्ट', orders: 'ऑर्डर', profile: 'प्रोफाइल' },
    ta: { home: 'முகப்பு', explore: 'ஆராய்க', cart: 'கூடை', orders: 'ஆர்டர்கள்', profile: 'சுயவிவரம்' }
  }[currentLanguage] || { home: 'Home', explore: 'Explore', cart: 'Cart', orders: 'Orders', profile: 'Profile' };

  if (isArtisan) {
    return (
      <nav
        id="artisan-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-4px_24px_rgba(28,25,23,0.08)]"
      >
        <div className="h-16 max-w-md mx-auto px-2 flex items-center justify-around">
          {/* 1. Home (Studio Overview) */}
          <button
            id="artisan-nav-home"
            type="button"
            onClick={() => onNavigate('studio')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 cursor-pointer ${
              currentScreen === 'studio'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{artisanLabels.home}</span>
          </button>

          {/* 2. Products (Catalog) */}
          <button
            id="artisan-nav-products"
            type="button"
            onClick={() => onNavigate('my-products')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 cursor-pointer ${
              currentScreen === 'my-products' || currentScreen === 'product-manage'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{artisanLabels.products}</span>
          </button>

          {/* 3. Create Product (Center Voice Hub) */}
          <button
            id="artisan-nav-create"
            type="button"
            onClick={() => onNavigate('voice-cataloging')}
            className="flex flex-col items-center justify-center min-w-[60px] min-h-[48px] -mt-5 group cursor-pointer"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-on-primary shadow-[0_8px_20px_rgba(138,37,16,0.35)] ring-4 ring-surface transition-transform group-active:scale-95 ${
                currentScreen === 'voice-cataloging'
                  ? 'bg-secondary ring-secondary/30 scale-105'
                  : 'bg-primary hover:bg-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[28px]">mic</span>
            </div>
            <span
              className={`text-[10px] mt-1 font-bold ${
                currentScreen === 'voice-cataloging' ? 'text-secondary' : 'text-primary'
              }`}
            >
              {artisanLabels.create}
            </span>
          </button>

          {/* 4. Orders */}
          <button
            id="artisan-nav-orders"
            type="button"
            onClick={() => onNavigate('orders')}
            className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 cursor-pointer ${
              currentScreen === 'orders'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{artisanLabels.orders}</span>
            {activeOrdersCount > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* 5. Profile */}
          <button
            id="artisan-nav-profile"
            type="button"
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 cursor-pointer ${
              currentScreen === 'profile'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{artisanLabels.profile}</span>
          </button>
        </div>
      </nav>
    );
  }

  // BUYER NAVIGATION
  return (
    <nav
      id="buyer-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-4px_24px_rgba(28,25,23,0.08)]"
    >
      <div className="h-16 max-w-md mx-auto px-2 flex items-center justify-around">
        {/* 1. Home */}
        <button
          id="buyer-nav-home"
          type="button"
          onClick={() => onNavigate('discover')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 cursor-pointer ${
            currentScreen === 'discover' || currentScreen === 'product-detail'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">{buyerLabels.home}</span>
        </button>

        {/* 2. Explore */}
        <button
          id="buyer-nav-explore"
          type="button"
          onClick={() => onNavigate('guilds')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 cursor-pointer ${
            currentScreen === 'guilds'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">explore</span>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">{buyerLabels.explore}</span>
        </button>

        {/* 3. Cart */}
        <button
          id="buyer-nav-cart"
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 text-on-surface-variant hover:text-primary cursor-pointer"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">{buyerLabels.cart}</span>
        </button>

        {/* 4. Orders */}
        <button
          id="buyer-nav-orders"
          type="button"
          onClick={() => onNavigate('orders')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 cursor-pointer ${
            currentScreen === 'orders'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">{buyerLabels.orders}</span>
          {activeOrdersCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
              {activeOrdersCount}
            </span>
          )}
        </button>

        {/* 5. Profile */}
        <button
          id="buyer-nav-profile"
          type="button"
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] transition-all active:scale-95 cursor-pointer ${
            currentScreen === 'profile'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">{buyerLabels.profile}</span>
        </button>
      </div>
    </nav>
  );
};
