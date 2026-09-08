import React from 'react';

export interface VoiceActionButtonProps {
  isListening?: boolean;
  onClick: () => void;
  label?: string;
  sublabel?: string;
  size?: 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const VoiceActionButton: React.FC<VoiceActionButtonProps> = ({
  isListening = false,
  onClick,
  label = 'Tap to Speak',
  sublabel = 'Catalogue craft in your language',
  size = 'lg',
  className = '',
  disabled = false
}) => {
  const isLarge = size === 'lg';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Pulsating warmth wave rings when listening */}
        {isListening && (
          <>
            <span className="absolute w-24 h-24 rounded-full bg-secondary/30 animate-ping opacity-75" />
            <span className="absolute w-28 h-28 rounded-full bg-secondary/20 animate-pulse" />
          </>
        )}

        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          className={`relative z-10 flex items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg ${
            isLarge ? 'w-20 h-20' : 'w-16 h-16'
          } ${
            isListening
              ? 'bg-secondary text-on-secondary ring-4 ring-secondary/30 shadow-[0_8px_25px_rgba(180,83,9,0.45)]'
              : 'bg-primary text-on-primary hover:bg-primary-container ring-4 ring-surface shadow-[0_8px_25px_rgba(138,37,16,0.35)]'
          }`}
        >
          <span
            className={`material-symbols-outlined transition-transform ${
              isLarge ? 'text-[36px]' : 'text-[28px]'
            } ${isListening ? 'scale-110 animate-bounce' : ''}`}
          >
            {isListening ? 'graphic_eq' : 'mic'}
          </span>
        </button>
      </div>

      {label && (
        <span
          className={`mt-3 font-sans font-bold text-on-surface ${
            isLarge ? 'text-sm' : 'text-xs'
          }`}
        >
          {label}
        </span>
      )}

      {sublabel && (
        <span className="text-[11px] text-on-surface-variant font-medium mt-0.5 max-w-[200px]">
          {sublabel}
        </span>
      )}
    </div>
  );
};
