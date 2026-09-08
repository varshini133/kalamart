import React from 'react';
import { WELCOME_HERO_IMG } from '../data/mockData';
import { Language, ScreenType, User, UserRole } from '../types';
import { setSelectedRole } from '../services/authService';
import { getTranslations } from '../services/localizationService';
import { TrustBadge } from '../components/ui/TrustBadge';
import { KalaMartLogo } from '../components/KalaMartLogo';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onShowToast: (msg: string) => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onOpenDemo?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigate,
  language,
  onLanguageChange,
  onShowToast,
  currentUser,
  onLogout,
  onOpenDemo
}) => {
  const t = getTranslations(language);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);

    // If user is already authenticated with this role, enter dashboard directly
    if (currentUser && currentUser.role === role) {
      if (role === 'artisan') {
        if (!currentUser.hasCompletedOnboarding) {
          onNavigate('artisan-onboarding');
        } else {
          onNavigate('studio');
        }
      } else if (role === 'buyer') {
        onNavigate('discover');
      } else if (role === 'b2b') {
        onNavigate('b2b-portal');
      } else if (role === 'admin') {
        onNavigate('admin-portal');
      }
      return;
    }

    if (role === 'artisan') {
      onShowToast(
        language === 'ta'
          ? 'கைவினைஞர் உள்நுழைவுப் பக்கத்திற்குச் செல்கிறது...'
          : language === 'hi'
          ? 'कारीगर लॉगिन पृष्ठ पर ले जाया जा रहा है...'
          : 'Routing to Artisan Login / Signup...'
      );
      onNavigate('artisan-auth');
    } else if (role === 'buyer') {
      onShowToast(
        language === 'ta'
          ? 'வாங்குபவர் உள்நுழைவுப் பக்கத்திற்குச் செல்கிறது...'
          : language === 'hi'
          ? 'खरीदार लॉगिन पृष्ठ पर ले जाया जा रहा है...'
          : 'Routing to Buyer Login / Signup...'
      );
      onNavigate('buyer-auth');
    } else {
      onNavigate('auth');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full px-4 pt-3 pb-12 max-w-md mx-auto animate-fadeIn bg-surface">
      {/* Top Bar: Language Selector & Secure Badge */}
      <header className="flex items-center justify-between gap-2 py-2 mb-2">
        <div className="flex items-center bg-surface-container rounded-full p-1 border border-outline-variant/30 shadow-xs">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              language === 'en'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              language === 'hi'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('ta')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              language === 'ta'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            தமிழ்
          </button>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-secondary font-bold">
          <span className="material-symbols-outlined text-[15px]">lock</span>
          <span>{t.securePortal}</span>
        </div>
      </header>

      {/* Brand Identity & Logo Area */}
      <div className="flex flex-col items-center justify-center py-2 space-y-1">
        <KalaMartLogo size="lg" subtitle={t.tagline} />
      </div>

      {/* Active Session Card if User is Logged In */}
      {currentUser && (
        <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-bold text-secondary">
                Active Session • {currentUser.role}
              </div>
              <div className="text-xs font-bold text-primary truncate">
                {currentUser.name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (currentUser.role === 'artisan') {
                  onNavigate(currentUser.hasCompletedOnboarding ? 'studio' : 'artisan-onboarding');
                } else if (currentUser.role === 'buyer') {
                  onNavigate('discover');
                } else if (currentUser.role === 'b2b') {
                  onNavigate('b2b-portal');
                } else if (currentUser.role === 'admin') {
                  onNavigate('admin-portal');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-primary-container cursor-pointer"
            >
              Enter Dashboard
            </button>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-xl bg-surface-container text-on-surface-variant hover:text-red-600 cursor-pointer"
                title="Log Out"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero Visual Showcase */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-surface-container-lowest shadow-sm mt-2 mb-4 border border-outline-variant/30">
        <div className="relative h-52 w-full">
          <img
            className="w-full h-full object-cover"
            src={WELCOME_HERO_IMG}
            alt="Traditional Indian pottery artisan crafting clay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* GI Certified Tag */}
          <div className="absolute top-3 left-3">
            <TrustBadge type="gi-certified" size="sm" />
          </div>

          {/* Headline & Short Explanation */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h1 className="font-serif text-xl font-bold leading-tight drop-shadow-xs">
              {t.welcomeHeroTitle}
            </h1>
            <p className="text-[11px] text-stone-200 mt-1 leading-snug line-clamp-2">
              {language === 'ta'
                ? 'பாரம்பரிய கைவினைஞர்களை நவீன டிஜிட்டல் வாங்குபவர்களுடன் குரல் வழியில் நேரடியாக இணைக்கும் தளம்.'
                : language === 'hi'
                ? 'आवाज-आधारित डिजिटल कैटलॉग से पारंपरिक कारीगरों को सीधे बाज़ार से जोड़ने वाला मंच।'
                : 'Offline-first, voice-first digital marketplace empowering master artisans and connecting conscious buyers directly.'}
            </p>
          </div>
        </div>
      </section>

      {/* Hackathon Demo Flow Highlight Banner */}
      {onOpenDemo && (
        <section className="mb-4 p-4 rounded-3xl bg-gradient-to-r from-secondary/15 via-primary/10 to-secondary/10 border border-secondary/35 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
                <span className="material-symbols-outlined text-[15px]">bolt</span>
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary">
                National Hackathon Showcase
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[9px] font-black">
              3–5 Min Pitch
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-bold font-serif text-primary">
              Core End-to-End Architectural Flow:
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-primary/80 overflow-x-auto pb-1 no-scrollbar flex-wrap">
              <span className="px-2 py-0.5 rounded-lg bg-surface-container-high font-bold text-primary">1. Voice</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-lg bg-surface-container-high font-bold text-primary">2. AI</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-lg bg-surface-container-high font-bold text-primary">3. Professional Catalog</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-lg bg-surface-container-high font-bold text-primary">4. Offline Sync</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-lg bg-surface-container-high font-bold text-primary">5. Premium Marketplace</span>
            </div>
          </div>

          <button
            type="button"
            id="welcome-launch-pitch-btn"
            onClick={onOpenDemo}
            className="mt-3 w-full py-2.5 rounded-2xl bg-secondary text-on-secondary font-bold text-xs shadow-xs hover:bg-secondary/90 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            <span>Launch Interactive Presentation Walkthrough</span>
          </button>
        </section>
      )}

      {/* Role Selection Section: "Who are you?" */}
      <section className="space-y-3">
        <div className="text-center space-y-0.5 mb-1">
          <span className="px-3 py-0.5 rounded-full bg-surface-container text-secondary text-[10px] font-bold uppercase tracking-wider inline-block">
            {t.welcomeWhoAreYou}
          </span>
          <h2 className="font-serif text-lg font-bold text-primary">
            {t.welcomeChooseExperience}
          </h2>
          <p className="text-xs text-on-surface-variant">
            {t.welcomeChooseSubtitle}
          </p>
        </div>

        {/* CTA 1: I AM AN ARTISAN (Routes to artisan-auth) */}
        <button
          id="btn-role-artisan"
          type="button"
          onClick={() => handleSelectRole('artisan')}
          className="group text-left relative block w-full rounded-3xl bg-primary text-on-primary p-4 sm:p-5 shadow-md active:scale-[0.98] transition-all border border-secondary/30 hover:border-secondary cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold shadow-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px]">mic</span>
              {t.artisanBadge}
            </span>
            <span className="text-[11px] text-primary-fixed-dim font-bold">
              {t.artisanAction}
            </span>
          </div>

          <div className="flex items-start gap-3 mt-1">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-secondary-fixed-dim border border-white/15 shadow-xs">
              <span className="material-symbols-outlined text-[26px]">mic</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold font-sans text-white leading-tight">
                {t.artisanRoleTitle}
              </h3>
              <p className="text-xs text-primary-fixed-dim mt-1 leading-relaxed">
                {t.artisanRoleDesc}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white self-center">
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </button>

        {/* CTA 2: I AM A BUYER (Routes to buyer-auth) */}
        <button
          id="btn-role-buyer"
          type="button"
          onClick={() => handleSelectRole('buyer')}
          className="group text-left relative block w-full rounded-3xl bg-surface-container-lowest text-primary p-4 sm:p-5 shadow-xs active:scale-[0.98] transition-all border border-outline-variant/40 hover:border-secondary cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px]">storefront</span>
              {t.buyerBadge}
            </span>
            <span className="text-[11px] text-outline font-bold">
              {t.buyerAction}
            </span>
          </div>

          <div className="flex items-start gap-3 mt-1">
            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center shrink-0 text-secondary border border-outline-variant/30 shadow-xs">
              <span className="material-symbols-outlined text-[26px]">shopping_bag</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold font-sans text-primary leading-tight">
                {t.buyerRoleTitle}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                {t.buyerRoleDesc}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary self-center">
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </button>

        {/* Secondary Access: B2B Wholesale & Admin Portal */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="btn-role-b2b"
            type="button"
            onClick={() => handleSelectRole('b2b')}
            className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-left hover:border-secondary transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-secondary text-xs font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
              <span>B2B Wholesale</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-snug">
              {language === 'ta'
                ? 'மொத்த ஆர்டர்கள் மற்றும் ஏற்றுமதி விலைப்புள்ளி'
                : language === 'hi'
                ? 'थोक ऑर्डर एवं न्यूनतम मात्रा (MOQ)'
                : 'Bulk orders, RFQ quotations & MOQ'}
            </p>
          </button>

          <button
            id="btn-role-admin"
            type="button"
            onClick={() => handleSelectRole('admin')}
            className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-left hover:border-secondary transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Admin Trust</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-snug">
              {language === 'ta'
                ? 'தயாரிப்பு ஒப்புதல் மற்றும் கைவினைஞர் சரிபார்ப்பு'
                : language === 'hi'
                ? 'उत्पाद समीक्षा एवं जीआई प्रमाणन'
                : 'Verify crafts, approve listings & badges'}
            </p>
          </button>
        </div>
      </section>

      {/* Trust Credentials Strip */}
      <footer className="mt-6 pt-2">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center p-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
            </div>
            <span className="text-xs text-on-surface font-bold">{t.featureZeroCommission}</span>
            <span className="text-[10px] text-on-surface-variant leading-tight mt-0.5">87% Direct</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <span className="text-xs text-on-surface font-bold">{t.featureAuthenticGi}</span>
            <span className="text-[10px] text-on-surface-variant leading-tight mt-0.5">{t.giCertified}</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-surface-container text-secondary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </div>
            <span className="text-xs text-on-surface font-bold">{t.featureVoiceCataloging}</span>
            <span className="text-[10px] text-on-surface-variant leading-tight mt-0.5">AI Voice Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
