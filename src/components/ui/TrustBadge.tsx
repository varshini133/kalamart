import React from 'react';

export type TrustBadgeType = 'gi-certified' | 'master-guild' | 'fair-trade' | 'eco-handcrafted' | 'zero-plastic';

export interface TrustBadgeProps {
  type?: TrustBadgeType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  type = 'gi-certified',
  label,
  size = 'sm',
  className = ''
}) => {
  const configs: Record<TrustBadgeType, { icon: string; defaultLabel: string; bg: string; text: string; border: string }> = {
    'gi-certified': {
      icon: 'verified_user',
      defaultLabel: 'GI Certified',
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      border: 'border-secondary/25'
    },
    'master-guild': {
      icon: 'workspace_premium',
      defaultLabel: 'Guild Master',
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/25'
    },
    'fair-trade': {
      icon: 'currency_rupee',
      defaultLabel: '87% Direct to Maker',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200'
    },
    'eco-handcrafted': {
      icon: 'eco',
      defaultLabel: '100% Natural Materials',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200'
    },
    'zero-plastic': {
      icon: 'recycling',
      defaultLabel: 'Zero-Plastic Packaging',
      bg: 'bg-stone-100',
      text: 'text-stone-800',
      border: 'border-stone-200'
    }
  };

  const config = configs[type];
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5';

  const iconSize = size === 'sm' ? 'text-[13px]' : 'text-[15px]';

  return (
    <span
      className={`inline-flex items-center font-sans font-bold uppercase tracking-wider rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className={`material-symbols-outlined ${iconSize}`}>{config.icon}</span>
      <span>{displayLabel}</span>
    </span>
  );
};
