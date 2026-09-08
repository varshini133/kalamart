import React from 'react';
import { Artisan } from '../../types';
import { TrustBadge } from './TrustBadge';

export interface ArtisanCardProps {
  artisan: Artisan;
  onClick: (artisan: Artisan) => void;
  className?: string;
}

export const ArtisanCard: React.FC<ArtisanCardProps> = ({
  artisan,
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={() => onClick(artisan)}
      className={`group cursor-pointer rounded-3xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/50 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img
            src={artisan.image}
            alt={artisan.name}
            loading="lazy"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-secondary/30 bg-surface-container"
          />
          {artisan.giCertified && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[12px] shadow-xs">
              <span className="material-symbols-outlined text-[13px]">verified</span>
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-sans font-bold text-sm text-primary truncate group-hover:text-secondary transition-colors">
              {artisan.name}
            </h3>
          </div>

          <p className="text-xs text-on-surface-variant font-medium mt-0.5 truncate">
            {artisan.specialty}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-outline mt-1 truncate">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            <span className="truncate">{artisan.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-secondary text-[15px]">inventory_2</span>
          <span>{artisan.creationsCount} Master Works</span>
        </div>

        <div className="flex items-center gap-1 text-secondary font-bold group-hover:translate-x-0.5 transition-transform">
          <span>View Works</span>
          <span className="material-symbols-outlined text-[15px]">chevron_right</span>
        </div>
      </div>
    </div>
  );
};
