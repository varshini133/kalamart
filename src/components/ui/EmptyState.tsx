import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inventory_2',
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-surface-container-low border border-dashed border-outline-variant/60 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-3.5 shadow-inner">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>

      <h3 className="font-serif text-lg font-bold text-primary mb-1">
        {title}
      </h3>

      <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed mb-4">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
