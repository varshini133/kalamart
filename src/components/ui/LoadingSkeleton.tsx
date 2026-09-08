import React from 'react';

export const ShimmerBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-surface-container rounded-2xl ${className}`} />
);

export const ProductCardSkeleton: React.FC = () => (
  <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-3 flex flex-col space-y-3">
    <ShimmerBox className="w-full aspect-square rounded-2xl" />
    <div className="space-y-2">
      <ShimmerBox className="h-3 w-1/3 rounded-md" />
      <ShimmerBox className="h-4 w-5/6 rounded-md" />
      <ShimmerBox className="h-3 w-1/2 rounded-md" />
    </div>
    <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center">
      <ShimmerBox className="h-4 w-1/4 rounded-md" />
      <ShimmerBox className="h-7 w-7 rounded-full" />
    </div>
  </div>
);

export const ArtisanCardSkeleton: React.FC = () => (
  <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-4 flex flex-col space-y-3">
    <div className="flex items-center gap-3.5">
      <ShimmerBox className="w-14 h-14 rounded-2xl shrink-0" />
      <div className="space-y-2 flex-1">
        <ShimmerBox className="h-4 w-2/3 rounded-md" />
        <ShimmerBox className="h-3 w-1/2 rounded-md" />
        <ShimmerBox className="h-3 w-1/3 rounded-md" />
      </div>
    </div>
    <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center">
      <ShimmerBox className="h-3 w-1/3 rounded-md" />
      <ShimmerBox className="h-3 w-1/4 rounded-md" />
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-2 gap-3.5">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
