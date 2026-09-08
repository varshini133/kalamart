import React from 'react';
import { Product, Language } from '../../types';
import { trustService } from '../../services/trustService';
import { TrustBadgesRow } from '../trust/TrustBadgesRow';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  language?: Language;
  isB2BMode?: boolean;
  onRequestBulkQuote?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  language = 'en',
  isB2BMode = false,
  onRequestBulkQuote
}) => {
  const localizedTitle =
    language === 'hi' && product.hindiTitle ? product.hindiTitle : product.title;

  const trustDetails = trustService.getProductTrustDetails(product);

  const moq = product.moq || 10;
  const bulkPrice = product.bulkPrice || Math.round(product.price * 0.75);
  const productionCapacity = product.productionCapacity || '100 units / month';
  const approxLeadTime = product.approxLeadTime || '14–21 days';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-surface-container-lowest rounded-3xl p-3 sm:p-3.5 shadow-sm hover:shadow-md border border-outline-variant/30 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-secondary/60 active:scale-[0.99]"
    >
      {/* Visual Image Container */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-container mb-3">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
        />

        {/* Favorite/Wishlist Toggle Button */}
        <button
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          onClick={(e) => onToggleWishlist(product.id, e)}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-sm active:scale-75 ${
            isWishlisted ? 'text-secondary' : 'text-primary/70 hover:text-primary hover:bg-surface-container-lowest'
          }`}
          title={isWishlisted ? 'In Wishlist' : 'Save to Wishlist'}
        >
          <span
            className="material-symbols-outlined text-[19px]"
            style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {/* Trust Badge if verified */}
        {(product.giCertified || product.badge) && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary text-[10px] font-bold flex items-center gap-1 shadow-2xs border border-outline-variant/20">
            <span className="material-symbols-outlined text-[13px] text-secondary">
              {product.giCertified ? 'verified' : 'eco'}
            </span>
            <span className="truncate max-w-[100px]">
              {product.giCertified ? 'GI Certified' : product.badge}
            </span>
          </div>
        )}

        {/* Ready to ship / Dispatch tag */}
        {product.inStock && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-primary/80 backdrop-blur-sm text-on-primary text-[9px] font-semibold flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-pulse" />
            <span>{product.productionTime || 'Ready to ship'}</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Craft Category & Region pill */}
          <div className="flex items-center justify-between text-[11px] gap-1">
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold text-[10px] truncate max-w-[110px]">
              {product.category}
            </span>

            {product.rating && (
              <div className="flex items-center gap-0.5 text-secondary font-bold text-[11px]">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>{product.rating.toFixed(1)}</span>
                {product.reviewsCount > 0 && (
                  <span className="text-[10px] text-outline font-normal">
                    ({product.reviewsCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold text-primary line-clamp-2 leading-snug group-hover:text-secondary transition-colors">
            {localizedTitle}
          </h3>

          {/* Artisan Name & Location */}
          <div className="flex items-center gap-1 text-[11px] text-on-surface-variant truncate pt-0.5">
            <span className="material-symbols-outlined text-[13px] text-outline flex-shrink-0">
              person
            </span>
            <span className="truncate font-medium">{product.artisanName}</span>
            <span className="text-outline/50">•</span>
            <span className="truncate text-outline text-[10px]">
              {product.craftOrigin ? product.craftOrigin.split(',')[0] : 'India'}
            </span>
          </div>

          {/* Subtle Verified Trust Badges */}
          {trustDetails.badges.length > 0 && (
            <div className="pt-1">
              <TrustBadgesRow badges={trustDetails.badges.slice(0, 2)} size="sm" showLabels={true} />
            </div>
          )}

          {/* B2B Sourcing Metrics (Always visible in B2B mode or subtle preview) */}
          {(isB2BMode || product.bulkOrderAvailable !== false) && (
            <div className={`mt-2 p-2 rounded-xl text-[10px] space-y-1 ${
              isB2BMode ? 'bg-secondary/10 border border-secondary/25' : 'bg-surface-container/60 border border-outline-variant/20'
            }`}>
              <div className="flex items-center justify-between text-emerald-800 font-bold">
                <span className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  <span>Bulk Order Available</span>
                </span>
                <span className="text-[9px] text-secondary font-mono">MOQ: {moq}u</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px] text-on-surface-variant">
                <span className="truncate" title={`Capacity: ${productionCapacity}`}>
                  Cap: <strong className="text-primary">{productionCapacity}</strong>
                </span>
                <span className="truncate text-right" title={`Lead Time: ${approxLeadTime}`}>
                  Lead: <strong className="text-primary">{approxLeadTime}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price & Quick Add / Request Quote Action */}
        <div className="pt-2 border-t border-outline-variant/15 flex items-baseline justify-between gap-1">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-primary tracking-tight">
                ₹{isB2BMode ? bulkPrice.toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
              </span>
              {isB2BMode && (
                <span className="text-xs text-outline line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              {!isB2BMode && product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-outline line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount && !isB2BMode && (
                <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-1.5 py-0.2 rounded">
                  {product.discount}
                </span>
              )}
            </div>
            {isB2BMode && (
              <span className="text-[9px] text-secondary font-bold">
                Wholesale Tier (Save {Math.round(((product.price - bulkPrice) / product.price) * 100)}%)
              </span>
            )}
          </div>

          {isB2BMode ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRequestBulkQuote) {
                  onRequestBulkQuote(product, e);
                } else {
                  onSelect(product);
                }
              }}
              aria-label="Request Bulk Quote"
              className="px-2.5 py-1.5 rounded-full bg-secondary text-on-secondary hover:bg-secondary-container flex items-center gap-1 text-[10px] font-bold transition-all shadow-2xs active:scale-95"
              title="Request Bulk Quote"
            >
              <span className="material-symbols-outlined text-[13px]">request_quote</span>
              <span>Quote</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              aria-label="Add to Bag"
              className="w-8 h-8 rounded-full bg-surface-container text-primary hover:bg-secondary hover:text-on-secondary flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-90"
              title="Add to Bag"
            >
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
