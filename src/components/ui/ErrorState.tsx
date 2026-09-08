import React from 'react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-error-container/30 border border-error/20 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-[24px]">sync_problem</span>
      </div>

      <h4 className="font-sans font-bold text-sm text-error mb-1">
        {title}
      </h4>

      <p className="text-xs text-on-surface-variant max-w-xs mb-3.5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon="refresh">
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
