import React from 'react';
import { OrderStatus, SyncStatus } from '../../types';

export type GeneralStatus = OrderStatus | SyncStatus | 'approved' | 'pending' | 'rejected' | 'in_stock' | 'low_stock';

export interface StatusBadgeProps {
  status: GeneralStatus;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
  className = ''
}) => {
  const getStyle = (): { bg: string; text: string; border: string; icon?: string; defaultLabel: string } => {
    switch (status) {
      case 'new':
      case 'pending':
      case 'pending_sync':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          icon: 'schedule',
          defaultLabel: status === 'pending_sync' ? 'Sync Pending' : 'Pending Review'
        };
      case 'accepted':
      case 'packing':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: 'inventory_2',
          defaultLabel: status === 'accepted' ? 'Order Accepted' : 'In Crafting'
        };
      case 'shipped':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-800',
          border: 'border-indigo-200',
          icon: 'local_shipping',
          defaultLabel: 'Shipped via SpeedPost'
        };
      case 'delivered':
      case 'synced':
      case 'approved':
      case 'in_stock':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200',
          icon: 'check_circle',
          defaultLabel: status === 'synced' ? 'Synced to Cloud' : status === 'approved' ? 'Verified' : 'Delivered'
        };
      case 'saved_local':
        return {
          bg: 'bg-stone-100',
          text: 'text-stone-800',
          border: 'border-stone-300',
          icon: 'cloud_off',
          defaultLabel: 'Saved Locally'
        };
      case 'cancelled':
      case 'rejected':
        return {
          bg: 'bg-red-50',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: 'cancel',
          defaultLabel: status === 'cancelled' ? 'Cancelled' : 'Refinements Needed'
        };
      case 'low_stock':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-800',
          border: 'border-orange-200',
          icon: 'priority_high',
          defaultLabel: 'Only Few Left'
        };
      default:
        return {
          bg: 'bg-surface-container',
          text: 'text-on-surface-variant',
          border: 'border-outline-variant/30',
          defaultLabel: String(status)
        };
    }
  };

  const config = getStyle();
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-sans font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {config.icon && (
        <span className={`material-symbols-outlined ${size === 'sm' ? 'text-[12px]' : 'text-[14px]'}`}>
          {config.icon}
        </span>
      )}
      <span>{displayLabel}</span>
    </span>
  );
};
