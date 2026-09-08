import React, { useState } from 'react';
import { CartItem, Language } from '../types';
import { getTranslations } from '../services/localizationService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  language?: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  language = 'en'
}) => {
  const t = getTranslations(language);

  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const artisanRoyalty = Math.round(totalAmount * 0.87);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-primary/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-surface h-full flex flex-col shadow-2xl overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-high/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                {t.curatedBag} ({totalItemsCount})
              </h2>
              <p className="text-[11px] text-on-surface-variant font-medium">{t.directGISourced}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors active:scale-95"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-on-surface-variant space-y-3">
              <span className="material-symbols-outlined text-5xl text-outline/60">production_quantity_limits</span>
              <p className="font-headline-sm text-primary font-bold">{t.cartEmpty}</p>
              <p className="text-xs max-w-xs">{t.cartEmptySubtext}</p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-full bg-surface-container-high text-primary font-bold text-xs hover:bg-surface-container-highest transition-colors"
              >
                {language === 'ta' ? 'கைவினைகளை ஆராய்க' : language === 'hi' ? 'शिल्प देखें' : 'Explore Handcrafted Creations'}
              </button>
            </div>
          ) : (
            <>
              {/* Product items */}
              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex gap-3 items-center group relative hover:border-secondary/40 transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-surface-container flex-shrink-0 border border-outline-variant/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 text-[10px] text-secondary font-bold truncate">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          <span>{product.giTag || t.giCertified}</span>
                        </div>
                        {/* Remove Item Button */}
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="w-7 h-7 rounded-full text-outline hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors active:scale-90"
                          title="Remove item"
                          aria-label={`Remove ${product.title}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>

                      <h4 className="font-bold text-sm text-primary truncate leading-tight mt-0.5">
                        {product.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant truncate">
                        {t.artisan}: {product.artisanName}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="font-bold text-secondary text-sm">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                          {quantity > 1 && (
                            <span className="text-[10px] text-outline ml-1.5 font-normal">
                              (₹{product.price} each)
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center bg-surface-container rounded-full px-2 py-0.5 gap-2 border border-outline-variant/30">
                          <button
                            onClick={() => onUpdateQty(product.id, -1)}
                            className="text-on-surface hover:text-secondary active:scale-90 transition-transform"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="text-xs font-bold text-primary min-w-[14px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(product.id, 1)}
                            className="text-on-surface hover:text-secondary active:scale-90 transition-transform"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price & Royalty Summary Breakdown */}
              <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/25 space-y-2 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}):</span>
                  <span className="font-bold text-primary">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span>GI Eco-Packaging & Transit:</span>
                    <span className="text-[10px] text-secondary font-bold">FREE</span>
                  </span>
                  <span className="text-secondary font-semibold">₹0</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Applicable Craft GST:</span>
                  <span className="text-outline">Included (5%)</span>
                </div>
                <div className="pt-2 border-t border-outline-variant/30 flex justify-between font-bold text-sm text-primary">
                  <span>Order Total:</span>
                  <span className="text-base text-secondary font-display">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Ethical Royalty Highlight Card */}
              <div className="p-3.5 bg-gradient-to-br from-surface-container-high to-surface-container-low rounded-2xl border border-secondary/20 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">handshake</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-primary">{t.directRoyaltyBreakdown}</h5>
                    <p className="text-[10px] text-secondary font-semibold">87% {t.payoutToMaker}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-outline-variant/30">
                  <span className="text-on-surface-variant">{t.directRemittance}:</span>
                  <span className="font-bold text-primary">₹{artisanRoyalty.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  {t.directRoyaltySubtext}
                </p>
              </div>

              {/* Delivery Assurance */}
              <div className="p-3 bg-surface-container-lowest rounded-xl flex items-center gap-2.5 text-xs text-on-surface-variant border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[18px]">inventory_2</span>
                <span>{t.ecoPackagingNotice}</span>
              </div>
            </>
          )}
        </div>

        {/* Bottom Checkout Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/30 space-y-3 pb-safe">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-on-surface-variant">{t.totalPayable}</span>
                <p className="text-xl font-bold font-display text-primary">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full font-bold">
                {t.taxShippingIncluded}
              </span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full h-12 bg-secondary text-on-secondary rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all hover:bg-secondary-container"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
