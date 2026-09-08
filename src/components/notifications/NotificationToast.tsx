import React, { useEffect, useState } from 'react';
import { AppNotification, ScreenType } from '../../types';
import { notificationService } from '../../services/notificationService';

interface NotificationToastProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenCenter: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  onNavigate,
  onOpenCenter
}) => {
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for newly arriving notifications
    const unsubscribe = notificationService.subscribeToNew((notif) => {
      setActiveToast(notif);
      setIsVisible(true);

      // Auto dismiss after 4.5 seconds for non-intrusive experience
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4500);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!activeToast || !isVisible) {
    return null;
  }

  const handleClick = () => {
    notificationService.markAsRead(activeToast.id);
    setIsVisible(false);
    if (activeToast.targetScreen) {
      onNavigate(activeToast.targetScreen);
    } else {
      onOpenCenter();
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  return (
    <aside
      aria-label="Notification alert"
      className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-auto transition-all duration-300 ease-out transform"
    >
      <div
        onClick={handleClick}
        className="flex items-start gap-3 p-3 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl border border-outline-variant/40 shadow-[0_8px_30px_rgba(42,27,64,0.15)] cursor-pointer hover:bg-surface-container-low transition-colors group"
      >
        {/* Icon Pill */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${activeToast.iconColorClass}`}
        >
          <span className="material-symbols-outlined text-[19px]">{activeToast.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-secondary">
              {activeToast.category === 'artisan' ? 'Artisan Notice' : 'Buyer Update'}
            </span>
            <span className="text-[10px] text-on-surface-variant/70">Just now</span>
          </div>

          <h4 className="text-xs font-bold text-primary truncate mt-0.5 group-hover:text-secondary transition-colors">
            {activeToast.title}
          </h4>
          <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
            {activeToast.message}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className="w-6 h-6 -mr-1 -mt-1 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[15px]">close</span>
        </button>
      </div>
    </aside>
  );
};
