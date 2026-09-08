import React, { useState, useEffect } from 'react';
import { RAMDEV_PORTRAIT, ORDERS, PRODUCTS } from '../data/mockData';
import { ScreenType, User, Product, Language, ProductDraft } from '../types';
import { getArtisanStats } from '../services/insightsService';
import { getTranslations } from '../services/localizationService';
import { IntelligentPricingAssistant } from '../components/IntelligentPricingAssistant';
import { OfflineSyncModal } from '../components/OfflineSyncModal';
import { OfflineDemoModal } from '../components/OfflineDemoModal';
import { offlineSyncService } from '../services/offlineSyncService';
import { notificationService } from '../services/notificationService';

interface StudioScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (msg: string) => void;
  onOpenVoice?: () => void;
  onOpenNotifications?: () => void;
  user?: User | null;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  language?: Language;
}

export const StudioScreen: React.FC<StudioScreenProps> = ({
  onNavigate,
  onShowToast,
  onOpenVoice,
  onOpenNotifications,
  user,
  products = PRODUCTS,
  onSelectProduct,
  language = 'en'
}) => {
  const t = getTranslations(language);

  // Dynamic Products Inventory
  const [myProductsList, setMyProductsList] = useState<Product[]>(() => {
    return products.slice(0, 5);
  });

  // Offline Sync State
  const [isOnline, setIsOnline] = useState<boolean>(() => offlineSyncService.isOnline());
  const [pendingCount, setPendingCount] = useState<number>(() => offlineSyncService.getPendingCount());
  const [savedDrafts, setSavedDrafts] = useState<ProductDraft[]>(() => offlineSyncService.getOfflineDrafts());
  const [artisanUnreadCount, setArtisanUnreadCount] = useState<number>(() => notificationService.getUnreadCount('artisan'));

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(() => {
      setArtisanUnreadCount(notificationService.getUnreadCount('artisan'));
    });
    return unsubscribe;
  }, []);

  // Interactive Modals State
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [pricingProduct, setPricingProduct] = useState<Product | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState<boolean>(false);
  const [isUnderReviewModalOpen, setIsUnderReviewModalOpen] = useState<boolean>(false);
  const [isEarningsModalOpen, setIsEarningsModalOpen] = useState<boolean>(false);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState<boolean>(false);
  const [isViewsModalOpen, setIsViewsModalOpen] = useState<boolean>(false);

  // Active product filter
  const [productFilter, setProductFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    const unsubscribe = offlineSyncService.subscribe((event) => {
      if (event.type === 'network-change') {
        setIsOnline(event.payload.isOnline);
      } else if (event.type === 'queue-updated') {
        setPendingCount(event.payload.pendingCount);
      } else if (event.type === 'sync-completed') {
        setPendingCount(offlineSyncService.getPendingCount());
        setSavedDrafts(offlineSyncService.getOfflineDrafts());
      } else if (event.type === 'draft-saved') {
        setSavedDrafts(offlineSyncService.getOfflineDrafts());
      }
    });
    return () => unsubscribe();
  }, []);

  const stats = getArtisanStats('monthly');

  // Real user name extraction
  const realName = (() => {
    if (user?.name && user.name.trim()) {
      const parts = user.name.trim().split(' ');
      return parts[0];
    }
    return 'Varshini';
  })();

  // Time of Day Greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      if (language === 'ta') return `காலை வணக்கம், ${realName}`;
      if (language === 'hi') return `शुभ प्रभात, ${realName}`;
      return `Good morning, ${realName}`;
    }
    if (hour < 17) {
      if (language === 'ta') return `மதிய வணக்கம், ${realName}`;
      if (language === 'hi') return `शुभ दोपहर, ${realName}`;
      return `Good afternoon, ${realName}`;
    }
    if (language === 'ta') return `மாலை வணக்கம், ${realName}`;
    if (language === 'hi') return `शुभ संध्या, ${realName}`;
    return `Good evening, ${realName}`;
  };

  const getEncouragingSubtitle = () => {
    if (language === 'ta') return 'உங்கள் கைவினைப் பொருளை உலகத்துடன் பகிரத் தயாரா?';
    if (language === 'hi') return 'क्या आप अपनी कला को दुनिया के साथ साझा करने के लिए तैयार हैं?';
    return 'Ready to share your craft with the world?';
  };

  const displayAvatar = user?.avatar || RAMDEV_PORTRAIT;
  const displayGuild = user?.guildName || (language === 'ta' ? 'பாரம்பரிய கைவினைஞர் சங்கம்' : language === 'hi' ? 'पारंपरिक शिल्पकार गिल्ड' : 'Terracotta Pottery Guild • Bhuj');

  const publishedCount = myProductsList.filter((p) => p.syncStatus !== 'saved_local').length || 4;
  const draftsCount = Math.max(savedDrafts.length, 1);
  const underReviewCount = 1;

  // Handle Product Actions
  const handleDeleteProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMyProductsList((prev) => prev.filter((p) => p.id !== productId));
    onShowToast(language === 'ta' ? 'பொருள் நீக்கப்பட்டது.' : language === 'hi' ? 'उत्पाद सूची से हटा दिया गया।' : 'Product removed from active listings.');
  };

  const handleShareProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.href);
    onShowToast(language === 'ta' ? 'பொருளின் இணைப்பு நகலெடுக்கப்பட்டது!' : language === 'hi' ? 'उत्पाद लिंक कॉपी हो गया!' : 'Shop link copied! Share with your customers.');
  };

  const handleStartCreateProduct = () => {
    if (onOpenVoice) {
      onOpenVoice();
    } else {
      onNavigate('voice-cataloging');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-28 pb-28 px-4 max-w-md mx-auto space-y-6 animate-fadeIn bg-surface">
      {/* ========================================================================= */}
      {/* TOP SECTION: Encouraging Greeting & Identity                             */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-container to-surface-container-highest text-on-primary p-5 shadow-xl border border-secondary/20">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={displayAvatar}
                alt={realName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-secondary/60 shadow-md bg-surface-container"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 text-secondary-fixed text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                <span>Verified Artisan</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-surface-bright truncate leading-tight mt-0.5">
                {getTimeGreeting()}
              </h1>
              <p className="text-xs text-primary-fixed-dim truncate">
                {displayGuild}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenNotifications && (
              <button
                type="button"
                id="studio-notifications-btn"
                onClick={onOpenNotifications}
                className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
                title="Artisan Notifications"
                aria-label="Artisan Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {artisanUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center shadow">
                    {artisanUnreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
              title="View Profile & Settings"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
            </button>
          </div>
        </div>

        {/* Subtitle Message */}
        <div className="mt-3.5 pt-3 border-t border-white/10 relative z-10 flex items-center gap-2 text-white/90">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">volunteer_activism</span>
          <p className="text-xs sm:text-sm font-medium leading-snug">
            "{getEncouragingSubtitle()}"
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRIMARY ACTION: Large "+ Create New Product" Button                       */}
      {/* ========================================================================= */}
      <section>
        <button
          type="button"
          id="btn-create-new-product-primary"
          onClick={handleStartCreateProduct}
          className="w-full min-h-[58px] py-4 px-5 rounded-2xl bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-on-secondary font-bold shadow-lg flex items-center justify-between gap-3 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-surface-bright/20 flex items-center justify-center shrink-0 group-hover:rotate-90 transition-transform">
              <span className="material-symbols-outlined text-[24px]">add</span>
            </div>
            <div className="text-left min-w-0">
              <span className="block text-base sm:text-lg font-bold truncate leading-tight">
                + Create New Product
              </span>
              <span className="block text-[11px] text-on-secondary/80 font-normal truncate mt-0.5">
                Take photo or speak in Hindi, Tamil or English
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-bright/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </div>
        </button>
      </section>

      {/* ========================================================================= */}
      {/* 5. SYNC STATUS (Display when offline changes exist)                      */}
      {/* ========================================================================= */}
      {(!isOnline || pendingCount > 0) && (
        <section className="animate-fadeIn">
          <div className="p-4 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 shadow-sm flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">
                  {!isOnline ? 'wifi_off' : 'cloud_sync'}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                    {!isOnline ? 'Offline Mode Active' : 'Changes Waiting to Sync'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-900 text-[10px] font-extrabold uppercase">
                    Saved Locally
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed mt-1">
                  {!isOnline
                    ? "You're offline. Your work is safely saved on this device. It will automatically upload when internet connects."
                    : `${pendingCount} change${pendingCount > 1 ? 's' : ''} saved locally. Ready to synchronize with the marketplace.`}
                </p>

                {/* Quick actions for sync */}
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => setIsSyncModalOpen(true)}
                    className="px-3 py-1 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                    <span>View Sync Queue ({pendingCount})</span>
                  </button>
                  {isOnline && (
                    <button
                      type="button"
                      onClick={() => {
                        offlineSyncService.syncNow();
                        onShowToast('Synchronizing offline changes...');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-amber-900 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Sync Now</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 1. QUICK ACTIONS: Simple, Large, Visual Touch Cards                      */}
      {/* ========================================================================= */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">touch_app</span>
            <span>Quick Actions</span>
          </h2>
          <span className="text-[10px] text-on-surface-variant">Tap to open</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Action 1: Create Product */}
          <button
            type="button"
            id="quick-action-create"
            onClick={handleStartCreateProduct}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary transition-all active:scale-95 shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">add_circle</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-primary leading-tight">Create Product</span>
              <span className="block text-[10px] text-on-surface-variant mt-0.5">Voice & Photo</span>
            </div>
          </button>

          {/* Action 2: My Products */}
          <button
            type="button"
            id="quick-action-products"
            onClick={() => onNavigate('my-products')}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary transition-all active:scale-95 shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-primary leading-tight">My Products</span>
              <span className="block text-[10px] text-on-surface-variant mt-0.5">{myProductsList.length} Active</span>
            </div>
          </button>

          {/* Action 3: Orders */}
          <button
            type="button"
            id="quick-action-orders"
            onClick={() => onNavigate('orders')}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary transition-all active:scale-95 shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-700 dark:text-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-primary leading-tight">Orders</span>
              <span className="block text-[10px] text-on-surface-variant mt-0.5">{ORDERS.length} Orders</span>
            </div>
          </button>

          {/* Action 4: Earnings */}
          <button
            type="button"
            id="quick-action-earnings"
            onClick={() => setIsEarningsModalOpen(true)}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary transition-all active:scale-95 shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-primary leading-tight">Earnings</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">₹18,450</span>
            </div>
          </button>
        </div>

        {/* B2B Wholesale & Bulk Orders Hub Card for Artisans */}
        <div
          onClick={() => onNavigate('b2b-portal')}
          className="p-4 rounded-3xl bg-surface-container-lowest border border-secondary/35 shadow-sm hover:border-secondary transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-primary">B2B Wholesale & Bulk Orders Hub</h4>
                <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-bold">Active</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Review wholesale RFQs, issue quotes to hotels & retailers, track batch production & export catalog.
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PRODUCT STATUS: Visual Cards (Draft, Under Review, Published)          */}
      {/* ========================================================================= */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">dashboard_customize</span>
            <span>Product Status</span>
          </h2>
          <span className="text-[10px] text-on-surface-variant">Click to view items</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Draft */}
          <button
            type="button"
            id="status-card-draft"
            onClick={() => setIsDraftsModalOpen(true)}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all text-left shadow-sm active:scale-95 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
              </div>
              <span className="text-xl font-bold font-serif text-amber-800 dark:text-amber-200">
                {draftsCount}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xs text-primary leading-tight">Draft</h3>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Saved on phone</p>
            </div>
          </button>

          {/* Card 2: Under Review */}
          <button
            type="button"
            id="status-card-under-review"
            onClick={() => setIsUnderReviewModalOpen(true)}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-blue-500/60 hover:bg-blue-500/5 transition-all text-left shadow-sm active:scale-95 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
              </div>
              <span className="text-xl font-bold font-serif text-blue-800 dark:text-blue-200">
                {underReviewCount}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xs text-primary leading-tight">Under Review</h3>
              <p className="text-[10px] text-on-surface-variant mt-0.5">GI verification</p>
            </div>
          </button>

          {/* Card 3: Published */}
          <button
            type="button"
            id="status-card-published"
            onClick={() => {
              setProductFilter('published');
              const el = document.getElementById('my-products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all text-left shadow-sm active:scale-95 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
              <span className="text-xl font-bold font-serif text-emerald-800 dark:text-emerald-200">
                {publishedCount}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xs text-primary leading-tight">Published</h3>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Live in shop</p>
            </div>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. AI ASSISTANT CARD: Encouraging, Natural Voice First Helper             */}
      {/* ========================================================================= */}
      <section>
        <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-br from-secondary/15 via-surface-container-lowest to-secondary/5 border-2 border-secondary/30 shadow-sm relative overflow-hidden space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 text-secondary text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <span>Artisan AI Assistant</span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-primary leading-snug">
                Need help creating a product listing?
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Just speak in Hindi, Tamil, or English. Our AI writes the craft description, calculates a fair price, and enhances your photos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              id="btn-ai-speak-create"
              onClick={handleStartCreateProduct}
              className="py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">mic</span>
              <span>Speak to Create</span>
            </button>

            <button
              type="button"
              id="btn-ai-calc-price"
              onClick={() => {
                setPricingProduct(null);
                setIsPricingModalOpen(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">price_change</span>
              <span>Calculate Price</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PERFORMANCE SNAPSHOT: Simple, Readable Numbers (No Complex Charts)    */}
      {/* ========================================================================= */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">insights</span>
              <span>Performance Snapshot</span>
            </h2>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
            0% Commission Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Product Views */}
          <button
            type="button"
            id="snapshot-views"
            onClick={() => setIsViewsModalOpen(true)}
            className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/50 transition-all text-left shadow-xs cursor-pointer active:scale-95"
          >
            <div className="flex items-center justify-between mb-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-secondary">visibility</span>
              <span className="text-[10px] font-bold text-secondary">+28%</span>
            </div>
            <div className="font-serif text-lg sm:text-xl font-bold text-primary">
              1,420
            </div>
            <span className="block text-[10px] text-on-surface-variant font-medium mt-0.5">
              Product Views
            </span>
          </button>

          {/* 2. Inquiries */}
          <button
            type="button"
            id="snapshot-inquiries"
            onClick={() => setIsInquiriesModalOpen(true)}
            className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/50 transition-all text-left shadow-xs cursor-pointer active:scale-95 relative"
          >
            <div className="flex items-center justify-between mb-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-blue-600">chat</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-700 text-[9px] font-bold">
                3 new
              </span>
            </div>
            <div className="font-serif text-lg sm:text-xl font-bold text-primary">
              18
            </div>
            <span className="block text-[10px] text-on-surface-variant font-medium mt-0.5">
              Inquiries
            </span>
          </button>

          {/* 3. Orders */}
          <button
            type="button"
            id="snapshot-orders"
            onClick={() => onNavigate('orders')}
            className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/50 transition-all text-left shadow-xs cursor-pointer active:scale-95"
          >
            <div className="flex items-center justify-between mb-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">shopping_bag</span>
              <span className="text-[10px] font-bold text-emerald-700">Active</span>
            </div>
            <div className="font-serif text-lg sm:text-xl font-bold text-primary">
              {stats.ordersCount || 24}
            </div>
            <span className="block text-[10px] text-on-surface-variant font-medium mt-0.5">
              Orders
            </span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RECENT ORDERS: Visual List with Status Pills & Quick Track             */}
      {/* ========================================================================= */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">local_shipping</span>
            <span>Recent Orders</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All ({ORDERS.length})</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {ORDERS.slice(0, 3).map((order) => (
            <div
              key={order.id}
              onClick={() => onNavigate('orders')}
              className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex items-center gap-3 shadow-xs hover:border-secondary transition-all cursor-pointer group"
            >
              <img
                src={order.image}
                alt={order.productName}
                className="w-14 h-14 rounded-xl object-cover shrink-0 bg-surface-container border border-outline-variant/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                    {order.orderNumber}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">{order.timeAgo}</span>
                </div>
                <h4 className="font-bold text-xs text-primary truncate mt-0.5 group-hover:text-secondary transition-colors">
                  {order.productName}
                </h4>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-on-surface-variant truncate">{order.buyerName}</span>
                  <span className="font-bold text-primary font-serif">₹{order.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('orders');
                }}
                className="px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-bold text-[11px] hover:bg-secondary-container transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Track
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MY PRODUCTS MANAGEMENT: Filterable Catalog Cards                          */}
      {/* ========================================================================= */}
      <section id="my-products-section" className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
              <span>My Products</span>
            </h2>
            <p className="text-[11px] text-on-surface-variant">Live in your craft store</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-manage-all-products"
              onClick={() => onNavigate('my-products')}
              className="text-xs font-bold text-secondary flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>Manage All</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={handleStartCreateProduct}
              className="px-2.5 py-1 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setProductFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              productFilter === 'all'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All ({myProductsList.length})
          </button>
          <button
            type="button"
            onClick={() => setProductFilter('published')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              productFilter === 'published'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Live Shop ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setIsDraftsModalOpen(true)}
            className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 dark:text-amber-200 hover:bg-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>Drafts ({draftsCount})</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-3">
          {myProductsList.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                if (onSelectProduct) {
                  onSelectProduct(prod);
                  onNavigate('product-detail');
                }
              }}
              className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs space-y-2.5 cursor-pointer hover:border-secondary transition-all"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="w-16 h-16 rounded-xl object-cover bg-surface-container shrink-0 border border-outline-variant/20"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      Live
                    </span>
                    <span className="font-bold text-primary text-xs font-serif">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-primary truncate mt-0.5">
                    {prod.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-on-surface-variant mt-1">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">visibility</span>
                      <span>420 views</span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">shopping_bag</span>
                      <span>14 sold</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-secondary font-bold">
                      <span className="material-symbols-outlined text-[12px]">inventory</span>
                      <span>In Stock</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectProduct) {
                      onSelectProduct(prod);
                      onNavigate('product-detail');
                    }
                  }}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('voice-cataloging');
                  }}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPricingProduct(prod);
                    setIsPricingModalOpen(true);
                  }}
                  className="py-1.5 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Calculate Intelligent Price"
                >
                  <span className="material-symbols-outlined text-[14px]">price_change</span>
                  <span>Price</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShareProduct(prod, e)}
                  className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors cursor-pointer"
                  title="Share craft"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDeleteProduct(prod.id, e)}
                  className="w-8 h-8 rounded-xl bg-surface-container hover:bg-rose-500/10 text-on-surface-variant hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Delete craft"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: SAVED DRAFTS MODAL                                               */}
      {/* ========================================================================= */}
      {isDraftsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[24px]">draft</span>
                <div>
                  <h3 className="font-bold text-sm text-primary">Saved Product Drafts</h3>
                  <p className="text-[10px] text-on-surface-variant">Stored safely on this phone</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDraftsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {savedDrafts.length === 0 ? (
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-[24px]">edit_note</span>
                  </div>
                  <h4 className="font-bold text-xs text-primary">Kumbhar Urli Ceramic Draft</h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Ready to complete: Voice recording & photo added.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDraftsModalOpen(false);
                      onNavigate('voice-cataloging');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold w-full cursor-pointer"
                  >
                    Resume Editing
                  </button>
                </div>
              ) : (
                savedDrafts.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between gap-3 shadow-xs"
                  >
                    {d.images?.[0] && (
                      <img
                        src={d.images[0]}
                        alt={d.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-outline-variant/20"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-primary truncate">{d.title}</h4>
                      <div className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-secondary">₹{d.price}</span>
                        <span>•</span>
                        <span>{d.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDraftsModalOpen(false);
                          onNavigate('voice-cataloging');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-90 cursor-pointer"
                      >
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          offlineSyncService.deleteOfflineDraft(d.id);
                          setSavedDrafts(offlineSyncService.getOfflineDrafts());
                          onShowToast('Draft deleted.');
                        }}
                        className="p-1.5 text-on-surface-variant hover:text-rose-600 rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDraftsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UNDER REVIEW STATUS MODAL                                        */}
      {/* ========================================================================= */}
      {isUnderReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[24px]">verified_user</span>
                <div>
                  <h3 className="font-bold text-sm text-primary">GI Verification Review</h3>
                  <p className="text-[10px] text-on-surface-variant">Government GI Heritage Registry Check</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUnderReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs leading-relaxed text-on-surface-variant">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>1 Craft Under Verification</span>
                </div>
                <p className="text-[11px]">
                  <strong>Terracotta Temple Incense Burner</strong> is being reviewed by the Kutch Claycraft Artisan Cooperative.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-primary">Verification Checklist:</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    <span>100% Handcrafted Raw Clay Sourcing (Passed)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    <span>Master Maker Artisan Identification (Verified)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="material-symbols-outlined text-[16px] text-blue-600 animate-spin">sync</span>
                    <span>GI Heritage Tag Registry Match (In Progress - ~4 hrs)</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant/90">
                Once certified, your product gets the golden GI badge and appears in featured collections for international buyers.
              </p>
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setIsUnderReviewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EARNINGS & DIRECT PAYOUT LEDGER MODAL                            */}
      {/* ========================================================================= */}
      {isEarningsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                <div>
                  <h3 className="font-bold text-sm">Artisan Earnings & Payouts</h3>
                  <p className="text-[10px] text-white/80">Direct to your bank account • 0% Platform Cut</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEarningsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3.5 overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold block">
                  Total Disbursed This Month
                </span>
                <span className="font-serif text-3xl font-bold text-emerald-800 dark:text-emerald-200 block my-1">
                  ₹18,450
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  ✓ 100% credited to State Bank of India (A/C: **** 4821)
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-primary">Recent Transfers:</h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-primary block">Terracotta Urli Set</span>
                      <span className="text-[10px] text-on-surface-variant">Order #KM-8092 • Sep 4</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 block">+ ₹1,200</span>
                      <span className="text-[9px] text-on-surface-variant">Settled</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-primary block">Indus Clay Water Jar</span>
                      <span className="text-[10px] text-on-surface-variant">Order #KM-8011 • Sep 1</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 block">+ ₹2,600</span>
                      <span className="text-[9px] text-on-surface-variant">Settled</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container text-[11px] text-on-surface-variant leading-relaxed">
                KalaConnect charges <strong>zero commission</strong> on artisan direct retail orders. 100% of buyer payments go directly into your linked bank account.
              </div>
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onShowToast('Downloading official payout statement...');
                }}
                className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download Statement</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEarningsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: INQUIRIES & BUYER QUESTIONS MODAL                                */}
      {/* ========================================================================= */}
      {isInquiriesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[24px]">chat</span>
                <div>
                  <h3 className="font-bold text-sm text-primary">Buyer Inquiries</h3>
                  <p className="text-[10px] text-on-surface-variant">Direct messages from craft buyers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInquiriesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-primary">Priya Sharma • Bangalore</span>
                  <span className="text-[10px] text-blue-600 font-bold">New</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  "Hello Ramdev ji, can you make this Terracotta Urli in a larger 14-inch diameter for our temple courtyard?"
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onShowToast('Quick reply sent: "Yes, custom 14-inch size is available!"')}
                    className="px-2.5 py-1 rounded-xl bg-primary text-on-primary text-[10px] font-bold cursor-pointer"
                  >
                    Reply: Yes, Available (₹1,600)
                  </button>
                  <button
                    type="button"
                    onClick={() => onShowToast('Quick reply sent: "Requires 4 days to fire."')}
                    className="px-2.5 py-1 rounded-xl bg-surface-container text-primary text-[10px] font-bold cursor-pointer"
                  >
                    Reply: Needs 4 days
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-primary">Vikramaditya • Kolkata</span>
                  <span className="text-[10px] text-on-surface-variant">Yesterday</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  "Is the clay pot safe for drinking water storage naturally without artificial glaze?"
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onShowToast('Quick reply sent: "100% organic natural pit-fired Indus clay."')}
                    className="px-2.5 py-1 rounded-xl bg-primary text-on-primary text-[10px] font-bold cursor-pointer"
                  >
                    Reply: 100% Natural Organic
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setIsInquiriesModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: PRODUCT VIEWS SNAPSHOT MODAL                                     */}
      {/* ========================================================================= */}
      {isViewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">visibility</span>
                <div>
                  <h3 className="font-bold text-sm text-primary">Top Viewed Crafts</h3>
                  <p className="text-[10px] text-on-surface-variant">1,420 total views this month</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsViewsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-2.5 overflow-y-auto">
              {myProductsList.slice(0, 3).map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 bg-surface-container"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-primary truncate">{p.title}</h4>
                    <span className="text-[10px] text-on-surface-variant">
                      {idx === 0 ? '640 views (Trending)' : idx === 1 ? '480 views' : '300 views'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-secondary">
                    ₹{p.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setIsViewsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: INTELLIGENT PRICING ASSISTANT MODAL                              */}
      {/* ========================================================================= */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-2xl my-auto">
            <IntelligentPricingAssistant
              initialMaterialCost={pricingProduct ? Math.round(pricingProduct.price * 0.35) : 380}
              initialLaborHours={pricingProduct ? 8 : 6}
              initialHourlyRate={150}
              initialPackagingCost={60}
              initialShippingCost={90}
              initialSelectedPrice={pricingProduct ? pricingProduct.price : undefined}
              category={pricingProduct?.category || 'Pottery & Ceramics'}
              craftType={pricingProduct?.craftOrigin || 'Wheel Throwing & Natural Firing'}
              productionTimeText={pricingProduct ? '1 to 2 days' : '6 hours'}
              giCertified={pricingProduct?.giCertified ?? true}
              language={language === 'ta' || language === 'hi' ? language : 'en'}
              onSavePrice={(finalPrice) => {
                if (pricingProduct) {
                  setMyProductsList((prev) =>
                    prev.map((p) => (p.id === pricingProduct.id ? { ...p, price: finalPrice } : p))
                  );
                  onShowToast(
                    language === 'ta'
                      ? `விற்பனை விலை ₹${finalPrice} ஆக புதுப்பிக்கப்பட்டது!`
                      : language === 'hi'
                      ? `विक्रय मूल्य ₹${finalPrice} अद्यतित किया गया!`
                      : `Product price updated to ₹${finalPrice}!`
                  );
                } else {
                  onShowToast(
                    language === 'ta'
                      ? `விற்பனை விலை ₹${finalPrice} கணக்கிடப்பட்டது.`
                      : language === 'hi'
                      ? `मूल्य ₹${finalPrice} परिकलित किया गया।`
                      : `Price calculated: ₹${finalPrice}`
                  );
                }
                setIsPricingModalOpen(false);
              }}
              onClose={() => setIsPricingModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: OFFLINE SYNC QUEUE DASHBOARD MODAL                               */}
      {/* ========================================================================= */}
      <OfflineSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onShowToast={onShowToast}
        language={language}
      />

      {/* ========================================================================= */}
      {/* MODAL 8: OFFLINE DEMO WALKTHROUGH MODAL                                   */}
      {/* ========================================================================= */}
      <OfflineDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
