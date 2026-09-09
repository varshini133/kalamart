import React from 'react';
import { Language, SyncStatus } from '../types';
import { getTranslations } from '../services/localizationService';

interface OfflineStatusBarProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  lastSyncStatus: SyncStatus;
  language: Language;
  onOpenSyncQueue?: () => void;
  onOpenDemo?: () => void;
  isSyncing?: boolean;
  syncSuccessMessage?: string | null;
}

export const OfflineStatusBar: React.FC<OfflineStatusBarProps> = ({
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  lastSyncStatus,
  language,
  onOpenSyncQueue,
  onOpenDemo,
  isSyncing = false,
  syncSuccessMessage = null
}) => {
  const t = getTranslations(language);
  const isTa = language === 'ta';
  const isHi = language === 'hi';

  const offlineNotice = t.offlineNotice;

  const pendingNotice = (count: number) => {
    if (isTa) return `${count} மாற்றங்கள் ஒத்திசைக்கக் காத்திருக்கின்றன`;
    if (isHi) return `${count} बदलाव सिंक के लिए प्रतीक्षारत हैं`;
    return `${count} ${count === 1 ? 'change' : 'changes'} waiting to sync`;
  };

  const syncingNotice = t.syncingNotice;
  const syncedNotice = t.syncedNotice;

  return (
    <aside
      aria-label="Offline Sync Status"
      className={`w-full border-b px-3 py-1.5 flex flex-wrap items-center justify-between text-xs z-40 transition-colors ${
        !isOnline
          ? 'bg-amber-500/15 border-amber-500/30 text-amber-950 dark:text-amber-100'
          : isSyncing
          ? 'bg-blue-500/15 border-blue-500/30 text-blue-950 dark:text-blue-100'
          : pendingSyncCount > 0
          ? 'bg-amber-500/10 border-amber-500/25 text-amber-900'
          : 'bg-surface-container-low border-outline-variant/30 text-on-surface'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 py-0.5">
        <span
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            !isOnline
              ? 'bg-amber-600 ring-2 ring-amber-400/40'
              : isSyncing
              ? 'bg-blue-600 animate-ping'
              : pendingSyncCount > 0
              ? 'bg-amber-500 animate-pulse'
              : 'bg-emerald-600 ring-2 ring-emerald-400/40'
          }`}
        />
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-bold text-[11px] sm:text-xs">
            {!isOnline
              ? t.offlineLabel
              : isSyncing
              ? t.syncingLabel
              : t.onlineLabel}
          </span>
          <span className="text-outline-variant">·</span>
          <span className="truncate text-[11px] font-medium">
            {!isOnline
              ? offlineNotice
              : isSyncing
              ? syncingNotice
              : syncSuccessMessage
              ? syncSuccessMessage
              : pendingSyncCount > 0
              ? pendingNotice(pendingSyncCount)
              : syncedNotice}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-auto py-0.5">
        {/* Queue badge button if pending items exist */}
        {onOpenSyncQueue && (
          <button
            type="button"
            id="btn-open-sync-queue"
            onClick={onOpenSyncQueue}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
              pendingSyncCount > 0
                ? 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700 shadow-xs'
                : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
            }`}
            title="Inspect Offline Sync Queue"
          >
            <span className="material-symbols-outlined text-[13px]">sync_alt</span>
            <span>{pendingSyncCount > 0 ? `${pendingSyncCount} ${t.inQueue}` : t.syncQueue}</span>
          </button>
        )}

        {/* Demo Mode Button */}
        {onOpenDemo && (
          <button
            type="button"
            id="btn-offline-demo-mode"
            onClick={onOpenDemo}
            className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-secondary/10 border-secondary/30 text-secondary hover:bg-secondary/20 transition-all flex items-center gap-1 cursor-pointer"
            title="Interactive Offline-to-Online Walkthrough"
          >
            <span className="material-symbols-outlined text-[13px]">play_circle</span>
            <span>{t.demoMode}</span>
          </button>
        )}

        {/* Network Toggle Button */}
        <button
          type="button"
          id="btn-toggle-offline"
          onClick={onToggleOnline}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
            isOnline
              ? 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:bg-surface-container'
              : 'bg-emerald-700 text-white border-emerald-800 hover:bg-emerald-800 shadow-xs'
          }`}
          title="Simulate network connectivity for hackathon demo"
        >
          {isOnline ? t.simulateOffline : t.turnOnlineOn}
        </button>
      </div>
    </aside>
  );
};
