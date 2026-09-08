import React, { useState } from 'react';
import { TrustBadgeId } from '../../types';
import { TRUST_BADGES_CONFIG, TrustBadgeMetadata } from '../../services/trustService';

interface TrustBadgesRowProps {
  badges: TrustBadgeId[];
  size?: 'sm' | 'md';
  interactive?: boolean;
  showLabels?: boolean;
}

export const TrustBadgesRow: React.FC<TrustBadgesRowProps> = ({
  badges,
  size = 'md',
  interactive = true,
  showLabels = true
}) => {
  const [selectedBadge, setSelectedBadge] = useState<TrustBadgeMetadata | null>(null);

  if (!badges || badges.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-1.5 flex-wrap">
        {badges.map((badgeId) => {
          const meta = TRUST_BADGES_CONFIG[badgeId];
          if (!meta) return null;

          if (size === 'sm') {
            return (
              <span
                key={badgeId}
                onClick={(e) => {
                  if (interactive) {
                    e.stopPropagation();
                    setSelectedBadge(meta);
                  }
                }}
                title={`${meta.label}: ${meta.description}`}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.badgeStyle.bg} ${meta.badgeStyle.text} ${meta.badgeStyle.border} ${
                  interactive ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[12px]">{meta.icon}</span>
                {showLabels && <span>{meta.shortLabel}</span>}
              </span>
            );
          }

          return (
            <button
              type="button"
              key={badgeId}
              onClick={(e) => {
                if (interactive) {
                  e.stopPropagation();
                  setSelectedBadge(meta);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                meta.badgeStyle.bg
              } ${meta.badgeStyle.text} ${meta.badgeStyle.border} ${
                interactive ? 'cursor-pointer hover:scale-[1.02] active:scale-95 shadow-2xs' : ''
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${meta.badgeStyle.iconBg}`}>
                <span className="material-symbols-outlined text-[11px]">{meta.icon}</span>
              </div>
              <span className="leading-none">{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Trust Badge Explanation Dialog */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${selectedBadge.badgeStyle.iconBg}`}>
                  <span className="material-symbols-outlined text-[22px]">{selectedBadge.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary">{selectedBadge.label}</h4>
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                    Verified Trust Signal
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="p-3 rounded-2xl bg-surface-container border border-outline-variant/20 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-on-surface">
                <span className="font-bold">Required Condition:</span>
                <span className="text-secondary font-medium">{selectedBadge.requiredLevel}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-normal">
                {selectedBadge.conditionMetText}
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] text-outline">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-secondary">verified</span>
                KalaConnect Trust Guarantee
              </span>
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="px-3 py-1 rounded-full bg-primary text-on-primary font-bold text-[11px] hover:opacity-90"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
