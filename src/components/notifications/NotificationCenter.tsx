import React, { useState, useEffect } from 'react';
import { AppNotification, AppNotificationType, Language, ScreenType, UserRole } from '../../types';
import { notificationService } from '../../services/notificationService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  language: Language;
  userRole?: UserRole;
  onSelectProduct?: (productId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigate,
  language: _language,
  userRole = 'buyer',
  onSelectProduct: _onSelectProduct
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'artisan' | 'buyer'>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);

  // Synchronize with notificationService
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((list) => {
      setNotifications(list);
    });
    return unsubscribe;
  }, []);

  // Pre-select the tab based on the current user's role on open
  useEffect(() => {
    if (isOpen) {
      if (userRole === 'artisan') {
        setActiveTab('artisan');
      } else if (userRole === 'buyer') {
        setActiveTab('buyer');
      } else {
        setActiveTab('all');
      }
    }
  }, [isOpen, userRole]);

  if (!isOpen) return null;

  // Filter list based on selected tab and unreadOnly toggle
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab !== 'all' && notif.category !== activeTab) {
      return false;
    }
    if (unreadOnly && notif.read) {
      return false;
    }
    return true;
  });

  const totalUnreadCount = notifications.filter((n) => !n.read).length;
  const artisanUnreadCount = notifications.filter((n) => n.category === 'artisan' && !n.read).length;
  const buyerUnreadCount = notifications.filter((n) => n.category === 'buyer' && !n.read).length;

  const handleNotificationClick = (notif: AppNotification) => {
    // 1. Mark as read
    notificationService.markAsRead(notif.id);

    // 2. Navigate if link available
    if (notif.targetScreen) {
      onNavigate(notif.targetScreen);
      onClose();
    }
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(activeTab === 'all' ? undefined : activeTab);
  };

  const handleClearAll = () => {
    notificationService.clearAll(activeTab === 'all' ? undefined : activeTab);
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const handleSimulate = (type: AppNotificationType) => {
    notificationService.simulateEvent(type);
    setShowSimModal(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[88vh] sm:max-h-[82vh] rounded-t-3xl sm:rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 bg-surface-container-low/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-primary font-serif">Notification Center</h2>
                  {totalUnreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold">
                      {totalUnreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Real-time updates for artisan workshops & buyer orders
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Role & Category Filter Tabs */}
          <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-outline-variant/15">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-container-high/60 border border-outline-variant/20 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  activeTab === 'all'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('artisan')}
                className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 ${
                  activeTab === 'artisan'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span>Artisan</span>
                {artisanUnreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-secondary text-on-secondary text-[9px] font-bold flex items-center justify-center">
                    {artisanUnreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('buyer')}
                className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 ${
                  activeTab === 'buyer'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span>Buyer</span>
                {buyerUnreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-secondary text-on-secondary text-[9px] font-bold flex items-center justify-center">
                    {buyerUnreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Unread Only Toggle */}
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                unreadOnly
                  ? 'bg-secondary/15 text-secondary border-secondary/40 font-bold'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {unreadOnly ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span>Unread</span>
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-4 py-2 bg-surface-container-lowest border-b border-outline-variant/15 flex items-center justify-between text-xs">
          <div className="text-on-surface-variant text-[11px]">
            Showing <strong>{filteredNotifications.length}</strong> event{filteredNotifications.length === 1 ? '' : 's'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-primary hover:text-secondary font-bold text-[11px] flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span>Mark all read</span>
            </button>
            <span className="text-outline-variant">|</span>
            <button
              onClick={handleClearAll}
              className="text-on-surface-variant hover:text-rose-600 text-[11px] flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notification List Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-surface-container-high text-outline flex items-center justify-center">
                <span className="material-symbols-outlined text-[30px]">notifications_paused</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary">All caught up!</h3>
                <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                  No {unreadOnly ? 'unread ' : ''}notifications in this category right now.
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                  !notif.read
                    ? 'bg-surface-container-lowest border-secondary/30 shadow-xs hover:border-secondary hover:shadow-md'
                    : 'bg-surface-container/30 border-outline-variant/20 hover:bg-surface-container/60 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon Avatar */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${notif.iconColorClass}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{notif.icon}</span>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 pr-5">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      {/* Role category tag */}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                          notif.category === 'artisan'
                            ? 'bg-amber-100/80 text-amber-900 border border-amber-200'
                            : 'bg-indigo-100/80 text-indigo-900 border border-indigo-200'
                        }`}
                      >
                        {notif.category}
                      </span>

                      <span className="text-[11px] text-on-surface-variant">
                        {formatTimestamp(notif.timestamp)}
                      </span>

                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-secondary inline-block shrink-0 animate-pulse" />
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
                      {notif.title}
                    </h4>

                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Action navigation hint if clickable target exists */}
                    {notif.targetScreen && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-secondary group-hover:underline">
                        <span>{notif.actionLabel || 'View details'}</span>
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Action: Mark Read / Delete */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!notif.read ? (
                      <button
                        onClick={() => notificationService.markAsRead(notif.id)}
                        title="Mark as read"
                        aria-label="Mark as read"
                        className="w-6 h-6 rounded-full bg-surface-container hover:bg-secondary hover:text-on-secondary text-outline flex items-center justify-center transition-colors text-[13px]"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => notificationService.deleteNotification(notif.id)}
                        title="Delete notification"
                        aria-label="Delete notification"
                        className="w-6 h-6 rounded-full hover:bg-rose-100 hover:text-rose-700 text-outline/60 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Prototype Quick-Test Accordion */}
        <div className="p-3 bg-surface-container-low/70 border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSimModal(!showSimModal)}
              className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
              <span>Test Notification Events ({showSimModal ? 'Hide' : 'Quick Trigger'})</span>
            </button>

            <span className="text-[10px] text-on-surface-variant font-medium">
              Click any notification to navigate
            </span>
          </div>

          {/* Prototype Quick Simulator Drawer */}
          {showSimModal && (
            <div className="mt-3 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-primary">Prototype Test Trigger:</span>
                <span className="text-[10px] text-secondary font-bold">Instantly emits realistic event</span>
              </div>

              {/* Artisan Triggers */}
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                  Artisan Events:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleSimulate('artisan_new_order')}
                    className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">shopping_cart</span>
                    <span>New Order</span>
                  </button>
                  <button
                    onClick={() => handleSimulate('artisan_new_inquiry')}
                    className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">chat</span>
                    <span>New Inquiry</span>
                  </button>
                  <button
                    onClick={() => handleSimulate('artisan_product_approved')}
                    className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>Approved</span>
                  </button>
                  <button
                    onClick={() => handleSimulate('artisan_product_rejected')}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">edit_note</span>
                    <span>Rejected</span>
                  </button>
                  <button
                    onClick={() => handleSimulate('artisan_sync_completed')}
                    className="p-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">cloud_done</span>
                    <span>Sync Done</span>
                  </button>
                </div>
              </div>

              {/* Buyer Triggers */}
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                  Buyer Events:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleSimulate('buyer_order_confirmed')}
                    className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Order Confirmed</span>
                  </button>
                  <button
                    onClick={() => handleSimulate('buyer_order_shipped')}
                    className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">local_shipping</span>
                    <span>Order Shipped</span>
                  </button>
                  <button
                    onClick={() => handleSimulate('buyer_order_delivered')}
                    className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">package_2</span>
                    <span>Order Delivered</span>
                  </button>
                  <button
                    onClick={() => handleSimulate('buyer_inquiry_response')}
                    className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold text-left flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">rate_review</span>
                    <span>Inquiry Response</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
