import React, { useState, useEffect } from 'react';
import { OfflineSyncItem, Language } from '../types';
import { offlineSyncService } from '../services/offlineSyncService';
import { getTranslations } from '../services/localizationService';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onRunDemo?: () => void;
  onShowToast: (msg: string) => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  isOpen,
  onClose,
  language,
  onRunDemo,
  onShowToast
}) => {
  const t = getTranslations(language);
  const [queue, setQueue] = useState<OfflineSyncItem[]>(() => offlineSyncService.getSyncQueue());
  const [isOnline, setIsOnline] = useState<boolean>(() => offlineSyncService.isOnline());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    const refresh = () => {
      setQueue(offlineSyncService.getSyncQueue());
      setIsOnline(offlineSyncService.isOnline());
    };

    refresh();
    const unsubscribe = offlineSyncService.subscribe((event) => {
      if (event.type === 'queue-updated' || event.type === 'sync-progress') {
        setQueue(offlineSyncService.getSyncQueue());
      } else if (event.type === 'sync-started') {
        setIsSyncing(true);
      } else if (event.type === 'sync-completed' || event.type === 'sync-failed') {
        setIsSyncing(false);
        setQueue(offlineSyncService.getSyncQueue());
      } else if (event.type === 'network-change') {
        setIsOnline(event.payload.isOnline);
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const pendingItems = queue.filter(
    (item) => item.status === 'saved_local' || item.status === 'waiting_to_sync' || item.status === 'syncing'
  );
  const failedItems = queue.filter((item) => item.status === 'sync_failed');
  const syncedItems = queue.filter((item) => item.status === 'synced');

  const handleSyncNow = async () => {
    if (!isOnline) {
      onShowToast("You're offline. Please turn online mode ON to synchronize.");
      return;
    }
    setIsSyncing(true);
    const res = await offlineSyncService.syncNow();
    setIsSyncing(false);
    if (res.success && res.syncedCount > 0) {
      onShowToast(`All changes synced successfully. (${res.syncedCount} items)`);
    } else if (res.failedCount > 0) {
      onShowToast(`${res.failedCount} items encountered sync issues. Please retry.`);
    } else {
      onShowToast('Sync queue is already up to date.');
    }
  };

  const handleRetryFailed = () => {
    offlineSyncService.retryFailedItems();
    onShowToast('Retrying failed items...');
  };

  const handleClearSynced = () => {
    offlineSyncService.clearSyncedItems();
    setQueue(offlineSyncService.getSyncQueue());
    onShowToast('Cleared completed items from queue.');
  };

  const handleDeleteItem = (id: string) => {
    offlineSyncService.removeSyncItem(id);
    setQueue(offlineSyncService.getSyncQueue());
    onShowToast('Item removed from sync queue.');
  };

  const getStatusBadge = (status: OfflineSyncItem['status']) => {
    switch (status) {
      case 'saved_local':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
            <span className="material-symbols-outlined text-[13px]">save</span>
            <span>Saved locally</span>
          </span>
        );
      case 'waiting_to_sync':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-800 border border-blue-500/30">
            <span className="material-symbols-outlined text-[13px]">schedule</span>
            <span>Waiting to sync</span>
          </span>
        );
      case 'syncing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white animate-pulse">
            <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
            <span>Syncing</span>
          </span>
        );
      case 'synced':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            <span>Successfully synced</span>
          </span>
        );
      case 'sync_failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-800 border border-rose-500/30">
            <span className="material-symbols-outlined text-[13px]">error</span>
            <span>Sync failed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
              isOnline ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {isOnline ? 'cloud_sync' : 'cloud_off'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-primary">{t.offlineSyncQueue}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isOnline ? 'bg-emerald-500/15 text-emerald-800' : 'bg-amber-500/15 text-amber-800'
                }`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {pendingItems.length === 0
                  ? t.allChangesSynced
                  : `${pendingItems.length} changes waiting to sync`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Offline Banner if Offline */}
        {!isOnline && (
          <div className="px-4 py-2.5 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-950 dark:text-amber-100">
              <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">wifi_off</span>
              <span>{t.offlineNoticeDetail}</span>
            </div>
            <button
              type="button"
              onClick={() => offlineSyncService.setSimulatedOffline(false)}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shrink-0 transition-colors"
            >
              Turn Online ON
            </button>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="p-3 bg-surface-container-lowest border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              id="btn-trigger-sync-now"
              onClick={handleSyncNow}
              disabled={isSyncing || pendingItems.length === 0 || !isOnline}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                isOnline && pendingItems.length > 0 && !isSyncing
                  ? 'bg-primary text-on-primary hover:opacity-90 cursor-pointer active:scale-95'
                  : 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncing ? 'Syncing...' : t.syncNow}</span>
            </button>

            {failedItems.length > 0 && (
              <button
                type="button"
                onClick={handleRetryFailed}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-800 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">replay</span>
                <span>{t.retryFailed} ({failedItems.length})</span>
              </button>
            )}

            {syncedItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearSynced}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-all"
              >
                {t.clearSynced} ({syncedItems.length})
              </button>
            )}
          </div>

          {onRunDemo && (
            <button
              type="button"
              id="btn-queue-run-demo"
              onClick={() => {
                onClose();
                onRunDemo();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary/25 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              <span>{t.runDemoMode}</span>
            </button>
          )}
        </div>

        {/* Queue Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {queue.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto text-on-surface-variant">
                <span className="material-symbols-outlined text-[28px]">done_all</span>
              </div>
              <h4 className="font-bold text-sm text-primary">All changes synced successfully.</h4>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Any crafts created or edited while offline will appear here and sync automatically when internet returns.
              </p>
              {onRunDemo && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRunDemo();
                  }}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>Try Demo Mode Walkthrough</span>
                </button>
              )}
            </div>
          ) : (
            queue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2 hover:border-outline-variant/60 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-xs text-primary truncate max-w-[200px] sm:max-w-xs">
                        {item.title}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-md bg-surface-container text-on-surface-variant text-[9px] uppercase font-bold tracking-wider">
                        {item.operationType}
                      </span>
                    </div>
                    <div className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <span>•</span>
                      <span>Strategy: Timestamp LWW</span>
                      {item.payload?.audioMetadata && (
                        <>
                          <span>•</span>
                          <span className="text-secondary font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">mic</span>
                            Voice Metadata ({item.payload.audioMetadata.durationSeconds}s)
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {getStatusBadge(item.status)}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-on-surface-variant/60 hover:text-rose-600 p-1 rounded-lg hover:bg-surface-container transition-colors"
                      title="Remove from queue"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Payload brief */}
                {item.payload && (
                  <div className="p-2 rounded-xl bg-surface-container-low/60 text-[11px] flex items-center justify-between gap-2">
                    <div className="truncate text-on-surface-variant">
                      {item.payload.price ? (
                        <span className="font-bold text-primary mr-2">₹{item.payload.price}</span>
                      ) : null}
                      <span>{item.payload.category || item.payload.craftTechnique || 'Artisan Craft'}</span>
                    </div>
                    {item.payload.images?.[0] && (
                      <img
                        src={item.payload.images[0]}
                        alt="Craft"
                        className="w-7 h-7 rounded-lg object-cover shrink-0 border border-outline-variant/30"
                      />
                    )}
                  </div>
                )}

                {item.errorMessage && (
                  <div className="text-[10px] text-rose-700 bg-rose-500/10 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">warning</span>
                    <span>{item.errorMessage}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
            <span>Conflict Handling: Timestamp-based Last-Write-Wins</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
