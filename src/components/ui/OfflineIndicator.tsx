import React from 'react';
import { SyncStatus } from '../../types';

export interface OfflineIndicatorProps {
  isOnline: boolean;
  syncStatus?: SyncStatus;
  pendingCount?: number;
  onToggleSimulation?: () => void;
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  syncStatus = 'synced',
  pendingCount = 0,
  onToggleSimulation,
  className = ''
}) => {
  return (
    <div
      className={`w-full transition-all duration-300 ${
        isOnline
          ? 'bg-emerald-50 border-b border-emerald-200 text-emerald-900'
          : 'bg-amber-50 border-b border-amber-200 text-amber-900'
      } ${className}`}
    >
      <div className="max-w-md mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOnline ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
            }`}
          />
          <span className="font-semibold text-[11px]">
            {isOnline
              ? syncStatus === 'pending_sync'
                ? `Online • Syncing ${pendingCount || 1} craft drafts...`
                : 'KalaConnect Online • Cloud Synchronized'
              : 'Offline Mode • Saved locally. We’ll upload when online.'}
          </span>
        </div>

        {onToggleSimulation && (
          <button
            type="button"
            onClick={onToggleSimulation}
            className="text-[10px] font-bold underline text-secondary hover:opacity-80 ml-2 shrink-0"
          >
            {isOnline ? 'Simulate Offline' : 'Go Online'}
          </button>
        )}
      </div>
    </div>
  );
};
