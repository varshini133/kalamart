import React from 'react';
import { Product, Language } from '../../types';
import { TrustBadge } from './TrustBadge';
import { StatusBadge } from './StatusBadge';

export interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart?: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist?: (product: Product, e: React.MouseEvent) => void;
  isWishlisted?: boolean;
  language?: Language;
  showSyncStatus?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  language = 'en',
  showSyncStatus = false,
  className = ''
}) => {
  // Multilingual display
  const translated = product.marketplaceTranslations?.[language];
  const title = translated?.title || product.title;

  return (
    <div
      onClick={() => onClick(product)}
      className={`group cursor-pointer rounded-3xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden ${className}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-surface-container overflow-hidden">
        <img
          src={product.images[0]}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* GI Tag Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          <TrustBadge type="gi-certified" size="sm" />
          {showSyncStatus && product.syncStatus && (
            <StatusBadge status={product.syncStatus} size="sm" />
          )}
        </div>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product, e);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center text-primary hover:bg-surface transition-all shadow-xs z-10"
            title="Add to Wishlist"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isWishlisted ? 'text-secondary fill-current' : 'text-on-surface-variant'
              }`}
            >
              favorite
            </span>
          </button>
        )}

        {/* Price & Discount Pill */}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-xs font-bold text-primary shadow-xs">
          ₹{product.price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Content Meta */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant mb-0.5 truncate">
            <span className="material-symbols-outlined text-[13px] text-secondary">handshake</span>
            <span className="truncate">{product.artisanName}</span>
          </div>

          <h3 className="font-sans font-bold text-sm text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-[11px] text-outline mt-1 truncate">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            <span className="truncate">{product.craftOrigin}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-1 text-xs">
            <span className="material-symbols-outlined text-secondary text-[14px]">star</span>
            <span className="font-bold text-on-surface">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-outline">({product.reviewsCount})</span>
          </div>

          {onAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, e);
              }}
              className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center"
              title="Add to Cart"
            >
              <span className="material-symbols-outlined text-[17px]">add_shopping_cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
