import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base styling: accessible touch targets (min 44px on mobile), smooth transition, no text wrap
  const baseClasses = 'inline-flex items-center justify-center font-sans font-semibold tracking-wide rounded-full transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none whitespace-nowrap';

  // Sizing
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 min-h-[36px] text-xs gap-1.5',
    md: 'px-5 py-2.5 min-h-[44px] text-sm gap-2',
    lg: 'px-6 py-3.5 min-h-[50px] text-base gap-2.5'
  }[size];

  // Variant Classes
  const variantClasses = {
    primary: 'bg-primary text-on-primary shadow-sm hover:opacity-95 border border-primary/20',
    secondary: 'bg-secondary text-on-secondary shadow-sm hover:opacity-95 border border-secondary/20',
    outline: 'bg-transparent text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/5',
    ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
    icon: 'p-2 min-h-[44px] min-w-[44px] rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container'
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        icon && <span className="material-symbols-outlined text-[18px] shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && iconRight && (
        <span className="material-symbols-outlined text-[18px] shrink-0">{iconRight}</span>
      )}
    </button>
  );
};

// Convenience component aliases
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline" {...props} />
);

export const IconButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="icon" {...props} />
);
