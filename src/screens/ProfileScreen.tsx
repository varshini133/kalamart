import React from 'react';
import { RAMDEV_PORTRAIT } from '../data/mockData';
import { Language, ScreenType, User } from '../types';
import { getTranslations } from '../services/localizationService';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onShowToast: (msg: string) => void;
  user?: User | null;
  onLogout?: () => void;
  wishlistCount?: number;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  language,
  onLanguageChange,
  onShowToast,
  user,
  onLogout,
  wishlistCount = 0,
  onOpenNotifications,
  unreadNotificationCount = 0
}) => {
  const t = getTranslations(language);
  const isArtisan = user?.role === 'artisan';

  return (
    <div className="flex-1 flex flex-col relative w-full pt-28 pb-24 px-4 max-w-md mx-auto space-y-6 bg-surface">
      {/* User Identity Card */}
      <div className="p-5 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-md space-y-4">
        <div className="flex items-center gap-3.5">
          {isArtisan ? (
            <img
              src={user?.avatar || RAMDEV_PORTRAIT}
              alt={user?.name || 'Master Artisan'}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-secondary/40 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xl ring-2 ring-secondary/30">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-secondary text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">
                {isArtisan ? 'verified' : 'verified_user'}
              </span>
              <span>
                {isArtisan
                  ? t.giCertified
                  : t.verifiedPatron}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-primary truncate leading-tight">
              {user?.name || (isArtisan ? 'Verified Artisan' : 'Art Patron')}
            </h2>
            <p className="text-xs text-on-surface-variant truncate">
              {isArtisan
                ? user?.guildName || 'Master Artisans Guild • India'
                : `${user?.phone ? `+91 ${user.phone}` : (user?.email || 'Authenticated Patron')} • ${user?.location || 'India'}`}
            </p>
          </div>
        </div>

        {/* Lifetime Metrics */}
        {isArtisan ? (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/20">
            <div className="p-2.5 bg-surface-container-low rounded-xl text-center">
              <span className="text-[10px] text-on-surface-variant block">{t.totalEarnings}</span>
              <span className="text-sm font-bold text-primary">₹1,48,200</span>
            </div>
            <div className="p-2.5 bg-surface-container-low rounded-xl text-center">
              <span className="text-[10px] text-on-surface-variant block">{t.productsListed}</span>
              <span className="text-sm font-bold text-primary">184 Pieces</span>
            </div>
            <div className="p-2.5 bg-surface-container-low rounded-xl text-center">
              <span className="text-[10px] text-on-surface-variant block">{t.patronExperiences}</span>
              <span className="text-sm font-bold text-secondary">4.9 ★</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/20">
            <div
              onClick={() => onNavigate('orders')}
              className="p-2.5 bg-surface-container-low rounded-xl text-center cursor-pointer hover:bg-surface-container transition-colors"
            >
              <span className="text-[10px] text-on-surface-variant block">{t.navOrders}</span>
              <span className="text-sm font-bold text-primary">3 Active</span>
            </div>
            <div
              onClick={() => onNavigate('discover')}
              className="p-2.5 bg-surface-container-low rounded-xl text-center cursor-pointer hover:bg-surface-container transition-colors"
            >
              <span className="text-[10px] text-on-surface-variant block">{t.wishlist}</span>
              <span className="text-sm font-bold text-secondary">{wishlistCount} Saved</span>
            </div>
            <div className="p-2.5 bg-surface-container-low rounded-xl text-center">
              <span className="text-[10px] text-on-surface-variant block">{t.directArtisanRoyalty}</span>
              <span className="text-sm font-bold text-primary">₹8,450</span>
            </div>
          </div>
        )}
      </div>

      {/* Direct Remittance / Address Status */}
      {isArtisan ? (
        <div className="space-y-3">
          {/* Artisan Digital Shop & Craft Info */}
          <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-primary">Artisan Digital Shop</h4>
                  <p className="text-[10px] text-on-surface-variant">
                    {user?.craftCategory || 'Handicrafts'} • {user?.location || 'India'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('artisan-onboarding')}
                className="px-2.5 py-1 rounded-xl bg-secondary/15 text-secondary text-xs font-bold hover:bg-secondary/25 transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                <span>Edit Shop</span>
              </button>
            </div>

            {user?.craftSpecialization && (
              <div className="p-2.5 bg-surface-container-low rounded-xl text-xs space-y-1">
                <div className="font-semibold text-primary">{user.craftSpecialization}</div>
                {user.specialtyTechnique && (
                  <div className="text-[11px] text-on-surface-variant">
                    Technique: {user.specialtyTechnique}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-semibold text-secondary">
                  {user.madeToOrder && <span className="bg-secondary/10 px-2 py-0.5 rounded">Made-to-Order</span>}
                  {user.bulkOrdersAccepted && (
                    <span className="bg-secondary/10 px-2 py-0.5 rounded">
                      Bulk MOQ: {user.minBulkQuantity || 25} pcs
                    </span>
                  )}
                  {user.productionTime && (
                    <span className="bg-secondary/10 px-2 py-0.5 rounded">
                      Lead time: {user.productionTime}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-primary">{t.bankAccount}</h4>
                  <p className="text-[10px] text-on-surface-variant">{t.featureZeroCommission}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                {t.activeOrders}
              </span>
            </div>
            <div className="p-2.5 bg-surface-container-low rounded-xl text-xs flex justify-between text-on-surface">
              <span className="text-on-surface-variant">State Bank of India ({user?.location?.split(',')[0] || 'Bhuj'})</span>
              <span className="font-mono font-bold">•••• 9024</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">home_pin</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-primary">{t.primaryDeliveryAddress}</h4>
                <p className="text-[10px] text-on-surface-variant">{t.ecoPackagingNotice}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
              Default
            </span>
          </div>
          <div className="p-2.5 bg-surface-container-low rounded-xl text-xs text-on-surface space-y-0.5">
            <p className="font-semibold text-primary">{user?.name || 'Verified Patron'}</p>
            <p className="text-on-surface-variant">#402, Heritage Residency, Indiranagar</p>
            <p className="text-on-surface-variant">{user?.location || 'Bangalore, Karnataka'} - 560038</p>
          </div>
        </div>
      )}

      {/* App Language Preferences */}
      <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-primary">
          {t.selectLanguage}
        </h4>
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिन्दी' },
            { id: 'ta', label: 'தமிழ்' }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                onLanguageChange(lang.id as any);
                onShowToast(t.toastLanguageChanged);
              }}
              className={`p-3 rounded-xl border text-center transition-all active:scale-95 ${
                language === lang.id
                  ? 'bg-secondary text-on-secondary border-secondary shadow-sm font-bold'
                  : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Center Access Card */}
      {onOpenNotifications && (
        <div
          id="profile-notification-center-card"
          onClick={onOpenNotifications}
          className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm hover:border-secondary transition-all cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-primary">Notification Center</h4>
                {unreadNotificationCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold">
                    {unreadNotificationCount} unread
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-semibold">
                    All caught up
                  </span>
                )}
              </div>
              <p className="text-[10px] text-on-surface-variant mt-0.5">
                {isArtisan
                  ? 'Orders, buyer inquiries, GI approvals, and cloud sync alerts'
                  : 'Order updates, shipment tracking alerts, and artisan responses'}
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary group-hover:translate-x-0.5 transition-transform">
            chevron_right
          </span>
        </div>
      )}

      {/* B2B Wholesale & Bulk Sourcing Portal Card */}
      <div
        onClick={() => onNavigate('b2b-portal')}
        className="p-4 bg-surface-container-lowest rounded-2xl border border-secondary/35 shadow-sm hover:border-secondary transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs text-primary">B2B Wholesale & Bulk Sourcing Hub</h4>
              <span className="px-1.5 py-0.2 rounded bg-secondary/10 text-secondary text-[9px] font-bold">B2B Mode</span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              {isArtisan
                ? 'Manage bulk RFQs, institutional buyers, volume quotations & export catalog'
                : 'Direct bulk sourcing for hotels, retailers, corporate gifting & institutions'}
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[18px] text-secondary group-hover:translate-x-0.5 transition-transform">
          chevron_right
        </span>
      </div>

      {/* KalaMart Admin Custodian Dashboard Card */}
      <div
        id="profile-admin-dashboard-card"
        onClick={() => onNavigate('admin-portal')}
        className="p-4 bg-surface-container-lowest rounded-2xl border border-stone-800/20 shadow-sm hover:border-stone-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs text-primary">KalaMart Admin Dashboard</h4>
              <span className="px-1.5 py-0.2 rounded bg-stone-900 text-amber-300 text-[9px] font-bold">
                {user?.role === 'admin' ? 'Active Admin' : 'Admin Only'}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              Product quality reviews, artisan trust verification, user directory & order monitoring
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[18px] text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-transform">
          chevron_right
        </span>
      </div>

      {/* Support Section */}
      <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px]">support_agent</span>
            <span className="font-bold text-primary">
              {isArtisan ? t.supportArtisanGuild : t.supportPatronConcierge}
            </span>
          </div>
          <span className="text-secondary font-bold">1800-420-KALA</span>
        </div>
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          {isArtisan
            ? t.supportArtisanDescription
            : t.supportPatronDescription}
        </p>
      </div>

      {/* Actions: Switch mode or Logout */}
      <div className="pt-2 space-y-2">
        <button
          onClick={() => {
            if (isArtisan) {
              onNavigate('discover');
            } else {
              onNavigate('studio');
            }
          }}
          className="w-full py-3 rounded-full bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-container active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          <span>
            {isArtisan ? t.switchToBuyerMarketplace : t.switchToArtisanStudio}
          </span>
        </button>

        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              onNavigate('welcome');
            }
          }}
          className="w-full py-3 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-secondary font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>{t.logOut}</span>
        </button>
      </div>
    </div>
  );
};
