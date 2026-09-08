import React from 'react';

interface KalaMartLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  subtitle?: string;
  variant?: 'full' | 'mark';
}

export const KalaMartLogo: React.FC<KalaMartLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-primary',
  subtitle = 'Crafted Heritage',
  variant = 'full',
}) => {
  // Size mapping for the mark
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subTextSizes = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision KalaMart "K" Monogram Emblem */}
      <div className={`relative shrink-0 ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Left Decorative Pillar with Traditional Warli/Tribal Chevron */}
          <rect
            x="260"
            y="145"
            width="120"
            height="590"
            rx="14"
            fill="#B84318"
          />

          {/* White Chevron Zigzag Pattern */}
          <path
            d="
              M 360 185
              L 280 230
              L 360 275
              L 280 320
              L 360 365
              L 280 410
              L 360 455
              L 280 500
              L 360 545
              L 280 590
              L 360 635
              L 280 680
              L 305 695
            "
            stroke="#FFFFFF"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="miter"
            strokeMiterlimit="3"
            fill="none"
          />

          {/* Left Column Dots (inside the chevron left valleys) */}
          <circle cx="290" cy="185" r="11" fill="#FFFFFF" />
          <circle cx="290" cy="275" r="11" fill="#FFFFFF" />
          <circle cx="290" cy="365" r="11" fill="#FFFFFF" />
          <circle cx="290" cy="455" r="11" fill="#FFFFFF" />
          <circle cx="290" cy="545" r="11" fill="#FFFFFF" />
          <circle cx="290" cy="635" r="11" fill="#FFFFFF" />

          {/* Right Column Dots (inside the chevron right valleys) */}
          <circle cx="345" cy="230" r="11" fill="#FFFFFF" />
          <circle cx="345" cy="320" r="11" fill="#FFFFFF" />
          <circle cx="345" cy="410" r="11" fill="#FFFFFF" />
          <circle cx="345" cy="500" r="11" fill="#FFFFFF" />
          <circle cx="345" cy="590" r="11" fill="#FFFFFF" />
          <circle cx="345" cy="680" r="11" fill="#FFFFFF" />

          {/* Vertical Middle Strip */}
          <rect
            x="392"
            y="145"
            width="30"
            height="590"
            rx="8"
            fill="#B84318"
          />

          {/* Diagonal Upper Arm of "K" (Beveled horizontal top edge) */}
          <path
            d="
              M 422 445
              L 628 180
              H 768
              L 542 475
              Z
            "
            fill="#B84318"
          />

          {/* Diagonal Lower Leg of "K" */}
          <path
            d="
              M 422 430
              L 596 688
              Q 604 700 618 690
              L 672 630
              L 540 440
              Z
            "
            fill="#B84318"
          />

          {/* Accent Circular Dot at the base */}
          <circle
            cx="698"
            cy="678"
            r="62"
            fill="#B84318"
          />
        </svg>
      </div>

      {/* Typography: KalaMart */}
      {showText && variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span className={`font-serif font-bold ${textSizes[size]} ${textColor}`}>
              Kala
            </span>
            <span className={`font-sans font-extrabold ${textSizes[size]} text-secondary ml-0.5`}>
              Mart
            </span>
          </div>
          {subtitle && (
            <span className={`font-sans font-medium uppercase tracking-widest text-on-surface-variant/75 ${subTextSizes[size]} mt-0.5`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
