import React, { forwardRef } from 'react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  onVoiceClick?: () => void;
  fullWidth?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  helperText,
  error,
  leadingIcon,
  trailingIcon,
  onVoiceClick,
  fullWidth = true,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col space-y-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-sans font-bold text-on-surface flex items-center justify-between"
        >
          <span>{label}</span>
          {props.required && <span className="text-secondary font-normal text-[11px]">*Required</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute left-3.5 text-outline material-symbols-outlined text-[18px] pointer-events-none">
            {leadingIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full font-sans text-sm rounded-2xl bg-surface-container-low border transition-all placeholder:text-outline/70 focus:outline-none focus:bg-surface focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed ${
            leadingIcon ? 'pl-10' : 'pl-3.5'
          } ${
            trailingIcon || onVoiceClick ? 'pr-11' : 'pr-3.5'
          } py-2.5 ${
            error
              ? 'border-error text-error focus:ring-error/20 focus:border-error'
              : 'border-outline-variant/40 text-on-surface focus:border-primary focus:ring-primary/20'
          }`}
          {...props}
        />

        {onVoiceClick ? (
          <button
            type="button"
            onClick={onVoiceClick}
            disabled={disabled}
            className="absolute right-2.5 p-1 rounded-full text-secondary hover:bg-secondary/10 transition-colors"
            title="Voice input"
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>
        ) : trailingIcon ? (
          <span className="absolute right-3.5 text-outline material-symbols-outlined text-[18px] pointer-events-none">
            {trailingIcon}
          </span>
        ) : null}
      </div>

      {error ? (
        <span className="text-[11px] font-medium text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">error</span>
          <span>{error}</span>
        </span>
      ) : helperText ? (
        <span className="text-[11px] text-on-surface-variant font-normal">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

InputField.displayName = 'InputField';
